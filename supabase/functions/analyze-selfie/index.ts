import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { selfie, name, age } = await req.json();
    if (!selfie) throw new Error("selfie mancante");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY non configurata");

    const systemPrompt = `Sei una skin analyst esperta. Osservi un selfie e produci una breve analisi visiva della pelle in italiano, scritta in PRIMA PERSONA come se fosse la cliente stessa a descrivere la propria pelle (usa "la mia pelle", "ho", "noto sul mio viso...").
Regole:
- Inizia DIRETTAMENTE con la descrizione, ad esempio "La pelle del mio viso è..." oppure "Ho una pelle...". 
- NON usare appellativi tipo "Cara", "Ciao", nomi propri o saluti. Mai rivolgerti a una seconda persona.
- 2-4 frasi, massimo 60 parole.
- Solo testo semplice, no markdown, no elenchi.
- Tono naturale, non medico.
- Concentrati su: tipo di pelle (secca/mista/grassa), texture, eventuali rossori, segni visibili (rughe, macchie, pori, imperfezioni), luminosità.
- Non fare diagnosi mediche, non parlare di etnia/età/genere.
- Non includere consigli o prodotti, solo l'osservazione.`;

    const userPrompt = `Analizza questo selfie. Rispondi solo con la descrizione della pelle in prima persona, senza saluti né nomi.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              { type: "text", text: userPrompt },
              { type: "image_url", image_url: { url: selfie } },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Troppe richieste, riprova tra qualche secondo." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Crediti AI esauriti." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content || "";
    const analysis = String(raw)
      .replace(/[*_`#>]+/g, "")
      .replace(/\n{2,}/g, "\n")
      .trim();

    return new Response(JSON.stringify({ success: true, analysis }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-selfie error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Errore sconosciuto" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
