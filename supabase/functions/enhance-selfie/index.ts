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
                    text: `Use the provided image as the ONLY source of truth. Your task is to enhance this selfie to show a subtle, believable "after skincare routine" result while strictly preserving the original identity.

MANDATORY RULES:
1. DO NOT alter, reinterpret, or redesign any element in the image
   - Keep IDENTICAL composition, framing, proportions, and perspective
   - Preserve every facial feature, expression, bone structure, and detail exactly as they are
   - Do NOT add or remove elements (no makeup, no accessories, no artistic filters)
   - Keep the background, hair, clothing, and all non-face areas EXACTLY the same

2. Perform high-end skin enhancement ONLY on the facial area
   - Make the skin look slightly smoother, more hydrated, and with a natural healthy glow
   - Subtly reduce visible redness, uneven tone, and minor blemishes
   - Add a soft, natural luminosity as if the skin is well-nourished and healthy
   - Keep pores and natural skin texture visible — do NOT create a "plastic" or airbrushed look
   - The improvement should look like the result of 4-6 weeks of a consistent skincare routine

3. Enhance image quality
   - Increase sharpness and micro-details (especially eyes, eyebrows, hair)
   - Remove noise, blur, and compression artifacts
   - Improve lighting balance and clarity ONLY if it reflects the original scene

4. Maintain photographic realism
   - No artistic filters, no cinematic grading, no stylization
   - Result must look like a real high-resolution photograph, not AI-generated
   - Do NOT add makeup effects of any kind

5. Respect original imperfections where relevant
   - Do not over-clean to the point of losing authenticity
   - Preserve natural grain if it contributes to realism

FINAL OUTPUT: A ultra-detailed, photorealistic, faithful enhancement of the original selfie with visibly healthier, glowing skin — as if captured with a modern high-end camera after weeks of skincare — without altering identity in any way.`
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
