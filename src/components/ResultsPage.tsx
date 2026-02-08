import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Download, Star, Check, User, Sparkles } from "lucide-react";
import type { Product, RoutineStep } from "@/data/products";
import { products } from "@/data/products";
import type { QuizData } from "./BeautyQuiz";
import type { AIRoutineResult } from "./AnalysisScreen";
import routineCleansingImg from "@/assets/steps/routine-step-cleansing.png";
import routineTonerImg from "@/assets/steps/routine-step-toner.png";
import routineTreatmentImg from "@/assets/steps/routine-step-treatment.png";
import routineMoisturizerImg from "@/assets/steps/routine-step-cream.png";
import routineExfoliationImg from "@/assets/steps/routine-step-mask.png";
import MagicSparkles from "./MagicSparkles";

interface ResultsPageProps {
  name: string;
  quizData: QuizData;
  aiResult: AIRoutineResult;
  onCheckout: (cart: Product[]) => void;
}

const stepImages = [routineCleansingImg, routineTonerImg, routineTreatmentImg, routineMoisturizerImg, routineExfoliationImg];

const productsMap = new Map(products.map(p => [p.id, p]));

const ResultsPage = ({ name, quizData, aiResult, onCheckout }: ResultsPageProps) => {
  // Build routine from AI result
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
      {/* Header with personalized analysis */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-cream px-4 py-12 text-center"
      >
        <MagicSparkles count={20} />
        <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
          La tua beauty routine, {name} ✨
        </h1>
        <p className="mx-auto mt-3 max-w-md font-body text-sm text-muted-foreground">
          {aiResult.skin_analysis}
        </p>

        {/* Quiz data recap */}
        <div className="mx-auto mt-6 flex max-w-lg flex-wrap justify-center gap-3">
          <span className="rounded-full border border-gold/30 bg-card px-4 py-1.5 font-body text-xs text-muted-foreground">
            🎂 {quizData.age} anni
          </span>
          <span className="rounded-full border border-gold/30 bg-card px-4 py-1.5 font-body text-xs text-muted-foreground">
            ⏱ {quizData.time}
          </span>
          {quizData.skinDescription && (
            <span className="rounded-full border border-gold/30 bg-card px-4 py-1.5 font-body text-xs text-muted-foreground max-w-xs truncate">
              💬 "{quizData.skinDescription.slice(0, 50)}..."
            </span>
          )}
        </div>

        {/* AI personalized tips */}
        {aiResult.personalized_tips && aiResult.personalized_tips.length > 0 && (
          <div className="mx-auto mt-6 max-w-lg">
            <div className="rounded-2xl border border-gold/20 bg-card/80 backdrop-blur-sm p-5">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-gold" />
                <p className="font-display text-sm font-semibold text-foreground">I consigli del tuo beauty coach AI</p>
              </div>
              <div className="space-y-2">
                {aiResult.personalized_tips.map((tip, i) => (
                  <p key={i} className="font-body text-xs text-muted-foreground text-left">
                    💡 {tip}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Routine Steps */}
      <div className="mx-auto max-w-4xl px-4 py-8">
        {routine.map((step, idx) => (
          <motion.section
            key={step.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="mb-12"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-gold text-lg">
                {step.icon}
              </div>
              <div>
                <h2 className="font-display text-xl font-semibold text-foreground">
                  Step {step.order}: {step.name}
                </h2>
                <p className="font-body text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Step illustration */}
              <div className="aspect-square overflow-hidden rounded-2xl">
                <img
                  src={stepImages[idx % stepImages.length]}
                  alt={step.name}
                  className="h-full w-full object-contain"
                />
              </div>

              {/* Products */}
              <div className="flex flex-col gap-3">
                {step.products.map((product) => (
                  <motion.div
                    key={product.id}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-4 rounded-xl border border-gold/20 bg-card p-4 transition-all hover:shadow-gold"
                  >
                    <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-background p-2">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full rounded-lg object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-xs text-muted-foreground">{product.brand}</p>
                      <p className="font-display text-sm font-medium text-foreground truncate">{product.name}</p>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: product.rating }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-gold text-gold" />
                        ))}
                      </div>
                      <p className="mt-1 font-display text-sm font-semibold text-gold">{product.price.toFixed(2)}€</p>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleCart(product.id)}
                      className={`flex-shrink-0 rounded-full p-2 transition-all ${
                        cart.has(product.id)
                          ? "bg-gradient-gold text-primary-foreground"
                          : "border border-gold/30 text-gold hover:bg-gold/10"
                      }`}
                    >
                      {cart.has(product.id) ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        ))}
      </div>

      {/* Recap Bundle */}
      <div className="bg-gradient-cream px-4 py-12">
        <div className="mx-auto max-w-2xl text-center">
          <MagicSparkles count={15} />
          <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
            Il tuo kit completo 💎
          </h2>
          <p className="mt-2 font-body text-sm text-muted-foreground">
            Tutti i prodotti della tua routine in un unico ordine
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {uniqueProducts.map((p) => (
              <motion.div
                key={p.id}
                whileHover={{ y: -4 }}
                className={`cursor-pointer rounded-xl border bg-card p-4 text-center transition-all ${
                  cart.has(p.id) ? "border-gold shadow-gold" : "border-gold/10"
                }`}
                onClick={() => toggleCart(p.id)}
              >
                <div className="mx-auto mb-3 flex h-24 w-24 items-center justify-center rounded-xl bg-background p-2">
                  <img src={p.image} alt={p.name} className="h-full w-full object-contain" />
                </div>
                <p className="font-body text-[11px] text-muted-foreground">{p.brand}</p>
                <p className="font-body text-xs font-medium text-foreground">{p.name}</p>
                <p className="mt-1 font-display text-sm font-semibold text-gold">{p.price.toFixed(2)}€</p>
                {cart.has(p.id) && <Check className="mx-auto mt-1 h-4 w-4 text-gold" />}
              </motion.div>
            ))}
          </div>

          <div className="mt-8 space-y-3">
            <div className="rounded-2xl border border-gold/30 bg-card p-6">
              <div className="flex items-center justify-between">
                <span className="font-body text-sm text-muted-foreground">Prezzo totale</span>
                <span className="font-display text-lg text-muted-foreground line-through">{totalPrice.toFixed(2)}€</span>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className="font-display text-lg font-semibold text-foreground">Bundle -20%</span>
                <span className="font-display text-2xl font-bold text-gold">{bundlePrice.toFixed(2)}€</span>
              </div>
              <p className="mt-1 font-body text-xs text-gold">Risparmi {(totalPrice - bundlePrice).toFixed(2)}€! ✨</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  addAllToCart();
                  onCheckout(uniqueProducts);
                }}
                className="flex-1 rounded-full bg-gradient-gold px-8 py-4 font-body text-sm font-medium text-primary-foreground shadow-gold-lg"
              >
                <ShoppingBag className="mr-2 inline h-4 w-4" /> Acquista il bundle
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onCheckout(uniqueProducts.filter((p) => cart.has(p.id)))}
                disabled={cart.size === 0}
                className="flex-1 rounded-full border border-gold/30 px-8 py-4 font-body text-sm font-medium text-foreground transition-all hover:bg-gold/5 disabled:opacity-40"
              >
                Acquista selezionati ({cart.size})
              </motion.button>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              className="flex items-center justify-center gap-2 font-body text-xs text-muted-foreground hover:text-foreground"
            >
              <Download className="h-3 w-3" /> Scarica il PDF della tua routine
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
