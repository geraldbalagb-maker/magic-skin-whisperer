import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import BrandLogo from "@/components/shared/BrandLogo";
import type { QuizData } from "./BeautyQuiz";
import { supabase } from "@/integrations/supabase/client";
import { adaptME22Routine } from "@/lib/me22Routine";
import type { Product } from "@/data/products";
import { Button } from "@/components/ui/button";

export interface AIRoutineResult {
  resolved_products?: Product[];
  skin_analysis: string;
  personalized_tips: { title: string; text: string }[];
  steps: {
    period?: string;
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
  { label: "Analisi del tipo di pelle" },
  { label: "Studio del profilo cutaneo" },
  { label: "Selezione ingredienti attivi" },
  { label: "Creazione routine su misura" },
  { label: "Simulazione risultati" },
];

const AnalysisScreen = ({ name, quizData, onComplete }: AnalysisScreenProps) => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [readyToReveal, setReadyToReveal] = useState(false);
  const resultRef = useRef<AnalysisResult | null>(null);
  const hasCalledAI = useRef(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (hasCalledAI.current) return;
    hasCalledAI.current = true;

    const callAI = async () => {
      try {
        const start = await supabase.functions.invoke("me22-preview", {
          body: {
            action: quizData.selfie ? "start" : "recommend",
            selfie: quizData.selfie || undefined,
            skinGoals: quizData.skinGoals,
            skinDescription: quizData.skinDescription,
            budget: quizData.budget,
          },
        });
        if (start.error || !start.data?.ok || !start.data.recommendation) {
          throw new Error("Non riusciamo a creare la routine con il motore ME-22. Nessun prodotto è stato assegnato: riprova tra poco.");
        }
        const routine = adaptME22Routine(start.data.recommendation, quizData.skinDescription, quizData.budget);
        let enhancedSelfie: string | null = null;
        const jobId = typeof start.data.jobId === "string" ? start.data.jobId : null;
        if (jobId) {
          const deadline = Date.now() + 180_000;
          while (Date.now() < deadline) {
            await new Promise(resolve => setTimeout(resolve, 3000));
            const status = await supabase.functions.invoke("me22-preview", { body: { action: "status", jobId } });
            if (status.data?.status === "done" && typeof status.data.image === "string") {
              enhancedSelfie = status.data.image;
              break;
            }
            if (status.error || status.data?.status === "failed" || status.data?.ok === false) break;
          }
        }
        // Preview failure must never discard the successfully composed engine routine.
        resultRef.current = { routine, enhancedSelfie };
      } catch (err) {
        console.error("AI analysis error:", err);
        setError(err instanceof Error ? err.message : "Errore nell'analisi");
      }
    };

    callAI();
  }, [quizData, attempt]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (resultRef.current && p >= 80) {
          if (p >= 100) {
            clearInterval(interval);
            setReadyToReveal(true);
            const result = resultRef.current;
            if (result) setTimeout(() => onComplete(result), 1200);
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
            Oops, qualcosa è andato storto
          </h2>
          <p className="font-body text-sm text-muted-foreground max-w-sm">{error}</p>
          <Button
            onClick={() => { hasCalledAI.current = false; setError(null); setAttempt(previous => previous + 1); }}
            className="bg-foreground px-8 py-3 font-body text-sm font-medium uppercase tracking-[0.2em] text-background"
          >
            Riprova
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="relative flex min-h-screen flex-col overflow-hidden bg-background"
      animate={readyToReveal ? { opacity: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      {/* Header brand bar — bianco, pulito, senza bordi */}
      <header className="flex w-full items-center justify-center bg-background px-4 py-5">
        <BrandLogo size="md" />
      </header>

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-10 px-4 py-8 md:flex-row md:items-center md:gap-14">

        {/* Selfie con cornice AI */}
        {quizData.selfie && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative flex-shrink-0"
          >
            <div className="ai-border">
              <div className="relative h-56 w-56 overflow-hidden bg-background sm:h-64 sm:w-64 md:h-72 md:w-72">
                <img
                  src={quizData.selfie}
                  alt="Il tuo selfie"
                  className="h-full w-full object-cover"
                />
                {/* Scan line */}
                <motion.div
                  className="pointer-events-none absolute inset-x-0 h-12"
                  style={{
                    background: "linear-gradient(180deg, transparent, hsl(var(--foreground) / 0.18), transparent)",
                  }}
                  animate={{ y: ["-15%", "115%"] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
                />
                {/* Corner brackets */}
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M 10,3 L 3,3 L 3,10" fill="none" stroke="hsl(var(--foreground))" strokeWidth="0.6" />
                  <path d="M 90,3 L 97,3 L 97,10" fill="none" stroke="hsl(var(--foreground))" strokeWidth="0.6" />
                  <path d="M 10,97 L 3,97 L 3,90" fill="none" stroke="hsl(var(--foreground))" strokeWidth="0.6" />
                  <path d="M 90,97 L 97,97 L 97,90" fill="none" stroke="hsl(var(--foreground))" strokeWidth="0.6" />
                </svg>
              </div>
            </div>
          </motion.div>
        )}

        {/* Info column */}
        <div className="flex w-full flex-col items-center gap-7 text-center md:items-start md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <p className="font-body text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Analisi AI in corso
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-foreground md:text-4xl">
              Stiamo creando la tua
              <br />
              routine, <span className="sparkle-text">{name}</span>
            </h2>
          </motion.div>

          {/* Progress bar minimal */}
          <div className="flex w-full max-w-xs flex-col gap-2">
            <div className="flex items-baseline justify-between">
              <span className="font-body text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Avanzamento
              </span>
              <span className="font-display text-base font-bold text-foreground tabular-nums">
                {Math.floor(progress)}%
              </span>
            </div>
            <div className="relative h-[2px] w-full overflow-hidden bg-border">
              <motion.div
                className="absolute inset-y-0 left-0 bg-foreground"
                style={{ width: `${progress}%` }}
                transition={{ ease: "linear" }}
              />
            </div>
          </div>

          {/* Phase steps */}
          <div className="w-full max-w-xs space-y-2.5">
            {analysisPhases.map((phase, i) => {
              const isCompleted = i < currentPhase;
              const isActive = i === currentPhase;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="relative flex h-5 w-5 flex-shrink-0 items-center justify-center">
                    <AnimatePresence mode="wait">
                      {isCompleted ? (
                        <motion.div
                          key="check"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex h-5 w-5 items-center justify-center bg-foreground"
                        >
                          <Check className="h-3 w-3 text-background" strokeWidth={3} />
                        </motion.div>
                      ) : isActive ? (
                        <motion.div
                          key="active"
                          className="relative flex h-5 w-5 items-center justify-center border border-foreground"
                        >
                          <motion.div
                            className="h-1.5 w-1.5 bg-foreground"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1.2, repeat: Infinity }}
                          />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="pending"
                          className="flex h-5 w-5 items-center justify-center border border-border"
                        />
                      )}
                    </AnimatePresence>
                  </div>
                  <p
                    className={`font-body text-sm transition-colors ${
                      isActive
                        ? "font-medium text-foreground"
                        : isCompleted
                        ? "text-foreground/60"
                        : "text-muted-foreground/50"
                    }`}
                  >
                    {phase.label}
                  </p>
                  {isActive && (
                    <Loader2 className="h-3 w-3 animate-spin text-foreground" />
                  )}
                </motion.div>
              );
            })}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="font-body text-[11px] uppercase tracking-[0.2em] text-muted-foreground"
          >
            <span className="font-semibold text-foreground">Beaut-AI</span> sta lavorando per te
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalysisScreen;
