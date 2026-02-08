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

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Edit ONLY the face and skin in this selfie photo to show a subtle, believable "after skincare routine" result. 
                
IMPORTANT RULES:
- Keep the background, hair, clothing, and all non-face areas EXACTLY the same
- Only enhance the FACIAL SKIN area
- Make the skin look slightly smoother, more hydrated, and with a natural healthy glow
- Reduce any visible redness, uneven tone, or minor blemishes subtly
- The result must look REALISTIC and NATURAL - not heavily filtered or artificial
- Do NOT change facial features, expression, or face shape
- The improvement should be noticeable but subtle - like the result of 4-6 weeks of a good skincare routine
- Maintain the same lighting, angle, and photo quality
- Do NOT add makeup effects`
              },
              {
                type: "image_url",
                image_url: {
                  url: selfieBase64
                }
              }
            ]
          }
        ],
        modalities: ["image", "text"]
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ success: false, error: "Troppe richieste, riprova tra qualche secondo." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ success: false, error: "Crediti AI esauriti." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const enhancedImageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!enhancedImageUrl) {
      console.error("No image in AI response:", JSON.stringify(data).slice(0, 500));
      throw new Error("No enhanced image returned from AI");
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
