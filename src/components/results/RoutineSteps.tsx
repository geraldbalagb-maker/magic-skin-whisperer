import { motion } from "framer-motion";
import { ShoppingBag, Star, Check } from "lucide-react";
import type { RoutineStep } from "@/data/products";
import SectionHeader from "../landing/SectionHeader";
import routineCleansingImg from "@/assets/steps/routine-step-cleansing.png";
import routineTonerImg from "@/assets/steps/routine-step-toner.png";
import routineTreatmentImg from "@/assets/steps/routine-step-treatment.png";
import routineMoisturizerImg from "@/assets/steps/routine-step-cream.png";
import routineExfoliationImg from "@/assets/steps/routine-step-mask.png";

const stepImages = [routineCleansingImg, routineTonerImg, routineTreatmentImg, routineMoisturizerImg, routineExfoliationImg];

interface RoutineStepsProps {
  routine: RoutineStep[];
  cart: Set<string>;
  onToggleCart: (id: string) => void;
}

const RoutineSteps = ({ routine, cart, onToggleCart }: RoutineStepsProps) => (
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
        return (
          <motion.section
            key={step.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: idx * 0.08, duration: 0.6 }}
            className="relative mb-16 last:mb-8"
          >
            {/* Connector line */}
            {idx < routine.length - 1 && (
              <div className="absolute left-1/2 -bottom-10 hidden h-12 w-px -translate-x-1/2 bg-gradient-to-b from-primary/20 to-transparent md:block" />
            )}

            <div className={`flex flex-col items-center gap-8 md:flex-row ${!isEven ? "md:flex-row-reverse" : ""}`}>
              {/* Step Image */}
              <motion.div whileHover={{ scale: 1.02 }} className="relative w-full md:w-5/12">
                <div className="relative overflow-hidden rounded-3xl border border-primary/10 bg-card shadow-sm">
                  <div className="absolute top-4 left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-gold font-display text-sm font-bold text-primary-foreground shadow-gold">
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

                <div className="space-y-3">
                  {step.products.map((product) => (
                    <motion.div
                      key={product.id}
                      whileHover={{ y: -2, boxShadow: "0 8px 30px -10px hsl(38 55% 55% / 0.2)" }}
                      transition={{ duration: 0.2 }}
                      className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-3.5 transition-colors hover:border-primary/20"
                    >
                      <div className="flex h-[72px] w-[72px] flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-background p-1.5">
                        <img src={product.image} alt={product.name} className="h-full w-full rounded-lg object-contain" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="font-body text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">{product.brand}</p>
                        <p className="truncate font-display text-sm font-medium text-foreground">{product.name}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: product.rating }).map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-primary text-primary" />
                            ))}
                          </div>
                          <span className="font-display text-sm font-bold text-primary">{product.price.toFixed(2)}€</span>
                        </div>
                      </div>

                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => onToggleCart(product.id)}
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
                          cart.has(product.id)
                            ? "bg-gradient-gold text-primary-foreground shadow-gold"
                            : "border border-border bg-background text-muted-foreground hover:border-primary/30 hover:text-primary"
                        }`}
                      >
                        {cart.has(product.id) ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>
        );
      })}
    </div>
  </>
);

export default RoutineSteps;
