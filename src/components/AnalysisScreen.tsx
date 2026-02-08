import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MagicSparkles from "./MagicSparkles";

interface AnalysisScreenProps {
  name: string;
  onComplete: () => void;
}

const steps = [
  "Analizzo il tuo tipo di pelle...",
  "Cerco i prodotti più adatti a te...",
  "Creo la tua routine personalizzata...",
  "Aggiungo un tocco di magia... ✨",
];

const AnalysisScreen = ({ name, onComplete }: AnalysisScreenProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return p + 1;
      });
    }, 60);
    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((s) => (s < steps.length - 1 ? s + 1 : s));
    }, 1500);
    return () => clearInterval(stepInterval);
  }, []);

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
            {steps[currentStep]}
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalysisScreen;
