import { useState } from "react";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-beauty.jpg";
import BeautyQuiz, { type QuizData } from "@/components/BeautyQuiz";
import AnalysisScreen, { type AIRoutineResult, type AnalysisResult } from "@/components/AnalysisScreen";
import ResultsPage from "@/components/ResultsPage";
import ThankYouPage from "@/components/ThankYouPage";
import LandingPage from "@/components/LandingPage";
import type { Product } from "@/data/products";

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

  return <LandingPage onStartQuiz={() => setPhase("quiz")} />;
};

export default Index;
