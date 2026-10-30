import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { forbidden, isAllowedOrigin } from "../_shared/origin.ts";


const SYSTEM_PROMPT = `You are a photorealistic dermatology retoucher. You will receive a real selfie and must return the SAME photo edited to simulate the visible effect of a personalized skincare routine after 6–8 weeks of consistent use.

ABSOLUTE RULES — DO NOT BREAK:
1. IDENTITY: keep the exact same person. Same bone structure, eyes, nose, mouth, ears, eyebrows, hairline, jawline, chin, teeth, facial hair, moles, freckles, scars, beauty marks. No rejuvenation, no reshaping, no slimming, no makeup. If unsure, do LESS, never more.
2. COMPOSITION: same framing, pose, perspective, expression, gaze direction, head angle. Background pixel-identical. Hair, clothing, accessories (glasses, earrings) unchanged.
3. LIGHT & EXPOSURE: same white balance, same exposure, same shadow/highlight distribution, same light direction. NO global brightening. NO glow, bloom, HDR, or highlight boost. The histogram must stay essentially the same. Improvement must come from SKIN QUALITY, not from lighting.
4. REALISM: match original sharpness and sensor grain. No airbrush, no porcelain, no plastic skin, no beauty-filter look. Pores and fine skin texture must remain visible.

WHAT TO IMPROVE (localized on facial skin ONLY):
- Reduce diffuse redness on cheeks, nose wings, chin by ~45–55%. Leave a natural warm undertone.
- Attenuate visible blemishes, small pimples, post-acne marks, and dark spots by ~50–60%. Keep a few faint traces so it looks natural, not erased.
- Improve overall skin tone evenness (reduce blotchiness, patchy discoloration).
- Slightly attenuate under-eye darkness by ~35–45%. Never fully erase — a hint of shadow must remain.
- Reduce visible pore congestion in the T-zone; keep individual pores.
- Smooth the roughest texture irregularities WITHOUT losing pores, fine lines, or expression lines.
- Very light softening of the deepest expression lines (~20% attenuation max). Keep every line the person owns — no anti-aging.

QUALITY CHECK BEFORE RETURNING:
- If the person would not recognize themselves instantly → you went too far.
- If the photo looks brighter or "shinier" → you brightened globally. Redo the skin work locally instead.
- If skin looks plastic or airbrushed → restore pores and texture.
- The viewer must describe the difference as: "her skin looks calmer, clearer and more even" — never as "the photo is brighter" or "she looks younger".

OUTPUT: one photorealistic image, same dimensions as the input, same person, same light, same background — with skin visibly healthier as after a real skincare routine.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (!isAllowedOrigin(req)) return forbidden(corsHeaders);

  try {
    const { selfieBase64 } = await req.json();

    if (!selfieBase64) {
      return new Response(
        JSON.stringify({ success: false, error: "No selfie provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const body = {
      model: "google/gemini-3-pro-image",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: SYSTEM_PROMPT },
            { type: "image_url", image_url: { url: selfieBase64 } },
          ],
        },
      ],
      modalities: ["image", "text"],
    };

    const callGateway = async (): Promise<Response> => {
      const maxAttempts = 3;
      let lastErr: Response | null = null;
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
        if (r.ok) return r;
        if ([502, 503, 504, 408, 429].includes(r.status) && attempt < maxAttempts) {
          const delay = 800 * Math.pow(2, attempt - 1);
          console.warn(`AI gateway ${r.status}, retry ${attempt}/${maxAttempts - 1} in ${delay}ms`);
          await new Promise((res) => setTimeout(res, delay));
          lastErr = r;
          continue;
        }
        return r;
      }
      return lastErr!;
    };

    const response = await callGateway();

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText.slice(0, 500));
      const userMsg =
        response.status === 429
          ? "Troppe richieste, riprova tra qualche secondo."
          : response.status === 402
          ? "Crediti AI esauriti."
          : `AI gateway temporaneamente non disponibile (${response.status})`;
      return new Response(
        JSON.stringify({ success: false, error: userMsg }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const enhancedImageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!enhancedImageUrl) {
      console.error("No image in AI response:", JSON.stringify(data).slice(0, 800));
      return new Response(
        JSON.stringify({ success: false, error: "Nessuna immagine generata dall'AI" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, enhancedImage: enhancedImageUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("enhance-selfie error:", e);
    return new Response(
      JSON.stringify({
        success: false,
        error: e instanceof Error ? e.message : "Errore sconosciuto",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
