// Turns the ME-22 /v1/analyze output into quiz pre-fills. No invented content:
// every sentence and concern is derived from fields returned by the engine.

export const ME22_CONCERNS = [
  "acne", "pelle con macchie", "pelle grassa", "pelle secca", "pori dilatati",
  "rosacea/rossori visibili", "rughe", "colorito spento", "pattern seborroico/eritema",
] as const;

export const CONCERN_LABELS: Record<string, string> = {
  "acne": "Acne e imperfezioni",
  "pelle con macchie": "Macchie e discromie",
  "pelle grassa": "Pelle grassa",
  "pelle secca": "Pelle secca",
  "pori dilatati": "Pori dilatati",
  "rosacea/rossori visibili": "Rossori visibili",
  "rughe": "Rughe e linee sottili",
  "colorito spento": "Colorito spento",
  "pattern seborroico/eritema": "Desquamazione / zone arrossate",
};

type Analysis = Record<string, unknown> | null | undefined;

const OBS: Record<string, string> = {
  redness: "rossori", oiliness: "lucidità/sebo", dryness: "secchezza", texture_irregularity: "grana irregolare",
  pores_visibility: "pori visibili", spots: "macchie", fine_lines: "linee sottili", under_eye: "segni sotto gli occhi",
  blemishes: "imperfezioni", post_blemish_marks: "segni post-imperfezione", dullness: "colorito spento",
  flaking: "desquamazione", perinasal_redness_pustules: "rossori intorno al naso", post_acne_scar_indicators: "segni di cicatrici post-acne",
};
const LEVEL: Record<string, string> = { low: "lievi", moderate: "moderati", medium: "moderati", high: "evidenti" };
const SKIN_TYPE: Record<string, string> = { normal: "normale", dry: "secca", oily: "grassa", combination: "mista", sensitive: "sensibile" };

export function concernsFromAnalysis(analysis: Analysis): string[] {
  const value = analysis?.mapped_me22_concerns;
  const mapped: unknown[] = Array.isArray(value) ? value : [];
  const allowed = new Set<string>(ME22_CONCERNS);
  return Array.from(new Set(mapped.filter((c): c is string => typeof c === "string" && allowed.has(c))));
}

export function describeAnalysis(analysis: Analysis): string {
  if (!analysis) return "";
  const parts: string[] = [];
  const profile = analysis.likely_skin_profile as { skin_type_hypothesis?: string } | undefined;
  const type = profile?.skin_type_hypothesis && SKIN_TYPE[profile.skin_type_hypothesis];
  if (type) parts.push(`Dalla foto la pelle appare ${type}.`);
  const obs = (analysis.visible_observations || {}) as Record<string, string>;
  const seen = Object.entries(obs)
    .filter(([key, value]) => OBS[key] && LEVEL[value])
    .map(([key, value]) => `${OBS[key]} ${LEVEL[value]}`);
  parts.push(seen.length ? `Osservazioni visibili: ${seen.join(", ")}.` : "Non emergono segni visibili rilevanti.");
  const concerns = concernsFromAnalysis(analysis).map(c => CONCERN_LABELS[c].toLowerCase());
  if (concerns.length) parts.push(`Aree su cui lavorare: ${concerns.join(", ")}.`);
  return parts.join(" ");
}
