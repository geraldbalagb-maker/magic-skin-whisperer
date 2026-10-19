import { z } from "zod";
import { products, type Product } from "@/data/products";
import type { AIRoutineResult } from "@/components/AnalysisScreen";
import { getME22BudgetPolicy, getRoutinePricing } from "../../supabase/functions/_shared/me22Budget";

const engineProduct = z.object({
  product_id: z.number().int().positive(), name: z.string().min(1), brand: z.string(),
  price: z.union([z.string(), z.number()]).transform(Number).refine(p => Number.isFinite(p) && p >= 0),
  sku: z.string().optional(), permalink: z.string().url(), image: z.string().url().optional(),
  image_data: z.string().regex(/^data:image\/(jpeg|png|webp);base64,/).nullable().optional(),
  product_role: z.string().optional(),
});
const engineStep = z.object({
  label: z.string(), slot: z.string(), included: z.boolean(),
  inclusion_reason: z.string().optional(), warnings: z.array(z.string()).optional(),
  product: engineProduct.nullable(),
});
const recommendationSchema = z.object({
  analysis_summary: z.string().optional(),
  warnings: z.array(z.string()).optional(),
  safety_notes: z.array(z.string()).optional(),
  routine: z.object({ morning: z.array(engineStep), evening: z.array(engineStep), weekly: z.array(engineStep) }),
  extra_products: z.array(engineStep.omit({ included: true }).extend({ period: z.string() })).optional(),
});
const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");
const validShopUrl = (value: string) => {
  const url = new URL(value);
  if (url.protocol !== "https:" || !["www.luxury-perfumes.net", "luxury-perfumes.net"].includes(url.hostname)) {
    throw new Error("Il motore ha restituito un collegamento prodotto non valido.");
  }
  return value;
};
const roles: Record<string, Product["category"]> = { cleanser: "detersione", toner: "tonico", cream: "crema", serum: "siero", exfoliant: "scrub", mask: "maschera", oil: "olio" };

export function adaptME22Routine(raw: unknown, skinDescription: string, budget = ""): AIRoutineResult {
  const parsed = recommendationSchema.safeParse(raw);
  if (!parsed.success) throw new Error("Il motore ME-22 ha restituito una routine incompleta. Riprova tra poco.");
  const recommendation = parsed.data;
  const catalog = new Map<string, Product>();
  const resolve = (p: z.infer<typeof engineProduct>): string => {
    const id = `wc-${p.product_id}`;
    const existing = catalog.get(id);
    if (existing) {
      if (existing.name !== p.name || existing.price !== p.price) throw new Error("Dati prodotto incoerenti nella routine ME-22.");
      return id;
    }
    const link = validShopUrl(p.permalink);
    const local = products.find(local => local.wcId === p.product_id || normalize(local.link) === normalize(link) || normalize(`${local.brand}${local.name}`) === normalize(p.name));
    if (!local && !p.image_data) throw new Error(`Immagine non disponibile per ${p.name}. Riprova tra poco.`);
    catalog.set(id, {
      id, wcId: p.product_id, name: p.name, brand: p.brand, price: p.price,
      description: local?.description || "", image: local?.image || p.image_data || "",
      category: local?.category || roles[p.product_role || ""] || "trattamento",
      tags: local?.tags || [], rating: local?.rating || 0, link,
    });
    return id;
  };
  const periods = [{ key: "morning", title: "Mattina" }, { key: "evening", title: "Sera" }, { key: "weekly", title: "Settimanale" }] as const;
  const steps: AIRoutineResult["steps"] = [];
  for (const period of periods) {
    for (const step of recommendation.routine[period.key]) {
      if (!step.included || !step.product) continue;
      const id = resolve(step.product);
      const alternatives = (recommendation.extra_products || [])
        .filter(extra => extra.period === period.key && extra.slot === step.slot && extra.product)
        .flatMap(extra => extra.product ? [resolve(extra.product)] : [])
        .filter(alt => alt !== id);
      steps.push({ step_name: step.label, step_order: steps.length + 1, icon: step.slot,
        period: period.title, description: [step.inclusion_reason, ...(step.warnings || [])].filter(Boolean).join(" "),
        product_ids: [id], alternative_product_ids: alternatives });
    }
    // Optional upgrades for roles omitted from the base routine remain unselected.
    for (const extra of recommendation.extra_products || []) {
      if (extra.period !== period.key || !extra.product || steps.some(s => s.period === period.title && s.icon === extra.slot)) continue;
      steps.push({ step_name: extra.label, step_order: steps.length + 1, icon: extra.slot, period: period.title,
        description: extra.inclusion_reason || "", product_ids: [], alternative_product_ids: [resolve(extra.product)] });
    }
  }
  if (!steps.some(step => step.product_ids.length)) throw new Error("Il motore ME-22 non ha assegnato prodotti acquistabili alla routine.");
  // Tips are only what ME-22 returned, labelled by their source field.
  const tips = [
    ...(recommendation.warnings || []).map(text => ({ title: "Avviso sulla routine", text })),
    ...(recommendation.safety_notes || []).map(text => ({ title: "Nota di sicurezza", text })),
  ].filter((tip, i, all) => all.findIndex(t => t.text === tip.text) === i);
  const baseIds = new Set(steps.flatMap(step => step.product_ids));
  const { bundlePrice } = getRoutinePricing(Array.from(catalog.values()).filter(p => baseIds.has(p.id)));
  const { capEur, maxWithToleranceEur } = getME22BudgetPolicy(budget);
  if (capEur !== null && maxWithToleranceEur !== null && bundlePrice > maxWithToleranceEur) tips.unshift({ title: "Budget da verificare", text: `La routine completa costa ${bundlePrice.toFixed(2)}€ con lo sconto riservato, oltre il budget di ${capEur}€ anche considerando la tolleranza del 15% (${maxWithToleranceEur.toFixed(2)}€). Puoi togliere prodotti prima dell'acquisto.` });
  return { skin_analysis: skinDescription || recommendation.analysis_summary || "Analisi cosmetica non diagnostica.", personalized_tips: tips, steps, resolved_products: Array.from(catalog.values()) };
}

export function getRoutineProducts(result: AIRoutineResult, selected?: Set<string>): Product[] {
  const catalog = new Map((result.resolved_products || products).map(p => [p.id, p]));
  const ids = new Set(result.steps.flatMap(step => selected
    ? [...step.product_ids, ...(step.alternative_product_ids || [])].filter(id => selected.has(id))
    : step.product_ids));
  return Array.from(ids).flatMap(id => { const p = catalog.get(id); return p ? [p] : []; });
}