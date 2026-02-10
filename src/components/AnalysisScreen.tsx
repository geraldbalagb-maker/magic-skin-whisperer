import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import MaisonLogo from "@/components/MaisonLogo";
import type { QuizData } from "./BeautyQuiz";
import { supabase } from "@/integrations/supabase/client";

export interface AIRoutineResult {
  skin_analysis: string;
  personalized_tips: { title: string; text: string }[];
  steps: {
    step_name: string;
    step_order: number;
    icon: string;
    description: string;
    product_ids: string[];
    alternative_product_ids?: string[];
  }[];
}

export interface AnalysisResult {
  routine: AIRoutineResult;
  enhancedSelfie: string | null;
}

interface AnalysisScreenProps {
  name: string;
  quizData: QuizData;
  onComplete: (result: AnalysisResult) => void;
}

const analysisPhases = [
  { icon: "🔬", label: "Analisi del tipo di pelle", detail: "Scansione in corso..." },
  { icon: "🧬", label: "Studio del profilo cutaneo", detail: "Elaborazione dati..." },
  { icon: "💎", label: "Selezione ingredienti attivi", detail: "Matching prodotti..." },
  { icon: "✨", label: "Creazione routine su misura", detail: "Personalizzazione AI..." },
  { icon: "🪄", label: "Simulazione risultati", detail: "Quasi pronta..." },
];

const AnalysisScreen = ({ name, quizData, onComplete }: AnalysisScreenProps) => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [readyToReveal, setReadyToReveal] = useState(false);
  const resultRef = useRef<AnalysisResult | null>(null);
  const hasCalledAI = useRef(false);

  // Call AI edge functions in parallel
  useEffect(() => {
    if (hasCalledAI.current) return;
    hasCalledAI.current = true;

    const callAI = async () => {
      try {
        const routinePromise = supabase.functions.invoke("analyze-skin", {
          body: {
            name: quizData.name,
            age: quizData.age,
            time: quizData.time,
            skinDescription: quizData.skinDescription,
            hasSelfie: !!quizData.selfie,
          },
        });

        const selfiePromise = quizData.selfie
          ? supabase.functions.invoke("enhance-selfie", {
              body: { selfieBase64: quizData.selfie },
            })
          : Promise.resolve({ data: null, error: null });

        const [routineRes, selfieRes] = await Promise.all([routinePromise, selfiePromise]);

        if (routineRes.error) throw new Error(routineRes.error.message);
        if (!routineRes.data?.success) throw new Error(routineRes.data?.error || "Errore nell'analisi");

        let enhancedSelfie: string | null = null;
        if (selfieRes.data?.success && selfieRes.data?.enhancedImage) {
          enhancedSelfie = selfieRes.data.enhancedImage;
        }

        resultRef.current = {
          routine: routineRes.data.routine,
          enhancedSelfie,
        };
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
        if (resultRef.current && p >= 80) {
          if (p >= 100) {
            clearInterval(interval);
            setReadyToReveal(true);
            setTimeout(() => onComplete(resultRef.current!), 1500);
            return 100;
          }
          return p + 3;
        }
        if (p >= 85 && !resultRef.current) return p;
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + 0.8;
      });
    }, 60);
    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    const phaseIndex = Math.min(
      Math.floor((progress / 100) * analysisPhases.length),
      analysisPhases.length - 1
    );
    setCurrentPhase(phaseIndex);
  }, [progress]);

  if (error) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <div className="flex flex-col items-center gap-6 text-center">
          <h2 className="font-display text-2xl font-semibold text-foreground">
            Oops, qualcosa è andato storto 😔
          </h2>
          <p className="font-body text-sm text-muted-foreground max-w-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-cta rounded-sm px-8 py-3 font-body text-sm font-medium text-cta-foreground shadow-cta"
          >
            Riprova
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-dark px-4"
      animate={readyToReveal ? { opacity: 0, scale: 1.1 } : {}}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      {/* Logo */}
      <div className="absolute top-6 left-6 z-50">
        <MaisonLogo variant="light" size="md" />
      </div>

      {/* Animated background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute left-1/2 top-1/2 h-[150%] w-[150%] -translate-x-1/2 -translate-y-1/2 opacity-[0.04]"
          style={{ background: "conic-gradient(from 0deg, hsl(38 55% 55%), transparent, hsl(40 60% 75%), transparent, hsl(38 55% 55%))" }}
        />
      </div>

      {/* Desktop: two columns / Mobile: stacked compact */}
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center gap-8 md:flex-row md:items-center md:gap-12">
        
        {/* Left: Large selfie */}
        {quizData.selfie && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", bounce: 0.4 }}
            className="relative flex-shrink-0"
          >
            <div className="relative h-64 w-64 overflow-hidden rounded-2xl border-2 border-primary/30 md:h-80 md:w-80">
              <img
                src={quizData.selfie}
                alt="Il tuo selfie"
                className="h-full w-full object-cover"
              />
              {/* Scanning overlay */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(180deg, transparent, hsl(38 55% 55% / 0.15), transparent)",
                  backgroundSize: "100% 60px",
                }}
                animate={{ backgroundPosition: ["0 -60px", "0 350px"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              {/* Corner brackets */}
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
                <motion.path d="M 15,5 L 5,5 L 5,15" fill="none" stroke="hsl(38 55% 55%)" strokeWidth="1.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 0.6 }} />
                <motion.path d="M 85,5 L 95,5 L 95,15" fill="none" stroke="hsl(38 55% 55%)" strokeWidth="1.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.7, duration: 0.6 }} />
                <motion.path d="M 15,95 L 5,95 L 5,85" fill="none" stroke="hsl(38 55% 55%)" strokeWidth="1.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.9, duration: 0.6 }} />
                <motion.path d="M 85,95 L 95,95 L 95,85" fill="none" stroke="hsl(38 55% 55%)" strokeWidth="1.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.1, duration: 0.6 }} />
              </svg>
            </div>
          </motion.div>
        )}

        {/* Right: Info column */}
        <div className="flex flex-col items-center gap-6 md:items-start">
          {/* Title */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center md:text-left">
            <h2 className="font-display text-2xl font-bold text-primary-foreground md:text-3xl">
              Stiamo analizzando
              <br />
              <span className="sparkle-text">la tua pelle, {name}</span>
            </h2>
          </motion.div>

          {/* Progress ring + percentage */}
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="relative">
            <svg width="80" height="80" className="drop-shadow-lg">
              <circle cx="40" cy="40" r="34" fill="none" stroke="hsl(0 0% 100% / 0.08)" strokeWidth="4" />
              <motion.circle cx="40" cy="40" r="34" fill="none" stroke="url(#progressGrad)" strokeWidth="4" strokeLinecap="round" strokeDasharray={214} strokeDashoffset={214 - (progress / 100) * 214} transform="rotate(-90 40 40)" />
              <defs>
                <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(38 55% 55%)" />
                  <stop offset="100%" stopColor="hsl(40 60% 75%)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-lg font-bold text-primary">{Math.floor(progress)}%</span>
            </div>
          </motion.div>

          {/* Phase steps - compact on mobile */}
          <div className="w-full max-w-xs space-y-2">
            {analysisPhases.map((phase, i) => {
              const isCompleted = i < currentPhase;
              const isActive = i === currentPhase;
              return (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.15 }} className="flex items-center gap-2.5">
                  <div className="relative flex h-6 w-6 flex-shrink-0 items-center justify-center">
                    <AnimatePresence mode="wait">
                      {isCompleted ? (
                        <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20">
                          <Check className="h-3 w-3 text-primary" />
                        </motion.div>
                      ) : isActive ? (
                        <motion.div key="active" className="relative flex h-5 w-5 items-center justify-center">
                          <motion.div className="absolute inset-0 rounded-full bg-primary/20" animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }} />
                          <span className="relative z-10 text-xs">{phase.icon}</span>
                        </motion.div>
                      ) : (
                        <motion.div key="pending" className="flex h-5 w-5 items-center justify-center rounded-full opacity-30">
                          <span className="text-xs">{phase.icon}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <p className={`font-body text-xs transition-all duration-500 ${isActive ? "font-medium text-primary-foreground" : isCompleted ? "text-primary-foreground/50" : "text-primary-foreground/25"}`}>
                    {phase.label}
                  </p>
                  {isActive && (
                    <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity }}>
                      <Sparkles className="h-3 w-3 text-primary" />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="font-body text-[11px] text-primary-foreground/30">
            L'intelligenza artificiale sta lavorando per te
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalysisScreen;
