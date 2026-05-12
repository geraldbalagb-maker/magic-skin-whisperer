import { motion } from "framer-motion";
import { ShoppingBag, Check, ChevronRight, Shield, Truck, Clock, Star } from "lucide-react";
import type { Product } from "@/data/products";
import goldenEnvelopeImg from "@/assets/golden-envelope.jpg";

interface BundleSectionProps {
  products: Product[];
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
  cart,
  totalPrice,
  bundlePrice,
  onToggleCart,
  onAddAll,
  onCheckout,
}: BundleSectionProps) => {
  const savings = totalPrice - bundlePrice;

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
                Abbiamo riunito i <strong className="text-foreground">{products.length} prodotti essenziali</strong> per
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
                  className="mb-2 rounded-sm px-3 py-1.5 font-body text-xs font-extrabold uppercase tracking-wider text-white shadow-sm"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, hsl(280 70% 75%) 0%, hsl(350 85% 65%) 50%, hsl(25 95% 65%) 100%)",
                  }}
                >
                  -25% OFF
                </span>
              </motion.div>

              {/* CTA Buttons */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    onAddAll();
                    onCheckout(products);
                  }}
                  className="flex items-center justify-center gap-2.5 rounded-sm bg-gradient-cta px-10 py-4 font-body text-xs font-bold uppercase tracking-[0.15em] text-cta-foreground shadow-cta transition-opacity hover:opacity-90"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Aggiungi al Carrello
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onCheckout(products.filter((p) => cart.has(p.id)))}
                  disabled={cart.size === 0}
                  className="flex items-center justify-center gap-2 rounded-none border border-border px-8 py-4 font-body text-xs font-medium uppercase tracking-wider text-foreground transition-all hover:border-foreground disabled:opacity-40"
                >
                  Acquista selezionati ({cart.size})
                </motion.button>
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
                {products.slice(0, 6).map((p, i) => (
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

              {/* Show remaining products count */}
              {products.length > 6 && (
                <div className="relative mt-2 text-center">
                  <span className="font-body text-xs text-muted-foreground">
                    + altri {products.length - 6} prodotti inclusi nel bundle
                  </span>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BundleSection;
