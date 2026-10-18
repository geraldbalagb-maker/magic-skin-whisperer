// Shared, dependency-free policy for the proxy, routine validation and checkout display.
export const BUNDLE_DISCOUNT_PERCENT = 10;
export const BUNDLE_COUPON = "M22-BUNDLE10";

export function getME22BudgetPolicy(budget: string) {
  switch (budget) {
    case "Entro i 50€":
      // The engine has no tier below a €100 base. Preserve the actual €50 cap.
      return { engineBudget: "low", tierPreference: "low_end", capEur: 50 } as const;
    case "Fino a 100€":
      return { engineBudget: "low", tierPreference: "low_end", capEur: 100 } as const;
    case "Oltre i 100€":
      return { engineBudget: "high", tierPreference: "high_end", capEur: null } as const;
    default:
      return { engineBudget: "medium", tierPreference: "auto", capEur: null } as const;
  }
}

export function getRoutinePricing(products: ReadonlyArray<{ id: string; price: number }>) {
  const unique = new Map(products.map(product => [product.id, product]));
  const totalCents = Array.from(unique.values()).reduce((sum, product) => sum + Math.round(product.price * 100), 0);
  const bundleCents = Math.round(totalCents * (100 - BUNDLE_DISCOUNT_PERCENT) / 100);
  return { totalPrice: totalCents / 100, bundlePrice: bundleCents / 100 };
}