import { useState } from "react";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-beauty.jpg";
import BeautyQuiz, { type QuizData } from "@/components/BeautyQuiz";
import AnalysisScreen, { type AIRoutineResult, type AnalysisResult } from "@/components/AnalysisScreen";
import ResultsPage from "@/components/ResultsPage";
import ThankYouPage from "@/components/ThankYouPage";
import MagicSparkles from "@/components/MagicSparkles";
import type { Product } from "@/data/products";
import { Sparkles } from "lucide-react";

type AppPhase = "landing" | "quiz" | "analysis" | "results" | "thankyou";

const Index = () => {
  const [phase, setPhase] = useState<AppPhase>("landing");
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [aiResult, setAiResult] = useState<AIRoutineResult | null>(null);
  const [enhancedSelfie, setEnhancedSelfie] = useState<string | null>(null);

  const handleQuizComplete = (data: QuizData) => {
    setQuizData(data);
    setPhase("analysis");
  };

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAiResult(result.routine);
    setEnhancedSelfie(result.enhancedSelfie);
    setPhase("results");
  };

  const handleCheckout = (_cart: Product[]) => {
    setPhase("thankyou");
  };

  if (phase === "quiz") return <BeautyQuiz onComplete={handleQuizComplete} />;
  if (phase === "analysis") return <AnalysisScreen name={quizData?.name || ""} quizData={quizData!} onComplete={handleAnalysisComplete} />;
  if (phase === "results") return <ResultsPage name={quizData?.name || ""} quizData={quizData!} aiResult={aiResult!} selfie={quizData?.selfie || null} enhancedSelfie={enhancedSelfie} onCheckout={handleCheckout} />;
  if (phase === "thankyou") return <ThankYouPage name={quizData?.name || ""} />;

  // Landing
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background">
      {/* Hero background */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Beauty"
          className="h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>

      <MagicSparkles count={25} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center gap-8 px-4 text-center"
      >
        {/* Logo / Brand */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2"
        >
          <Sparkles className="h-6 w-6 text-gold" />
          <span className="font-display text-sm font-medium tracking-[0.3em] text-muted-foreground">
            LUXURY PERFUMES
          </span>
          <Sparkles className="h-6 w-6 text-gold" />
        </motion.div>

        {/* Main claim */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="max-w-lg font-display text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl"
        >
          La beauty routine adatta a te in{" "}
          <span className="sparkle-text">1 minuto</span>
          <br />
          <span className="text-gradient-gold">come per magia</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="max-w-sm font-body text-muted-foreground"
        >
          Rispondi a poche domande e scopri i prodotti perfetti per la tua pelle, selezionati dall'intelligenza artificiale ✨
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setPhase("quiz")}
          className="bg-gradient-gold rounded-full px-10 py-4 font-body text-sm font-medium text-primary-foreground shadow-gold-lg transition-all animate-pulse-glow"
        >
          <Sparkles className="mr-2 inline h-4 w-4" />
          Scopri la tua routine
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="font-body text-xs text-muted-foreground/60"
        >
          ⏱ Ci vogliono solo 60 secondi • 100% personalizzato
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Index;
