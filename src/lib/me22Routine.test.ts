import { describe, expect, it } from "vitest";
import { adaptME22Routine, getRoutineProducts } from "./me22Routine";
import { getME22BudgetPolicy, getRoutinePricing } from "../../supabase/functions/_shared/me22Budget";

const cleanser = { product_id: 4359, name: "Rigenera 0.1 - Detergente viso ultra delicato", brand: "Rigenera", price: "59.90", sku: "R.01", permalink: "https://www.luxury-perfumes.net/prodotto/rigenera-01-detersione/", image_data: "data:image/jpeg;base64,AAAA", product_role: "cleanser" };
const serum = { ...cleanser, product_id: 23127, name: "Rigenera 0.2 - Acido Jaluronico", price: "124.9", sku: "R.02", product_role: "serum" };
const extra = { ...cleanser, product_id: 100945, name: "Face+ Luminor 24K Tonic (150ml)", price: "46.90", sku: "FACE+.59", product_role: "toner" };
const step = (product: typeof cleanser, slot = "cleanser") => ({ included: true, label: slot, slot, product });
const recommendation = { routine: { morning: [step(cleanser), step(serum, "serum")], evening: [step(cleanser), step(serum, "serum"), { ...step(extra, "toner"), included: false, product: null }], weekly: [] }, extra_products: [{ label: "Tonico", slot: "toner", period: "morning", product: extra }] };

describe("ME-22 routine and cart", () => {
  it("preserves morning and evening assignments without charging the same product twice", () => {
    const result = adaptME22Routine(recommendation, "Pelle secca");
    expect(result.steps.filter(s => s.period === "Sera").map(s => s.product_ids)).toEqual([["wc-4359"], ["wc-23127"]]);
    expect(getRoutineProducts(result).map(p => p.wcId)).toEqual([4359, 23127]);
    expect(getRoutineProducts(result).reduce((total, p) => total + p.price, 0)).toBeCloseTo(184.80);
  });
  it("keeps optional extras out of the default bundle but includes them when selected", () => {
    const result = adaptME22Routine(recommendation, "Pelle secca");
    expect(getRoutineProducts(result).map(p => p.wcId)).not.toContain(100945);
    expect(getRoutineProducts(result, new Set(["wc-100945"])).map(p => [p.wcId, p.price])).toEqual([[100945, 46.90]]);
  });
  it("uses authoritative engine IDs and prices instead of local catalog guesses", () => {
    const result = adaptME22Routine(recommendation, "Descrizione modificata");
    expect(result.skin_analysis).toBe("Descrizione modificata");
    expect(result.resolved_products?.find(p => p.wcId === 23127)?.price).toBe(124.9);
  });
  it("rejects invalid or empty recommendations rather than switching product engines silently", () => {
    expect(() => adaptME22Routine({}, "")).toThrow();
    expect(() => adaptME22Routine({ routine: { morning: [], evening: [], weekly: [] } }, "")).toThrow();
  });
  it("rejects product links outside the store", () => {
    expect(() => adaptME22Routine({ routine: { morning: [step({ ...cleanser, permalink: "https://example.com/product" })], evening: [], weekly: [] } }, "")).toThrow();
  });
  it("maps the three quiz budgets to ME-22 low/medium/high with 100/250/350 euro caps", () => {
    expect(getME22BudgetPolicy("Fino a 100€")).toMatchObject({ engineBudget: "low", capEur: 100, maxWithToleranceEur: 115 });
    expect(getME22BudgetPolicy("Fino a 250€")).toMatchObject({ engineBudget: "medium", capEur: 250, maxWithToleranceEur: 287.5 });
    expect(getME22BudgetPolicy("Fino a 350€")).toMatchObject({ engineBudget: "high", capEur: 350, maxWithToleranceEur: 402.5 });
  });
  it("accepts a routine within the 15% tolerance and flags one above it", () => {
    const within = { routine: { morning: [step({ ...cleanser, price: "127.70" })], evening: [], weekly: [] } }; // 114.93 after discount
    expect(adaptME22Routine(within, "", "Fino a 100€").personalized_tips).toEqual([]);
    const over = { routine: { morning: [step({ ...cleanser, price: "127.80" })], evening: [], weekly: [] } }; // 115.02 after discount
    expect(adaptME22Routine(over, "", "Fino a 100€").personalized_tips[0].title).toBe("Budget da verificare");
  });
  it("labels meaningful tips by source and hides generic boilerplate", () => {
    const result = adaptME22Routine({ ...recommendation, warnings: ["Evita retinolo in gravidanza.", "Introdurre un prodotto alla volta."], safety_notes: ["Patch test consigliato.", "Ambito cosmetico non diagnostico."] }, "", "Fino a 350€");
    expect(result.personalized_tips).toEqual([{ title: "Avviso sulla routine", text: "Evita retinolo in gravidanza." }]);
  });
  it("shows at most 3 notes", () => {
    const result = adaptME22Routine({ ...recommendation, warnings: ["A1.", "A2.", "A3.", "A4."] }, "", "Fino a 350€");
    expect(result.personalized_tips).toHaveLength(3);
  });
  it("uses the primary kit WooCommerce ID and price when individual routines are empty", () => {
    const { product_id: _id, ...product } = cleanser;
    const result = adaptME22Routine({ routine: { morning: [], evening: [], weekly: [] }, primary_kit: {
      status: "primary_proposal", requires_supervision: true, review_only: false,
      product: { ...product, id: 99680, name: "Rigenera Kit Pelle Normale", price: "519.40" },
    } }, "", "Fino a 350€");
    expect(getRoutineProducts(result).map(p => [p.wcId, p.price])).toEqual([[99680, 519.4]]);
    expect(getRoutinePricing(getRoutineProducts(result)).bundlePrice).toBe(467.46);
    expect(result.personalized_tips.map(t => t.title)).toEqual(["Budget da verificare", "Nota di sicurezza"]);
  });
  it("does not make a review-only kit purchasable", () => {
    expect(() => adaptME22Routine({ routine: { morning: [], evening: [], weekly: [] }, primary_kit: {
      status: "primary_proposal", review_only: true, product: cleanser,
    } }, "")).toThrow();
  });
});
