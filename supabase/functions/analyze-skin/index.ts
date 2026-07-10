import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Knowledge base: catalogo completo prodotti con categorie e tag
const PRODUCTS_KB = [
  { id: "1", name: "Detergente viso ultra delicato", brand: "Rigenera 0.1", category: "detersione", tags: ["pelle sensibile", "quotidiano", "delicato"], price: 59.9 },
  { id: "2", name: "Struccante Viso in Salvietta", brand: "Rigenera", category: "detersione", tags: ["pratico", "viaggio", "delicato"], price: 5.9 },
  { id: "4", name: "Flawless Mousse", brand: "Face+ SeboKey", category: "detersione", tags: ["pelle grassa", "pelle mista", "sebo-regolatore"], price: 34.9 },
  { id: "9", name: "Sweety Oil Milky", brand: "Face+ Sensation", category: "detersione", tags: ["delicato", "latte detergente", "pelle secca"], price: 36.9 },
  { id: "3", name: "Tonic.me", brand: "Rigenera Xaikonix", category: "tonico", tags: ["esfoliante", "luminosità", "anti-età", "AHA"], price: 59.9 },
  { id: "11", name: "Pinky Tonix", brand: "Face+ Sensation", category: "tonico", tags: ["lenitivo", "delicato", "pelle sensibile"], price: 39.9 },
  { id: "5", name: "Hama Cream", brand: "Face+ Sensation", category: "crema", tags: ["idratante", "nutriente", "quotidiano", "acido ialuronico"], price: 56.9 },
  { id: "6", name: "Retynol.me", brand: "Rigenera Xaikonix", category: "crema", tags: ["anti-età", "notte", "rigenerante", "retinolo"], price: 94.9 },
  
  { id: "12", name: "Luminor Recovery Cream", brand: "Face+", category: "crema", tags: ["anti-radicali", "recupero", "rigenerante"], price: 64.9 },
  { id: "15", name: "Mosqueta's Soft Cream", brand: "Face+ SeboKey", category: "crema", tags: ["nutriente", "rosa mosqueta", "pelle secca"], price: 54.9 },
  { id: "22", name: "Hydra.me", brand: "Rigenera Xaikonix", category: "crema", tags: ["idratante", "profonda", "pelle secca", "disidratata"], price: 79.9 },
  { id: "7", name: "Scrub.me", brand: "Rigenera Xaikonix", category: "scrub", tags: ["esfoliante", "rinnovamento", "luminosità"], price: 69.9 },
  { id: "14", name: "Smooth.me Step1 e Step2", brand: "Rigenera Xaikonix", category: "scrub", tags: ["peeling", "professionale", "rinnovamento"], price: 149.9 },
  { id: "16", name: "Blacky Coffee Scrub", brand: "Face+ Sensation", category: "scrub", tags: ["corpo", "energizzante", "caffè", "esfoliante"], price: 29.9 },
  { id: "17", name: "Green Face Scrub", brand: "Face+ Sensation", category: "scrub", tags: ["purificante", "vegetale", "pelle mista"], price: 32.9 },
  { id: "18", name: "Guanto Scrub Esfoliante", brand: "Rigenera", category: "scrub", tags: ["corpo", "esfoliante", "accessorio"], price: 12.9 },
  { id: "28", name: "JJ Scrubby", brand: "Face+ Sensation", category: "scrub", tags: ["delicato", "pelle sensibile", "esfoliante"], price: 34.9 },
  { id: "8", name: "Mask.me", brand: "Rigenera Xaikonix", category: "maschera", tags: ["idratante", "nutriente", "settimanale"], price: 89.9 },
  { id: "13", name: "Acn-End 10% Sulfur Suspension", brand: "Face+ SeboKey", category: "trattamento", tags: ["anti-brufoli", "pelle grassa", "trattamento mirato", "zolfo"], price: 39.9 },
  { id: "23", name: "Black End Purificante", brand: "Face+ SeboKey", category: "trattamento", tags: ["purificante", "punti neri", "pelle grassa"], price: 29.9 },
  { id: "25", name: "Perfect.me", brand: "Rigenera Xaikonix", category: "trattamento", tags: ["perfezionante", "anti-imperfezioni", "professionale"], price: 89.9 },
  { id: "24", name: "Boost Serum", brand: "Face+ Sensation", category: "siero", tags: ["luminosità", "concentrato", "booster"], price: 49.9 },
  { id: "26", name: "Serum.me", brand: "Rigenera Xaikonix", category: "siero", tags: ["anti-età", "concentrato", "attivi"], price: 99.9 },
  { id: "27", name: "Elisir Rigenerante", brand: "Rigenera", category: "siero", tags: ["rigenerante", "pelle matura", "elisir", "concentrato"], price: 79.9 },
  { id: "29", name: "Esosomi Serum", brand: "Rigenera", category: "siero", tags: ["esosomi", "rigenerazione cellulare", "innovativo", "anti-età"], price: 119.9 },
  { id: "19", name: "Magic Oil Stick Supersonic Hydra Serum", brand: "Face+", category: "olio", tags: ["idratante", "pratico", "viaggio", "stick"], price: 24.9 },
  { id: "20", name: "Bath Sea Salt", brand: "Rigenera", category: "corpo", tags: ["rilassante", "corpo", "bagno", "sali"], price: 19.9 },
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, age, time, skinDescription, hasSelfie, skinGoals, currentProducts, budget } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Determina lunghezza routine in base al tempo disponibile
    const timeStr = String(time || "").toLowerCase();
    const isQuick = timeStr.includes("5 min") || timeStr.includes("10 min");
    const stepCount = isQuick ? 3 : 5;
    const stepsHint = isQuick
      ? "La routine deve avere ESATTAMENTE 3 step essenziali: Detersione, Crema Idratante, Trattamento mirato (siero o SPF). NON includere tonico, scrub o maschera."
      : "La routine deve avere ESATTAMENTE 5 step nell'ordine: Detersione, Tonico, Trattamento, Crema Idratante, Esfoliazione/Maschera.";

    // Budget cap in euro per filtrare prodotti troppo costosi nel ranking
    const budgetStr = String(budget || "");
    let budgetHint = "";
    if (budgetStr.includes("50")) budgetHint = "Il budget complessivo della cliente è ENTRO i 50€: privilegia prodotti economici e necessari.";
    else if (budgetStr.includes("100")) budgetHint = "Il budget complessivo della cliente è FINO a 100€: bilancia qualità e prezzo.";
    else if (budgetStr.toLowerCase().includes("oltre")) budgetHint = "La cliente ha un budget OLTRE i 100€: puoi proporre prodotti premium.";

    const systemPrompt = `Sei un'esperta beauty consultant italiana specializzata in skincare.
Hai a disposizione il seguente catalogo di prodotti reali:

${JSON.stringify(PRODUCTS_KB, null, 2)}

Il tuo compito è analizzare le informazioni della cliente e creare una routine beauty personalizzata.

REGOLE IMPORTANTI:
- Devi selezionare SOLO prodotti dal catalogo fornito (usa gli ID esatti)
- ${stepsHint}
- Per ogni step seleziona 1-2 prodotti dal catalogo come raccomandati
- Per ogni step seleziona anche 1-2 prodotti ALTERNATIVI dalla stessa categoria o categoria simile (diversi da quelli raccomandati)
- Fornisci una spiegazione personalizzata per ogni step basata sulle esigenze della cliente
- Includi un'analisi generale della pelle della cliente
- Fornisci 3-4 consigli personalizzati, ognuno con un TITOLO descrittivo e un testo di spiegazione
- ${budgetHint}
- IMPORTANTE: Tutti i testi (analisi, descrizioni, consigli) devono essere SOLO testo semplice. NON usare Markdown: niente **grassetto**, niente *corsivo*, niente #, niente -, niente liste puntate, niente backtick.

RISPONDI ESCLUSIVAMENTE con una chiamata alla funzione fornita, senza testo aggiuntivo.`;

    const userPrompt = `Ecco le informazioni della cliente:
- Nome: ${name}
- Età: ${age}
- Tempo disponibile per la routine: ${time}
- Obiettivi pelle: ${Array.isArray(skinGoals) && skinGoals.length ? skinGoals.join(", ") : "non specificato"}
- Prodotti che usa già: ${Array.isArray(currentProducts) && currentProducts.length ? currentProducts.join(", ") : "nessuno indicato"}
- Budget: ${budget || "non specificato"}
- Descrizione della pelle e desideri: ${skinDescription}
- Ha caricato un selfie: ${hasSelfie ? "Sì" : "No"}

Crea la routine beauty personalizzata perfetta per ${name} con ${stepCount} step.`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "create_beauty_routine",
                description: "Crea una routine beauty personalizzata con analisi della pelle e step con prodotti selezionati dal catalogo.",
                parameters: {
                  type: "object",
                  properties: {
                    skin_analysis: {
                      type: "string",
                      description: "Analisi dettagliata della pelle della cliente (2-3 frasi personalizzate)",
                    },
                    personalized_tips: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          title: { type: "string", description: "Titolo breve e descrittivo del consiglio (es: 'Idratazione profonda', 'Protezione solare', 'Routine serale')" },
                          text: { type: "string", description: "Testo del consiglio personalizzato (1-2 frasi)" },
                        },
                        required: ["title", "text"],
                        additionalProperties: false,
                      },
                      description: "3-4 consigli personalizzati con titolo e testo",
                    },
                    steps: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          step_name: { type: "string", description: "Nome dello step (es: Detersione, Tonico, Trattamento, Crema Idratante, Esfoliazione)" },
                          step_order: { type: "number" },
                          icon: { type: "string", description: "Emoji per lo step" },
                          description: { type: "string", description: "Spiegazione personalizzata di perché questo step è importante per la cliente (1-2 frasi)" },
                          product_ids: {
                            type: "array",
                            items: { type: "string" },
                            description: "IDs dei prodotti RACCOMANDATI dal catalogo per questo step (1-2 prodotti)",
                          },
                          alternative_product_ids: {
                            type: "array",
                            items: { type: "string" },
                            description: "IDs di 1-2 prodotti ALTERNATIVI dalla stessa categoria, diversi da quelli raccomandati",
                          },
                        },
                        required: ["step_name", "step_order", "icon", "description", "product_ids", "alternative_product_ids"],
                        additionalProperties: false,
                      },
                    },
                  },
                  required: ["skin_analysis", "personalized_tips", "steps"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: {
            type: "function",
            function: { name: "create_beauty_routine" },
          },
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Troppe richieste, riprova tra qualche secondo." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Crediti AI esauriti." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    let routine;

    // Try tool_calls first (preferred)
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      try {
        routine = JSON.parse(toolCall.function.arguments);
      } catch (e) {
        console.error("Tool call parse failed:", e);
      }
    }

    // Fallback: parse JSON from content if tool_calls missing
    if (!routine) {
      const content = data.choices?.[0]?.message?.content || "";
      let cleaned = content.trim();
      if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
      }
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          routine = JSON.parse(jsonMatch[0]);
        } catch (parseError) {
          console.error("Content JSON parse failed:", (jsonMatch[0] as string).substring(0, 200));
        }
      }
    }

    if (!routine) {
      throw new Error("Could not extract routine from AI response");
    }

    return new Response(JSON.stringify({ success: true, routine }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-skin error:", e);
    return new Response(
      JSON.stringify({
        error: e instanceof Error ? e.message : "Errore sconosciuto",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
