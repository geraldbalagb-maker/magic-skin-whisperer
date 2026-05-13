import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
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

  const scrollToBundle = () => {
    document.getElementById("bundle-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Mostra il FAB solo dopo aver superato la sezione bundle (carrello)
  const [showCartFab, setShowCartFab] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const bundle = document.getElementById("bundle-section");
      if (!bundle) return;
      const bundleBottom = bundle.getBoundingClientRect().bottom;
      setShowCartFab(bundleBottom < 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

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

      <div id="bundle-section">
        <BundleSection
          products={uniqueProducts}
          cart={cart}
          totalPrice={totalPrice}
          bundlePrice={bundlePrice}
          onToggleCart={toggleCart}
          onAddAll={addAllToCart}
          onCheckout={onCheckout}
        />
      </div>
      <FounderIntro />
      <ReviewsSection />
      <FAQSection />

      <div id="pdf-download-section" className="border-t border-border bg-background py-8 text-center">
        <button
          onClick={handleDownloadPdf}
          className="mx-auto flex items-center justify-center gap-2 font-body text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <Download className="h-3.5 w-3.5" />
          Scarica il PDF della tua routine
        </button>
      </div>

      {/* FAB sticky — appare solo dopo il carrello, nascosto nella sezione PDF */}
      <AnimatePresence>
        {showCartFab && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            onClick={scrollToBundle}
            className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-sm bg-foreground px-5 py-3 font-body text-[11px] font-bold uppercase tracking-[0.15em] text-background shadow-elevated transition-opacity hover:opacity-90 md:bottom-8 md:right-8"
            aria-label="Torna al carrello"
          >
            <ShoppingBag className="h-4 w-4" />
            Torna al carrello
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResultsPage;

