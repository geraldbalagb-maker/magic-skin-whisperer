import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Download, Star, Check, ChevronRight, Gift } from "lucide-react";
import type { Product, RoutineStep } from "@/data/products";
import { products } from "@/data/products";
import type { QuizData } from "./BeautyQuiz";
import type { AIRoutineResult } from "./AnalysisScreen";
import BeforeAfterSection from "./BeforeAfterSection";
import BundleSection from "./BundleSection";
import ReviewsSection from "./ReviewsSection";
import FAQSection from "./FAQSection";
import routineCleansingImg from "@/assets/steps/routine-step-cleansing.png";
import routineTonerImg from "@/assets/steps/routine-step-toner.png";
import routineTreatmentImg from "@/assets/steps/routine-step-treatment.png";
import routineMoisturizerImg from "@/assets/steps/routine-step-cream.png";
import routineExfoliationImg from "@/assets/steps/routine-step-mask.png";


interface ResultsPageProps {
  name: string;
  quizData: QuizData;
  aiResult: AIRoutineResult;
  selfie: string | null;
  enhancedSelfie: string | null;
  onCheckout: (cart: Product[]) => void;
}

const stepImages = [routineCleansingImg, routineTonerImg, routineTreatmentImg, routineMoisturizerImg, routineExfoliationImg];

const productsMap = new Map(products.map(p => [p.id, p]));

const ResultsPage = ({ name, quizData, aiResult, selfie, enhancedSelfie, onCheckout }: ResultsPageProps) => {
  const routine: RoutineStep[] = useMemo(() => {
    return aiResult.steps.map((step, idx) => ({
      id: `step${idx + 1}`,
      name: step.step_name,
      description: step.description,
      order: step.step_order,
      icon: step.icon,
      products: step.product_ids
        .map(id => productsMap.get(id))
        .filter((p): p is Product => !!p),
    }));
  }, [aiResult]);

  const [cart, setCart] = useState<Set<string>>(new Set());
  const allProducts = routine.flatMap((s) => s.products);
  const uniqueProducts = Array.from(new Map(allProducts.map(p => [p.id, p])).values());
  const totalPrice = uniqueProducts.reduce((sum, p) => sum + p.price, 0);
  const bundlePrice = totalPrice * 0.8;

  const toggleCart = (id: string) => {
    setCart((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const addAllToCart = () => {
    setCart(new Set(uniqueProducts.map((p) => p.id)));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ─── Hero Header ─── */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden bg-gradient-cream"
      >
        
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/5" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-primary/3" />

        <div className="relative z-10 mx-auto max-w-3xl px-4 py-16 text-center md:py-20">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mb-4 flex items-center justify-center gap-2"
          >
            <div className="h-px w-8 bg-primary/30" />
            <span className="font-body text-[11px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
              La tua routine personalizzata
            </span>
            <div className="h-px w-8 bg-primary/30" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="font-display text-3xl font-bold text-foreground md:text-5xl"
          >
            Ecco il tuo rituale,{" "}
            <span className="text-gradient-gold">{name}</span> ✨
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mx-auto mt-4 max-w-lg font-body text-sm leading-relaxed text-muted-foreground md:text-base"
          >
            {aiResult.skin_analysis}
          </motion.p>

          {/* Quiz recap chips */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mx-auto mt-6 flex max-w-lg flex-wrap justify-center gap-2"
          >
            <span className="rounded-full border border-primary/15 bg-card/80 px-4 py-1.5 font-body text-xs text-muted-foreground backdrop-blur-sm">
              🎂 {quizData.age} anni
            </span>
            <span className="rounded-full border border-primary/15 bg-card/80 px-4 py-1.5 font-body text-xs text-muted-foreground backdrop-blur-sm">
              ⏱ {quizData.time}
            </span>
            {quizData.skinDescription && (
              <span className="max-w-xs truncate rounded-full border border-primary/15 bg-card/80 px-4 py-1.5 font-body text-xs text-muted-foreground backdrop-blur-sm">
                💬 "{quizData.skinDescription.slice(0, 50)}..."
              </span>
            )}
          </motion.div>
        </div>
      </motion.header>

      {/* ─── AI Tips Banner ─── */}
      {aiResult.personalized_tips && aiResult.personalized_tips.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border-b border-border bg-card/50"
        >
          <div className="mx-auto max-w-3xl px-4 py-8">
            <div className="rounded-2xl border border-primary/10 bg-card p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-gold">
                  <span className="text-sm text-primary-foreground">💡</span>
                </div>
                <h3 className="font-display text-base font-semibold text-foreground">
                  I consigli del tuo beauty coach AI
                </h3>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {aiResult.personalized_tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2.5 rounded-xl bg-background/60 p-3">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                      {i + 1}
                    </span>
                    <p className="font-body text-xs leading-relaxed text-muted-foreground">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ─── Steps Section Title ─── */}
      <div className="mx-auto max-w-4xl px-4 pt-14 pb-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="font-body text-[11px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
            Step by step
          </span>
          <h2 className="mt-2 font-display text-2xl font-bold text-foreground md:text-3xl">
            La tua routine in {routine.length} passaggi
          </h2>
          <div className="mx-auto mt-3 h-0.5 w-12 rounded-full bg-gradient-gold" />
        </motion.div>
      </div>

      {/* ─── Routine Steps (Alternating Layout) ─── */}
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
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative w-full md:w-5/12"
                >
                  <div className="relative overflow-hidden rounded-3xl border border-primary/10 bg-card shadow-sm">
                    {/* Step number badge */}
                    <div className="absolute top-4 left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-gold font-display text-sm font-bold text-primary-foreground shadow-gold">
                      {step.order}
                    </div>
                    <div className="aspect-square p-6">
                      <img
                        src={stepImages[idx % stepImages.length]}
                        alt={step.name}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Step Content + Products */}
                <div className="w-full md:w-7/12">
                  {/* Step header */}
                  <div className="mb-5">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-xl">{step.icon}</span>
                      <span className="font-body text-[11px] font-medium uppercase tracking-[0.2em] text-primary">
                        Step {step.order}
                      </span>
                    </div>
                    <h3 className="font-display text-xl font-semibold text-foreground md:text-2xl">
                      {step.name}
                    </h3>
                    <p className="mt-1.5 font-body text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>

                  {/* Product cards */}
                  <div className="space-y-3">
                    {step.products.map((product) => (
                      <motion.div
                        key={product.id}
                        whileHover={{ y: -2, boxShadow: "0 8px 30px -10px hsl(38 55% 55% / 0.2)" }}
                        transition={{ duration: 0.2 }}
                        className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-3.5 transition-colors hover:border-primary/20"
                      >
                        {/* Product image */}
                        <div className="flex h-[72px] w-[72px] flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-background p-1.5">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full rounded-lg object-contain"
                          />
                        </div>

                        {/* Product info */}
                        <div className="min-w-0 flex-1">
                          <p className="font-body text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
                            {product.brand}
                          </p>
                          <p className="truncate font-display text-sm font-medium text-foreground">
                            {product.name}
                          </p>
                          <div className="mt-1 flex items-center gap-2">
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: product.rating }).map((_, i) => (
                                <Star key={i} className="h-3 w-3 fill-primary text-primary" />
                              ))}
                            </div>
                            <span className="font-display text-sm font-bold text-primary">
                              {product.price.toFixed(2)}€
                            </span>
                          </div>
                        </div>

                        {/* Add to cart */}
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          onClick={() => toggleCart(product.id)}
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

      {/* ─── Before/After Section ─── */}
      {selfie && enhancedSelfie && (
        <div className="border-t border-border">
          <BeforeAfterSection
            beforeImage={selfie}
            afterImage={enhancedSelfie}
            name={name}
          />
        </div>
      )}

      {/* ─── Bundle CTA ─── */}
      <BundleSection
        products={uniqueProducts}
        cart={cart}
        totalPrice={totalPrice}
        bundlePrice={bundlePrice}
        onToggleCart={toggleCart}
        onAddAll={addAllToCart}
        onCheckout={onCheckout}
      />

      {/* ─── Reviews Section ─── */}
      <ReviewsSection />

      {/* ─── FAQ & Trust Sections ─── */}
      <FAQSection />

      {/* ─── PDF Download ─── */}
      <div className="border-t border-border bg-background py-8 text-center">
        <motion.button
          whileHover={{ scale: 1.02 }}
          className="mx-auto flex items-center justify-center gap-2 font-body text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <Download className="h-3.5 w-3.5" />
          Scarica il PDF della tua routine
        </motion.button>
      </div>
    </div>
  );
};

export default ResultsPage;
