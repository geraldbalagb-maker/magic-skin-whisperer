import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import MagicSparkles from "./MagicSparkles";
import type { QuizData } from "./BeautyQuiz";
import { supabase } from "@/integrations/supabase/client";

export interface AIRoutineResult {
  skin_analysis: string;
  personalized_tips: string[];
  steps: {
    step_name: string;
    step_order: number;
    icon: string;
    description: string;
    product_ids: string[];
  }[];
}

interface AnalysisScreenProps {
  name: string;
  quizData: QuizData;
  onComplete: (result: AIRoutineResult) => void;
}

const loadingSteps = [
  "Analizzo il tuo tipo di pelle...",
  "Cerco i prodotti più adatti a te...",
  "Creo la tua routine personalizzata...",
  "Aggiungo un tocco di magia... ✨",
];

const AnalysisScreen = ({ name, quizData, onComplete }: AnalysisScreenProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const aiResultRef = useRef<AIRoutineResult | null>(null);
  const hasCalledAI = useRef(false);

  // Call AI edge function
  useEffect(() => {
    if (hasCalledAI.current) return;
    hasCalledAI.current = true;

    const callAI = async () => {
      try {
        const { data, error: fnError } = await supabase.functions.invoke("analyze-skin", {
          body: {
            name: quizData.name,
            age: quizData.age,
            time: quizData.time,
            skinDescription: quizData.skinDescription,
            hasSelfie: !!quizData.selfie,
          },
        });

        if (fnError) throw new Error(fnError.message);
        if (!data?.success) throw new Error(data?.error || "Errore nell'analisi");

        aiResultRef.current = data.routine;
      } catch (err) {
        console.error("AI analysis error:", err);
        setError(err instanceof Error ? err.message : "Errore nell'analisi");
      }
    };

    callAI();
  }, [quizData]);

  // Progress animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        // If AI is done, speed up to 100
        if (aiResultRef.current && p >= 80) {
          if (p >= 100) {
            clearInterval(interval);
            setTimeout(() => onComplete(aiResultRef.current!), 300);
            return 100;
          }
          return p + 3;
        }
        // If AI not done yet, slow down at 85%
        if (p >= 85 && !aiResultRef.current) return p;
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 1;
      });
    }, 60);
    return () => clearInterval(interval);
  }, [onComplete]);

  // Loading step animation
  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((s) => (s < loadingSteps.length - 1 ? s + 1 : s));
    }, 1500);
    return () => clearInterval(stepInterval);
  }, []);

  if (error) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <MagicSparkles count={10} />
        <div className="flex flex-col items-center gap-6 text-center">
          <h2 className="font-display text-2xl font-semibold text-foreground">
            Oops, qualcosa è andato storto 😔
          </h2>
          <p className="font-body text-sm text-muted-foreground max-w-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-gold rounded-full px-8 py-3 font-body text-sm font-medium text-primary-foreground shadow-gold"
          >
            Riprova
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <MagicSparkles count={30} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-8 text-center"
      >
        {/* Animated circle */}
        <div className="relative">
          <svg width="120" height="120" className="animate-spin" style={{ animationDuration: "3s" }}>
            <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(35 20% 88%)" strokeWidth="4" />
            <circle
              cx="60" cy="60" r="54" fill="none"
              stroke="url(#goldGrad)" strokeWidth="4"
              strokeDasharray={`${progress * 3.39} 339`}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
            />
            <defs>
              <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(38 55% 55%)" />
                <stop offset="100%" stopColor="hsl(40 60% 75%)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-2xl font-semibold text-gold">{progress}%</span>
          </div>
        </div>

        <div>
          <h2 className="font-display text-2xl font-semibold text-foreground md:text-3xl">
            {name}, stiamo creando la tua magia...
          </h2>
          <motion.p
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 font-body text-sm text-muted-foreground"
          >
            {loadingSteps[currentStep]}
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalysisScreen;
