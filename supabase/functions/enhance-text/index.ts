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
    const { text, name } = await req.json();

    if (!text || text.trim().length < 5) {
      return new Response(
        JSON.stringify({ enhanced: text }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-lite",
          messages: [
            {
              role: "system",
              content: `Sei un'esperta di skincare. L'utente${name ? ` (${name})` : ""} sta descrivendo la propria pelle e le proprie esigenze. Riscrivi il testo mantenendo lo stesso significato ma rendilo più chiaro, dettagliato e utile per un'analisi della pelle. Non aggiungere informazioni inventate. IMPORTANTE: rispondi SOLO con testo semplice, in un unico paragrafo. NON usare Markdown: niente **grassetto**, niente *corsivo*, niente liste puntate, niente trattini iniziali, niente titoli con #, niente backtick. Rispondi SOLO con il testo migliorato, senza introduzioni o commenti.`,
            },
            { role: "user", content: text },
          ],
          max_tokens: 300,
        }),
      }
    );

    if (!response.ok) {
      return new Response(
        JSON.stringify({ enhanced: text }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content?.trim() || text;
    const enhanced = String(raw)
      .replace(/[*_`#>]+/g, "")
      .replace(/^\s*[-•]\s+/gm, "")
      .replace(/\n{2,}/g, "\n")
      .trim();

    return new Response(
      JSON.stringify({ enhanced }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("enhance-text error:", e);
    return new Response(
      JSON.stringify({ enhanced: "" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
