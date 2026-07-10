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

    const systemPrompt = `Sei una skin analyst esperta ed empatica. Osservi un selfie e produci una breve analisi visiva della pelle in italiano, scritta in PRIMA PERSONA come se fosse la cliente stessa a raccontare la propria pelle. Tono caldo ma CONCRETO e OSSERVAZIONALE, non poetico.

Regole di contenuto:
- Nomina 2-3 OSSERVAZIONI VISIBILI E SPECIFICHE tra: rossori localizzati (guance, ali del naso, mento), pori evidenti nella zona T, macchie o discromie, occhiaie, texture irregolare, secchezza o desquamazione, lucidità/oleosità della zona T, piccole imperfezioni o brufoletti, linee sottili. Sii concreta: dove le vedi e come si manifestano.
- Ancora ogni osservazione a una zona del viso ("sulle guance", "intorno al naso", "sotto gli occhi", "sulla fronte", "nella zona T").
- Chiudi con una frase propositiva collegata agli inestetismi osservati (es. "Vorrei una pelle più uniforme e meno arrossata", "Desidero attenuare le macchie e ritrovare compattezza").

Regole di stile:
- Prima persona, 3-5 frasi, 50-90 parole.
- Apertura sobria, es.: "Guardandomi allo specchio noto che…", "Sulla mia pelle vedo…", "Oggi la mia pelle mostra…". NON iniziare con "La pelle del mio viso oggi mi appare…" (formula abusata).
- VIETATI aggettivi vaghi o lirici: "delicata", "dolcezza", "vitalità", "piena luminosità", "un po' più… del solito", "a volte sento mancare", "grana fine", "morbidezza", "confidenza".
- VIETATI comparativi non verificabili ("più del solito", "meno di prima").
- No saluti, no "Cara", no nomi propri, no seconda persona, no diagnosi mediche, no età/etnia/genere, no consigli o prodotti.
- Solo testo semplice, no markdown, no elenchi, no titoli.
- SOLO ITALIANO. Vietate parole inglesi ("Overall", "Anyway", "However", "Indeed", "Basically", ecc.).

Esempio BUONO: "Guardandomi allo specchio noto un rossore diffuso sulle guance e intorno alle ali del naso, con qualche piccola imperfezione sul mento. La zona T tende alla lucidità mentre le guance appaiono più secche, e vedo un accenno di occhiaie sotto gli occhi. Vorrei una pelle più uniforme, meno arrossata e con una texture più compatta."

Esempio DA SCARTARE (troppo vago/poetico): "La pelle del mio viso oggi mi appare un po' più delicata del solito, con un leggero rossetto diffuso che le toglie un po' di uniformità. Vorrei ritrovare quella piena luminosità e vitalità che a volte sento mancare."`;

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
