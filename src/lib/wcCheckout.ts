import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/data/products";

export interface WcCheckoutOptions {
  /** Coupon opzionale da applicare (es. "M22-BUNDLE10"). */
  coupon?: string;
}

export interface WcCheckoutResult {
  ok: boolean;
  reason: string;
  /** Payload sent to the signing function (shown so the store team can test the cart handler). */
  request?: { items: { id: number; qty: number }[]; coupon?: string };
  url?: string;
  expiresAt?: number;
}

/**
 * Costruisce l'URL firmato di checkout WooCommerce (senza reindirizzare: la chiamata viene mostrata).
 * L'URL viene generato al momento della chiamata sulla base dei prodotti attualmente
 * selezionati: qualsiasi modifica al carrello prima del click viene rispettata.
 */
export async function buildWooCheckout(
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

  const request = { items, coupon: opts.coupon };
  const { data, error } = await supabase.functions.invoke("build-checkout-url", { body: request });
  if (error || !data?.url) {
    return { ok: false, reason: error?.message || "no_url_returned", request };
  }
  return { ok: true, reason: "", request, url: data.url as string, expiresAt: data.expiresAt as number };
}
