import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * Analizza un selfie con Gemini vision e restituisce una MAPPA STRUTTURATA
 * degli inestetismi visibili con coordinate normalizzate (0..1) e severità (0..1).
 *
 * Il frontend usa questa mappa per applicare trattamenti targeted con canvas
 * (opzione D — mappa AI + rendering deterministico).
 *
 * Coordinate: origine in alto a sinistra dell'immagine.
 *   - `bbox`: [x, y, w, h] normalizzati (0..1)
 *   - `center`: [x, y] normalizzati (0..1)
 *   - `radius`: normalizzato sul lato minore
 */

type SkinConcernsMap = {
  redness: { bbox: [number, number, number, number]; severity: number }[];
  spots: { center: [number, number]; radius: number; severity: number }[];
  dark_circles: { left: number; right: number }; // severità 0..1 per occhio
  pores_tzone: number; // severità 0..1
  texture: { forehead: number; cheeks: number; chin: number };
};

const EMPTY_MAP: SkinConcernsMap = {
  redness: [],
  spots: [],
  dark_circles: { left: 0, right: 0 },
  pores_tzone: 0,
  texture: { forehead: 0, cheeks: 0, chin: 0 },
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { selfie } = await req.json();
    if (!selfie) throw new Error("selfie mancante");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY non configurata");

    const systemPrompt = `Sei un dermato-analista. Osservi un selfie frontale e restituisci UNA MAPPA STRUTTURATA in JSON degli inestetismi visibili sulla pelle.

Coordinate: origine (0,0) in alto a sinistra, tutte normalizzate 0..1 rispetto alla larghezza/altezza dell'immagine.

Restituisci SOLO un oggetto JSON con questa forma esatta (nessun testo prima o dopo, nessun markdown, nessuna \`\`\`):
{
  "redness": [
    { "bbox": [x, y, w, h], "severity": 0..1 }
  ],
  "spots": [
    { "center": [x, y], "radius": 0..0.1, "severity": 0..1 }
  ],
  "dark_circles": { "left": 0..1, "right": 0..1 },
  "pores_tzone": 0..1,
  "texture": { "forehead": 0..1, "cheeks": 0..1, "chin": 0..1 }
}

Regole:
- redness: aree diffuse di rossore (guance, ali del naso, mento). Max 4 bbox. Includi solo se visibili.
- spots: macchie, brufoletti, discromie puntuali. Max 8. radius piccolo (0.005..0.05). Severity = quanto è evidente.
- dark_circles: severità occhiaie per occhio sinistro/destro (0 = nessuna, 1 = molto marcate). Rispetto all'immagine (sinistro = a sinistra nella foto).
- pores_tzone: quanto sono visibili i pori nella zona T (fronte + naso).
- texture: irregolarità della texture per zona (0 = liscia, 1 = molto irregolare).
- Se non vedi un inestetismo, metti array vuoto o valore 0. NON inventare.
- Sii preciso ma non paranoico: la pelle normale ha valori bassi (0.1..0.3), non zero forzato e non massimi.
- Output: JSON puro, valido, parsabile con JSON.parse.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              { type: "text", text: "Analizza il selfie e restituisci la mappa JSON." },
              { type: "image_url", image_url: { url: selfie } },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const t = await response.text().catch(() => "");
      console.error("map-skin-concerns AI gateway error:", response.status, t);
      // Fallback graceful: mappa vuota → il filtro applicherà solo lo smoothing base.
      return new Response(JSON.stringify({ success: true, map: EMPTY_MAP, fallback: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content || "{}";

    let map: SkinConcernsMap = EMPTY_MAP;
    try {
      const parsed = JSON.parse(raw);
      map = {
        redness: Array.isArray(parsed.redness) ? parsed.redness.slice(0, 4) : [],
        spots: Array.isArray(parsed.spots) ? parsed.spots.slice(0, 8) : [],
        dark_circles: {
          left: clamp01(parsed?.dark_circles?.left),
          right: clamp01(parsed?.dark_circles?.right),
        },
        pores_tzone: clamp01(parsed?.pores_tzone),
        texture: {
          forehead: clamp01(parsed?.texture?.forehead),
          cheeks: clamp01(parsed?.texture?.cheeks),
          chin: clamp01(parsed?.texture?.chin),
        },
      };
    } catch (e) {
      console.warn("map-skin-concerns JSON parse failed, using empty map", e);
    }

    return new Response(JSON.stringify({ success: true, map }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("map-skin-concerns error:", e);
    return new Response(
      JSON.stringify({ success: true, map: EMPTY_MAP, fallback: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

function clamp01(v: unknown): number {
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}
