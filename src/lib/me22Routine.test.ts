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
  it("flags a recommendation above the user's 100 euro budget instead of hiding the mismatch", () => {
    const result = adaptME22Routine(recommendation, "Pelle secca", "Fino a 100€");
    expect(result.personalized_tips[0].text).toContain("166.32€");
    expect(result.personalized_tips[0].text).toContain("100€");
    expect(adaptME22Routine(recommendation, "Pelle secca", "Oltre i 100€").personalized_tips).toEqual([]);
  });
  it("maps the 100 euro quiz limit to the engine's 100 euro low tier, not its 200 euro medium tier", () => {
    expect(getME22BudgetPolicy("Fino a 100€")).toEqual({ engineBudget: "low", tierPreference: "low_end", capEur: 100 });
  });
  it("preserves the 50 euro cap even though the engine has no matching tier", () => {
    expect(getME22BudgetPolicy("Entro i 50€").capEur).toBe(50);
    expect(adaptME22Routine(recommendation, "", "Entro i 50€").personalized_tips[0].text).toContain("50€");
  });
  it("checks the budget against the same final full-bundle price shown in results", () => {
    const affordable = { routine: { morning: [step({ ...cleanser, price: "36.90" }), step({ ...serum, price: "69.90" }, "serum")], evening: [step({ ...cleanser, price: "36.90" })], weekly: [] } };
    const result = adaptME22Routine(affordable, "", "Fino a 100€");
    expect(getRoutinePricing(getRoutineProducts(result))).toEqual({ totalPrice: 106.8, bundlePrice: 96.12 });
    expect(result.personalized_tips).toEqual([]);
    expect(result.resolved_products?.find(p => p.wcId === 23127)?.price).toBe(69.9);
  });
  it("still flags a genuine overrun after discount", () => {
    const over = { routine: { morning: [step({ ...cleanser, price: "111.12" })], evening: [], weekly: [] } };
    expect(getRoutinePricing([{ id: "wc-4359", price: 111.12 }]).bundlePrice).toBe(100.01);
    expect(adaptME22Routine(over, "", "Fino a 100€").personalized_tips[0].text).toContain("100.01€");
  });
});