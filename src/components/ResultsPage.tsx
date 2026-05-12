import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import type { Product, RoutineStep } from "@/data/products";
import { products } from "@/data/products";
import type { QuizData } from "./BeautyQuiz";
import type { AIRoutineResult } from "./AnalysisScreen";
import ResultsHero from "./results/ResultsHero";
import AITipsGrid from "./results/AITipsGrid";
import RoutineSteps from "./results/RoutineSteps";
import BeforeAfterSection from "./BeforeAfterSection";
import BundleSection from "./BundleSection";
import ReviewsSection from "./ReviewsSection";
import FAQSection from "./FAQSection";
import FounderIntro from "./results/FounderIntro";

interface ResultsPageProps {
  name: string;
  quizData: QuizData;
  aiResult: AIRoutineResult;
  selfie: string | null;
  enhancedSelfie: string | null;
  onCheckout: (cart: Product[]) => void;
}

const productsMap = new Map(products.map(p => [p.id, p]));

const ResultsPage = ({ name, quizData, aiResult, selfie, enhancedSelfie, onCheckout }: ResultsPageProps) => {
  const routine = useMemo(() => {
    return aiResult.steps.map((step, idx) => ({
      id: `step${idx + 1}`,
      name: step.step_name,
      description: step.description,
      order: step.step_order,
      icon: step.icon,
      products: step.product_ids
        .map(id => productsMap.get(id))
        .filter((p): p is Product => !!p),
      alternativeProducts: (step.alternative_product_ids || [])
        .map(id => productsMap.get(id))
        .filter((p): p is Product => !!p),
    }));
  }, [aiResult]);

  const allProducts = routine.flatMap((s) => s.products);
  const uniqueProducts = Array.from(new Map(allProducts.map(p => [p.id, p])).values());

  // Auto-seleziona tutti i prodotti raccomandati di default
  const [cart, setCart] = useState<Set<string>>(() => new Set(uniqueProducts.map((p) => p.id)));
  useEffect(() => {
    setCart(new Set(uniqueProducts.map((p) => p.id)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiResult]);

  const totalPrice = uniqueProducts.reduce((sum, p) => sum + p.price, 0);
  // Sconto esclusivo dedicato a chi completa il funnel: -25%
  const bundlePrice = totalPrice * 0.90;

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
      <ResultsHero name={name} quizData={quizData} aiResult={aiResult} />

      {/* Prima/Dopo in cima, subito dopo l'hero */}
      {selfie && enhancedSelfie && (
        <div className="border-t border-border">
          <BeforeAfterSection beforeImage={selfie} afterImage={enhancedSelfie} name={name} />
        </div>
      )}

      <div id="routine-section">
        <AITipsGrid tips={aiResult.personalized_tips} />
      </div>
      <RoutineSteps routine={routine} cart={cart} onToggleCart={toggleCart} />

      <BundleSection
        products={uniqueProducts}
        cart={cart}
        totalPrice={totalPrice}
        bundlePrice={bundlePrice}
        onToggleCart={toggleCart}
        onAddAll={addAllToCart}
        onCheckout={onCheckout}
      />
      <FounderIntro />
      <ReviewsSection />
      <FAQSection />

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

