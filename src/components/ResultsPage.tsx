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

  const tipIcons = ["🧴", "🌙", "☀️", "💧", "🍃", "✨"];

  return (
    <div className="min-h-screen bg-background">
      {/* ─── Immersive Hero ─── */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative overflow-hidden bg-gradient-dark"
      >
        {/* Animated background mesh */}
        <div className="pointer-events-none absolute inset-0">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1/2 -left-1/2 h-[200%] w-[200%] opacity-[0.04]"
            style={{
              background: "conic-gradient(from 0deg, hsl(38 55% 55%), transparent, hsl(40 60% 75%), transparent, hsl(38 55% 55%))",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-4 py-16 md:py-24">
          {/* Top label */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8 flex justify-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-5 py-2 font-body text-[11px] font-medium uppercase tracking-[0.3em] text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
              Analisi completata
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-center font-display text-4xl font-bold leading-tight text-primary-foreground md:text-6xl lg:text-7xl"
          >
            Il tuo rituale,
            <br />
            <span className="sparkle-text">{name}</span>
          </motion.h1>

          {/* Skin analysis — editorial quote style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="mx-auto mt-10 max-w-2xl"
          >
            <div className="relative rounded-2xl border border-primary/15 bg-primary/5 px-8 py-6 backdrop-blur-sm md:px-10 md:py-8">
              <div className="absolute -top-3 left-8 flex h-6 items-center gap-1.5 rounded-full bg-gradient-gold px-3">
                <span className="font-body text-[10px] font-semibold uppercase tracking-widest text-primary-foreground">
                  Analisi AI
                </span>
              </div>
              <p className="font-body text-sm leading-relaxed text-primary-foreground/80 md:text-base">
                {aiResult.skin_analysis}
              </p>
            </div>
          </motion.div>

          {/* Quiz recap — glass morphism chips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mx-auto mt-8 flex max-w-lg flex-wrap justify-center gap-3"
          >
            {[
              { icon: "🎂", label: `${quizData.age} anni` },
              { icon: "⏱", label: quizData.time },
              ...(quizData.skinDescription
                ? [{ icon: "💬", label: `"${quizData.skinDescription.slice(0, 40)}…"` }]
                : []),
            ].map((chip, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + i * 0.1 }}
                className="rounded-full border border-primary/20 bg-primary/10 px-4 py-2 font-body text-xs text-primary-foreground/70 backdrop-blur-md"
              >
                {chip.icon} {chip.label}
              </motion.span>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-12 flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center gap-2"
            >
              <span className="font-body text-[10px] uppercase tracking-widest text-primary-foreground/40">
                Scopri la tua routine
              </span>
              <ChevronRight className="h-4 w-4 rotate-90 text-primary/50" />
            </motion.div>
          </motion.div>
        </div>
      </motion.header>

      {/* ─── AI Tips — Bento Grid ─── */}
      {aiResult.personalized_tips && aiResult.personalized_tips.length > 0 && (
        <div className="border-b border-border bg-gradient-cream">
          <div className="mx-auto max-w-5xl px-4 py-14 md:py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10 text-center"
            >
              <span className="font-body text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
                Consigli personalizzati
              </span>
              <h2 className="mt-2 font-display text-2xl font-bold text-foreground md:text-4xl">
                I segreti per la tua pelle
              </h2>
              <div className="mx-auto mt-4 h-0.5 w-16 rounded-full bg-gradient-gold" />
            </motion.div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {aiResult.personalized_tips.map((tip, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -4 }}
                  className={`group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-elegant transition-all hover:border-primary/20 hover:shadow-elevated ${
                    i === 0 ? "md:col-span-2 lg:col-span-1" : ""
                  }`}
                >
                  {/* Shimmer on hover */}
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 animate-shimmer" />

                  <div className="relative z-10">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-gold shadow-gold">
                        <span className="text-lg">{tipIcons[i % tipIcons.length]}</span>
                      </div>
                      <span className="font-body text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                        Tip #{i + 1}
                      </span>
                    </div>
                    <p className="font-body text-sm leading-relaxed text-muted-foreground">
                      {tip}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── Steps Section Title ─── */}
      <div className="mx-auto max-w-5xl px-4 pt-16 pb-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="font-body text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
            Step by step
          </span>
          <h2 className="mt-2 font-display text-2xl font-bold text-foreground md:text-4xl">
            La tua routine in {routine.length} passaggi
          </h2>
          <p className="mx-auto mt-3 max-w-md font-body text-sm text-muted-foreground">
            Ogni step è stato selezionato dall'AI per le esigenze uniche della tua pelle
          </p>
          <div className="mx-auto mt-4 h-0.5 w-16 rounded-full bg-gradient-gold" />
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
