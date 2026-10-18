import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/data/products";

export interface WcCheckoutOptions {
  /** Coupon opzionale da applicare (es. "M22-BUNDLE10"). */
  coupon?: string;
}

export interface WcCheckoutResult {
  ok: boolean;
  reason: string;
}

/**
 * Costruisce l'URL firmato di checkout WooCommerce e reindirizza il browser.
 * L'URL viene generato al momento della chiamata sulla base dei prodotti attualmente
 * selezionati: qualsiasi modifica al carrello prima del click viene rispettata.
 */
export async function redirectToWooCheckout(
  products: Product[],
  opts: WcCheckoutOptions = {},
): Promise<WcCheckoutResult> {
  if (!products.length) return { ok: false, reason: "empty_cart" };

  const missing = products.filter((p) => !p.wcId);
  if (missing.length) {
    return {
      ok: false,
      reason: `wcId_missing:${missing.map((p) => p.id).join(",")}`,
    };
  }

  const items: { id: number; qty: number }[] = [];
  for (const product of products) {
    if (typeof product.wcId !== "number") return { ok: false, reason: `wcId_missing:${product.id}` };
    items.push({ id: product.wcId, qty: 1 });
  }

  const { data, error } = await supabase.functions.invoke("build-checkout-url", {
    body: { items, coupon: opts.coupon },
  });

  if (error || !data?.url) {
    return { ok: false, reason: error?.message || "no_url_returned" };
  }

  window.location.href = data.url as string;
  return { ok: true, reason: "" };
}
