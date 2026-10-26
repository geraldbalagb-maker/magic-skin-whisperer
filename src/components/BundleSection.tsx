import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Check, ChevronRight, Shield, Truck, Clock, Star, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { buildWooCheckout, type WcCheckoutResult } from "@/lib/wcCheckout";
import { BUNDLE_COUPON } from "../../supabase/functions/_shared/me22Budget";
import type { Product } from "@/data/products";
import goldenEnvelopeImg from "@/assets/golden-envelope.jpg";

interface BundleSectionProps {
  products: Product[];
  bundleProducts?: Product[];
  cart: Set<string>;
  totalPrice: number;
  bundlePrice: number;
  onToggleCart: (id: string) => void;
  onAddAll: () => void;
  onCheckout: (products: Product[]) => void;
}

const benefits = [
  "Sconto esclusivo -10% riservato",
  "Risultati clinicamente testati in 28 giorni",
  "Spedizione Premium Gratuita",
  "Consulenza beauty coach inclusa",
];

const BundleSection = ({
  products,
  bundleProducts = products,
  cart,
  totalPrice,
  bundlePrice,
  onToggleCart,
  onAddAll,
  onCheckout,
}: BundleSectionProps) => {
  const savings = totalPrice - bundlePrice;
  const [loading, setLoading] = useState(false);
  const selectedProducts = products.filter(p => cart.has(p.id));
  const isFullBundle = cart.size === bundleProducts.length && bundleProducts.every(p => cart.has(p.id));

  const [lastCall, setLastCall] = useState<WcCheckoutResult | null>(null);
  const handleCheckout = async (selected: Product[], isBundle: boolean) => {
    if (loading || selected.length === 0) return;
    setLoading(true);
    const result = await buildWooCheckout(selected, { coupon: isBundle ? BUNDLE_COUPON : undefined });
    setLoading(false);
    setLastCall(result);
    if (!result.ok) {
      toast.error("Impossibile creare il link al carrello", {
        description: result.reason.startsWith("wcId_missing") ? "Alcuni prodotti non hanno il codice WooCommerce." : result.reason,
      });
    }
    // Keep the cart visible; the call is shown below so the store team can test it.
    setTimeout(() => document.getElementById("wc-call")?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
  };

  return (
    <section className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
          {/* ─── Left: Copy & CTA ─── */}
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              {/* Badge */}
              <span className="inline-block rounded-sm bg-foreground px-4 py-1.5 font-body text-[11px] font-bold uppercase tracking-[0.2em] text-background">
                Offerta esclusiva · -10%
              </span>

              {/* Headline */}
              <h2 className="mt-6 font-display text-3xl font-bold leading-tight text-foreground md:text-4xl lg:text-[2.75rem]">
                La tua routine completa
                <br />
                <span className="text-gradient-gold italic">ad un prezzo speciale.</span>
              </h2>

              {/* Description */}
              <p className="mt-5 max-w-md font-body text-sm leading-relaxed text-muted-foreground md:text-base">
                Abbiamo riunito i <strong className="text-foreground">{bundleProducts.length} prodotti essenziali</strong> per
                la tua pelle in un unico cofanetto di lusso. Solo per chi completa l'analisi:{" "}
                <strong className="text-foreground">-10% riservato</strong>, non disponibile sul sito.
              </p>

              {/* Benefits */}
              <ul className="mt-8 space-y-3">
                {benefits.map((b, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i, duration: 0.4 }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-foreground">
                      <Check className="h-3.5 w-3.5 text-background" strokeWidth={3} />
                    </div>
                    <span className="font-body text-sm text-foreground">{b}</span>
                  </motion.li>
                ))}
              </ul>

              {/* Pricing */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="mt-10 inline-flex items-end gap-4 rounded-sm border border-border bg-card p-6"
              >
                <div>
                  <p className="font-display text-2xl font-medium text-muted-foreground line-through md:text-3xl">
                    {totalPrice.toFixed(2)}€
                  </p>
                  <p className="mt-1 font-display text-4xl font-bold text-foreground md:text-5xl">
                    {bundlePrice.toFixed(2)}€
                  </p>
                </div>
                <span
                  className="discount-badge mb-2 rounded-sm px-3 py-1.5 font-body text-xs font-extrabold uppercase tracking-wider shadow-sm"
                >
                  -10% OFF
                </span>
              </motion.div>

              {/* CTA Buttons */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <motion.button
                  whileHover={loading ? {} : { scale: 1.02 }}
                  whileTap={loading ? {} : { scale: 0.97 }}
                  onClick={() => {
                    onAddAll();
                    handleCheckout(bundleProducts, true);
                  }}
                  disabled={loading}
                  className="flex items-center justify-center gap-2.5 rounded-sm bg-gradient-cta px-10 py-4 font-body text-xs font-bold uppercase tracking-[0.15em] text-cta-foreground shadow-cta transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ShoppingCart className="h-4 w-4" />
                  )}
                  {loading ? "Preparazione..." : "Aggiungi al Carrello"}
                </motion.button>

                {!isFullBundle && (
                  <motion.button
                    whileHover={loading ? {} : { scale: 1.02 }}
                    whileTap={loading ? {} : { scale: 0.97 }}
                    onClick={() => handleCheckout(selectedProducts, false)}
                    disabled={selectedProducts.length === 0 || loading}
                    className="flex items-center justify-center gap-2 rounded-none border border-border px-8 py-4 font-body text-xs font-medium uppercase tracking-wider text-foreground transition-all hover:border-foreground disabled:opacity-40"
                  >
                    Acquista selezionati ({selectedProducts.length})
                  </motion.button>
                )}
              </div>

              {/* Urgency */}
              <div className="mt-4 flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                <span className="font-body text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Disponibilità limitata
                </span>
              </div>
            </motion.div>
          </div>

          {/* ─── Right: Product Gift Box Grid ─── */}
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Decorative background */}
              <div className="absolute inset-0 -rotate-2 scale-[1.02] rounded-sm bg-gradient-cream" />

              <div className="relative grid grid-cols-2 gap-4 p-4">
                {products.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i, duration: 0.5 }}
                    whileHover={{ y: -4, rotate: i % 2 === 0 ? 1 : -1 }}
                    onClick={() => onToggleCart(p.id)}
                    className={`group relative cursor-pointer overflow-hidden rounded-sm border-2 bg-card p-3 shadow-sm transition-all duration-300 ${
                      cart.has(p.id)
                        ? "border-foreground"
                        : "border-transparent hover:border-border"
                    }`}
                  >
                    {/* Check mark */}
                    {cart.has(p.id) && (
                      <div className="absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-foreground">
                        <Check className="h-3.5 w-3.5 text-background" />
                      </div>
                    )}

                    <div className="aspect-square overflow-hidden rounded-sm bg-background p-2">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="mt-2 text-center">
                      <p className="font-body text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60">
                        {p.brand}
                      </p>
                      <p className="mt-0.5 truncate font-body text-xs font-medium text-foreground">
                        {p.name}
                      </p>
                      <p className="mt-1 font-display text-sm font-bold text-primary">
                        {p.price.toFixed(2)}€
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

            </motion.div>
          </div>
        </div>
        {lastCall && (
          <div id="wc-call" className="mt-12 border border-border bg-secondary p-5 text-left">
            <p className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Chiamata carrello WooCommerce</p>
            <p className="mt-3 font-body text-xs text-foreground">1. Richiesta alla funzione di firma <code>build-checkout-url</code>:</p>
            <pre className="mt-1 overflow-x-auto bg-background p-3 font-mono text-[11px] text-foreground">{JSON.stringify(lastCall.request ?? null, null, 2)}</pre>
            {lastCall.url ? (
              <>
                <p className="mt-3 font-body text-xs text-foreground">2. Link firmato generato (valido 15 minuti) verso il gestore carrello del negozio:</p>
                <pre className="mt-1 overflow-x-auto whitespace-pre-wrap break-all bg-background p-3 font-mono text-[11px] text-foreground">{lastCall.url}</pre>
                <a href={lastCall.url} className="mt-3 inline-block bg-foreground px-5 py-2.5 font-body text-[11px] font-semibold uppercase tracking-[0.15em] text-background">Apri il carrello sul negozio</a>
              </>
            ) : (
              <p className="mt-3 font-body text-xs text-destructive">Errore: {lastCall.reason}</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default BundleSection;
