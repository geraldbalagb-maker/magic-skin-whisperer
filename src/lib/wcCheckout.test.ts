import { describe, it, expect, vi, beforeEach } from "vitest";

const invoke = vi.fn();
vi.mock("@/integrations/supabase/client", () => ({ supabase: { functions: { invoke } } }));

import { buildWooCheckout } from "./wcCheckout";
import type { Product } from "@/data/products";

const p = (id: string, wcId?: number) => ({ id, wcId } as unknown as Product);

describe("buildWooCheckout", () => {
  beforeEach(() => invoke.mockReset());

  it("rejects an empty cart without calling the backend", async () => {
    expect((await buildWooCheckout([])).reason).toBe("empty_cart");
    expect(invoke).not.toHaveBeenCalled();
  });

  it("refuses products without a WooCommerce id instead of dropping them", async () => {
    const r = await buildWooCheckout([p("a", 11), p("b")]);
    expect(r).toMatchObject({ ok: false, reason: "wcId_missing:b" });
    expect(invoke).not.toHaveBeenCalled();
  });

  it("sends every product once with the bundle coupon", async () => {
    invoke.mockResolvedValue({ data: { url: "https://shop/x", expiresAt: 1 }, error: null });
    const r = await buildWooCheckout([p("a", 11), p("b", 22)], { coupon: "M22-BUNDLE10" });
    expect(invoke).toHaveBeenCalledWith("build-checkout-url", {
      body: { items: [{ id: 11, qty: 1 }, { id: 22, qty: 1 }], coupon: "M22-BUNDLE10" },
    });
    expect(r).toMatchObject({ ok: true, url: "https://shop/x" });
  });

  it("reports a failure when the signing service returns no link", async () => {
    invoke.mockResolvedValue({ data: null, error: { message: "secret missing" } });
    const r = await buildWooCheckout([p("a", 11)]);
    expect(r).toMatchObject({ ok: false, reason: "secret missing" });
  });
});
