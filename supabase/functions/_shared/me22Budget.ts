// Shared, dependency-free policy for the proxy, routine validation and checkout display.
export const BUNDLE_DISCOUNT_PERCENT = 10;
export const BUNDLE_COUPON = "M22-BUNDLE10";
/** ME-22 tiers accept routines up to 15% above the nominal cap. */
export const BUDGET_TOLERANCE_PERCENT = 15;

export const BUDGET_OPTIONS = ["Fino a 100€", "Fino a 250€", "Fino a 350€"] as const;

export function getME22BudgetPolicy(budget: string) {
  const withTolerance = (cap: number) => Math.round(cap * (100 + BUDGET_TOLERANCE_PERCENT)) / 100;
  switch (budget) {
    case "Fino a 100€":
      return { engineBudget: "low", capEur: 100, maxWithToleranceEur: withTolerance(100) } as const;
    case "Fino a 250€":
      return { engineBudget: "medium", capEur: 250, maxWithToleranceEur: withTolerance(250) } as const;
    case "Fino a 350€":
      return { engineBudget: "high", capEur: 350, maxWithToleranceEur: withTolerance(350) } as const;
    default:
      return { engineBudget: "medium", capEur: null, maxWithToleranceEur: null } as const;
  }
}

export function getRoutinePricing(products: ReadonlyArray<{ id: string; price: number }>) {
  const unique = new Map(products.map(product => [product.id, product]));
  const totalCents = Array.from(unique.values()).reduce((sum, product) => sum + Math.round(product.price * 100), 0);
  const bundleCents = Math.round(totalCents * (100 - BUNDLE_DISCOUNT_PERCENT) / 100);
  return { totalPrice: totalCents / 100, bundlePrice: bundleCents / 100 };
}
