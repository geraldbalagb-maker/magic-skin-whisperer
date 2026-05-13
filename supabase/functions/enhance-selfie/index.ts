import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

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

    // Retry con backoff esponenziale per errori transienti del gateway (502/503/504)
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
          body: JSON.stringify({
            model: "google/gemini-3.1-flash-image-preview",
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: `Use the provided image as the ONLY source of truth. Apply an EXTREMELY SUBTLE skin enhancement — the result must be barely noticeable at first glance, like a "before/after 2 weeks of light skincare", NOT a dramatic transformation.

CRITICAL — EXPOSURE & LIGHT:
- DO NOT brighten the image globally. Keep the EXACT same exposure, white balance, and ambient lighting of the original.
- DO NOT add any glow, bloom, highlight boost, HDR effect, or "luminosity".
- DO NOT lift shadows or recover highlights. Keep the original light direction and contrast intact.
- The output must have the SAME overall brightness histogram as the input. If in doubt, do LESS.

MANDATORY RULES:
1. Identity & composition — IDENTICAL to the original
   - Same framing, proportions, perspective, pose, expression
   - Same bone structure, eyes, nose, mouth, eyebrows, hairline
   - Same background, hair, clothing, accessories (glasses included), every non-face element pixel-faithful
   - No makeup, no filters, no stylization, no retouching of features

2. Skin work — MINIMAL and LOCAL to the face only
   - Very lightly even out the most obvious redness or blotchiness (max ~20% reduction, never full removal)
   - Soften only the most visible blemishes; keep moles, freckles, scars, stubble, beard hair
   - PRESERVE pores, fine lines, natural skin texture and grain — no smoothing, no airbrush, no "porcelain" look
   - DO NOT add shine, highlights, or glow to cheeks/forehead/nose
   - Skin tone, saturation and warmth must match the original almost exactly

3. Quality
   - Match the original sharpness — do not over-sharpen
   - Do not denoise aggressively; keep the natural sensor grain
   - No color grading, no cinematic LUT, no warm/cool shift

4. Realism check
   - The result must look like the SAME photo taken on the SAME day in the SAME light, just with skin in slightly better condition
   - A casual viewer should need a side-by-side comparison to notice the difference
   - If unsure between "more change" or "less change", always choose LESS

FINAL OUTPUT: a photorealistic, near-identical version of the original selfie with only a very subtle, natural skin improvement. Same exposure, same light, same identity. No glow, no brightening, no overexposure.`
                  },
                  { type: "image_url", image_url: { url: selfieBase64 } }
                ]
              }
            ],
            modalities: ["image", "text"]
          }),
        });

        if (r.ok) return r;
        // Retry solo per errori transienti
        if ([502, 503, 504, 408, 429].includes(r.status) && attempt < maxAttempts) {
          const delay = 600 * Math.pow(2, attempt - 1); // 600ms, 1.2s
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
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ success: false, error: "Troppe richieste, riprova tra qualche secondo." }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ success: false, error: "Crediti AI esauriti." }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText.slice(0, 300));
      // Fallback graceful: niente enhanced image, ma 200 così il client non crasha
      return new Response(
        JSON.stringify({ success: false, error: `AI gateway temporaneamente non disponibile (${response.status})` }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const enhancedImageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!enhancedImageUrl) {
      console.error("No image in AI response:", JSON.stringify(data).slice(0, 500));
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
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
