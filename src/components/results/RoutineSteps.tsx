import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Star, Check, ChevronDown } from "lucide-react";
import type { Product, RoutineStep } from "@/data/products";
import { products as allProducts } from "@/data/products";
import SectionHeader from "../shared/SectionHeader";
import routineCleansingImg from "@/assets/steps/routine-step-cleansing.png";
import routineTonerImg from "@/assets/steps/routine-step-toner.png";
import routineTreatmentImg from "@/assets/steps/routine-step-treatment.png";
import routineMoisturizerImg from "@/assets/steps/routine-step-cream.png";
import routineExfoliationImg from "@/assets/steps/routine-step-mask.png";

const stepImages = [routineCleansingImg, routineTonerImg, routineTreatmentImg, routineMoisturizerImg, routineExfoliationImg];

const productsMap = new Map(allProducts.map(p => [p.id, p]));

interface RoutineStepWithAlts extends RoutineStep {
  alternativeProducts?: Product[];
}

interface RoutineStepsProps {
  routine: RoutineStepWithAlts[];
  cart: Set<string>;
  onToggleCart: (id: string) => void;
}

const ProductCard = ({ product, cart, onToggleCart, isAlternative = false }: {
  product: Product;
  cart: Set<string>;
  onToggleCart: (id: string) => void;
  isAlternative?: boolean;
}) => (
  <motion.div
    whileHover={{ y: -1 }}
    transition={{ duration: 0.2 }}
    className={`group flex items-center gap-4 border p-3.5 transition-colors ${
      isAlternative
        ? "border-dashed border-border/60 bg-background hover:border-foreground/30"
        : "border-border bg-background hover:border-foreground/40"
    }`}
  >
    <div className="flex h-[72px] w-[72px] flex-shrink-0 items-center justify-center overflow-hidden bg-secondary p-1.5">
      <img src={product.image} alt={product.name} className="h-full w-full object-contain" />
    </div>

    <div className="min-w-0 flex-1">
      <p className="font-body text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">{product.brand}</p>
      <p className="truncate font-display text-base font-medium text-foreground">{product.name}</p>
      <p className="mt-0.5 line-clamp-2 font-body text-[11px] leading-snug text-muted-foreground/70">
        {product.description}
      </p>
      <div className="mt-1 flex items-center gap-2">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: product.rating }).map((_, i) => (
            <Star key={i} className="h-3 w-3 fill-foreground text-foreground" />
          ))}
        </div>
        <span className="font-display text-base font-semibold text-foreground">{product.price.toFixed(2)}€</span>
      </div>
    </div>

    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={() => onToggleCart(product.id)}
      className={`flex h-10 w-10 flex-shrink-0 items-center justify-center transition-all duration-200 ${
        cart.has(product.id)
          ? "bg-foreground text-background"
          : "border border-border bg-background text-muted-foreground hover:border-foreground hover:text-foreground"
      }`}
    >
      {cart.has(product.id) ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
    </motion.button>
  </motion.div>
);

const RoutineSteps = ({ routine, cart, onToggleCart }: RoutineStepsProps) => {
  const [expandedAlts, setExpandedAlts] = useState<Set<string>>(new Set());

  const toggleAlts = (stepId: string) => {
    setExpandedAlts((prev) => {
      const next = new Set(prev);
      next.has(stepId) ? next.delete(stepId) : next.add(stepId);
      return next;
    });
  };

  return (
    <>
      <div className="mx-auto max-w-5xl px-4 pt-16 pb-6 text-center">
        <SectionHeader
          label="Step by step"
          title={`La tua routine in ${routine.length} passaggi`}
          subtitle="Ogni step è stato selezionato dall'AI per le esigenze uniche della tua pelle"
        />
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8">
        {routine.map((step, idx) => {
          const isEven = idx % 2 === 0;
          const alts = step.alternativeProducts || [];
          const showAlts = expandedAlts.has(step.id);

          return (
            <motion.section
              key={step.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.08, duration: 0.6 }}
              className="relative mb-16 last:mb-8"
            >
              {idx < routine.length - 1 && (
                <div className="absolute left-1/2 -bottom-10 hidden h-12 w-px -translate-x-1/2 bg-gradient-to-b from-primary/20 to-transparent md:block" />
              )}

              <div className={`flex flex-col items-center gap-8 md:flex-row ${!isEven ? "md:flex-row-reverse" : ""}`}>
                {/* Step Image */}
                <motion.div whileHover={{ scale: 1.01 }} className="relative w-full md:w-5/12">
                  <div className="relative overflow-hidden bg-foreground">
                    <div className="absolute top-4 left-4 z-10 flex h-10 w-10 items-center justify-center bg-background font-display text-sm font-semibold text-foreground">
                      {step.order}
                    </div>
                    <div className="aspect-square p-6">
                      <img src={stepImages[idx % stepImages.length]} alt={step.name} className="h-full w-full object-contain" />
                    </div>
                  </div>
                </motion.div>

                {/* Step Content + Products */}
                <div className="w-full md:w-7/12">
                  <div className="mb-5">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-xl">{step.icon}</span>
                      <span className="font-body text-[11px] font-medium uppercase tracking-[0.2em] text-primary">
                        Step {step.order}
                      </span>
                    </div>
                    <h3 className="font-display text-xl font-semibold text-foreground md:text-2xl">{step.name}</h3>
                    <p className="mt-1.5 font-body text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                  </div>

                  {/* Recommended products */}
                  <div className="space-y-3">
                    {step.products.map((product) => (
                      <ProductCard key={product.id} product={product} cart={cart} onToggleCart={onToggleCart} />
                    ))}
                  </div>

                  {/* Alternative products toggle */}
                  {alts.length > 0 && (
                    <div className="mt-3">
                      <button
                        onClick={() => toggleAlts(step.id)}
                        className="flex items-center gap-1.5 font-body text-[11px] font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showAlts ? "rotate-180" : ""}`} />
                        {showAlts ? "Nascondi" : "Vedi"} alternative ({alts.length})
                      </button>
                      <AnimatePresence>
                        {showAlts && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-2 space-y-2 overflow-hidden"
                          >
                            {alts.map((product) => (
                              <ProductCard key={product.id} product={product} cart={cart} onToggleCart={onToggleCart} isAlternative />
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </div>
            </motion.section>
          );
        })}
      </div>
    </>
  );
};

export default RoutineSteps;
