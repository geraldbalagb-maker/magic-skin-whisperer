import { useState } from "react";
import V2TopBar from "@/components/v2/V2TopBar";
import V2Header from "@/components/v2/V2Header";
import V2Hero from "@/components/v2/V2Hero";
import V2HowItWorks from "@/components/v2/V2HowItWorks";
import V2TrustBar from "@/components/v2/V2TrustBar";
import V2CTABanner from "@/components/v2/V2CTABanner";
import V2Footer from "@/components/v2/V2Footer";
import BeautyQuiz, { type QuizData } from "@/components/BeautyQuiz";
import AnalysisScreen, { type AIRoutineResult, type AnalysisResult } from "@/components/AnalysisScreen";
import ResultsPage from "@/components/ResultsPage";
import ThankYouPage from "@/components/ThankYouPage";
import type { Product } from "@/data/products";

type V2Phase = "landing" | "quiz" | "analysis" | "results" | "thankyou";

const LandingV2 = () => {
  const [phase, setPhase] = useState<V2Phase>("landing");
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [aiResult, setAiResult] = useState<AIRoutineResult | null>(null);
  const [enhancedSelfie, setEnhancedSelfie] = useState<string | null>(null);

  const handleStartQuiz = () => setPhase("quiz");

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

  // Quiz: fullscreen, no header/footer
  if (phase === "quiz") {
    return <BeautyQuiz onComplete={handleQuizComplete} />;
  }

  // Analysis: fullscreen, no header/footer
  if (phase === "analysis") {
    return (
      <AnalysisScreen
        name={quizData?.name || ""}
        quizData={quizData!}
        onComplete={handleAnalysisComplete}
      />
    );
  }

  // Results: with header + footer
  if (phase === "results") {
    return (
      <ResultsPage
        name={quizData?.name || ""}
        quizData={quizData!}
        aiResult={aiResult!}
        selfie={quizData?.selfie || null}
        enhancedSelfie={enhancedSelfie}
        onCheckout={handleCheckout}
      />
    );
  }

  // Thank you: with header + footer
  if (phase === "thankyou") {
    return <ThankYouPage name={quizData?.name || ""} />;
  }

  // Landing
  return (
    <div className="min-h-screen bg-background">
      <V2TopBar />
      <V2Hero onStartQuiz={handleStartQuiz} />
      <V2HowItWorks />
      <V2TrustBar />
      <V2CTABanner onStartQuiz={handleStartQuiz} />
      <V2Footer />
    </div>
  );
};

export default LandingV2;
