import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ChevronRight, ChevronLeft, SkipForward, Sparkles, Loader2 } from "lucide-react";
import BrandLogo from "@/components/shared/BrandLogo";
import { supabase } from "@/integrations/supabase/client";

export interface QuizData {
  name: string;
  selfie: string | null;
  age: string;
  time: string;
  skinDescription: string;
}

interface BeautyQuizProps {
  onComplete: (data: QuizData) => void;
}

const stepVariants = {
  enter: { opacity: 0, y: 30, scale: 0.97, filter: "blur(8px)" },
  center: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, y: -30, scale: 0.97, filter: "blur(8px)" },
};

const skinSuggestions = [
  "Pelle secca e disidratata",
  "Pelle grassa con pori dilatati",
  "Rughe e segni del tempo",
  "Acne e imperfezioni",
];

/* Minimal card wrapper — no glassmorphism, no rounded corners */
const MinimalCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div
    className={`border border-border bg-background p-8 shadow-elegant md:p-10 ${className}`}
  >
    {children}
  </div>
);

const BeautyQuiz = ({ onComplete }: BeautyQuizProps) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<QuizData>({
    name: "",
    selfie: null,
    age: "",
    time: "",
    skinDescription: "",
  });
  const [isEnhancing, setIsEnhancing] = useState(false);

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
    else onComplete(data);
  };

  const handleSelfie = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setData({ ...data, selfie: reader.result as string });
        setTimeout(nextStep, 500);
      };
      reader.readAsDataURL(file);
    }
  };

  const timeOptions = ["5 minuti", "10 minuti", "20 minuti", "30+ minuti"];

  const handleSuggestionClick = (suggestion: string) => {
    setData((prev) => ({
      ...prev,
      skinDescription: prev.skinDescription
        ? `${prev.skinDescription}, ${suggestion.toLowerCase()}`
        : suggestion,
    }));
  };

  const enhanceWithAI = useCallback(async () => {
    if (!data.skinDescription.trim() || isEnhancing) return;
    setIsEnhancing(true);
    try {
      const res = await supabase.functions.invoke("enhance-text", {
        body: { text: data.skinDescription, name: data.name },
      });
      if (res.data?.enhanced) {
        setData((prev) => ({ ...prev, skinDescription: res.data.enhanced }));
      }
    } catch (err) {
      console.warn("Text enhancement failed:", err);
    } finally {
      setIsEnhancing(false);
    }
  }, [data.skinDescription, data.name, isEnhancing]);

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <motion.div key="name" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            <MinimalCard>
              <div className="flex flex-col items-center gap-7 text-center">
                <div className="flex h-10 w-10 items-center justify-center border border-primary/20 bg-[hsl(var(--cream))] font-display text-sm font-bold text-primary">
                  1
                </div>

                <div>
                  <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                    Come ti chiami?
                  </h2>
                  <p className="mt-3 font-body text-sm text-muted-foreground">
                    Vogliamo creare un'esperienza su misura per te ✨
                  </p>
                </div>

                <div className="relative w-full max-w-xs">
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    placeholder="Il tuo nome..."
                    className="w-full border border-border bg-background px-6 py-4 text-center font-display text-lg text-foreground placeholder:text-muted-foreground/35 focus:border-primary focus:outline-none transition-all duration-300"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && data.name && nextStep()}
                  />
                  <motion.div
                    className="absolute -bottom-px left-1/2 h-px -translate-x-1/2 bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: data.name ? "80%" : "0%" }}
                    transition={{ duration: 0.4 }}
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={nextStep}
                  disabled={!data.name}
                  className="bg-[hsl(var(--v2-amber))] px-10 py-3.5 font-body text-xs font-semibold uppercase tracking-[0.2em] text-white transition-all hover:bg-[hsl(var(--v2-amber-dark))] disabled:opacity-30"
                >
                  Continua <ChevronRight className="ml-1 inline h-4 w-4" />
                </motion.button>
              </div>
            </MinimalCard>
          </motion.div>
        );

      case 1:
        return (
          <motion.div key="selfie" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            <MinimalCard>
              <div className="flex flex-col items-center gap-7 text-center">
                <div className="flex h-10 w-10 items-center justify-center border border-primary/20 bg-[hsl(var(--cream))] font-display text-sm font-bold text-primary">
                  2
                </div>

                <div>
                  <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                    {data.name}, fatti un selfie! 📸
                  </h2>
                  <p className="mt-3 max-w-sm font-body text-sm text-muted-foreground">
                    Ci serve una foto per capire com'è fatta la tua pelle e poterti consigliare al meglio. Tranquilla, rimarrà tra noi 🤫
                  </p>
                </div>

                <label className="group cursor-pointer">
                  <motion.div
                    whileHover={{ scale: 1.03, y: -2 }}
                    className="relative overflow-hidden border border-border bg-[hsl(var(--cream))] p-8 transition-all duration-300 group-hover:border-primary/25 group-hover:shadow-gold"
                  >
                    {data.selfie ? (
                      <motion.img
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        src={data.selfie}
                        alt="Selfie"
                        className="h-36 w-36 object-cover shadow-elevated"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-4">
                        <div className="border border-primary/20 bg-background p-5">
                          <Camera className="h-7 w-7 text-primary" />
                        </div>
                        <span className="font-body text-xs font-medium text-muted-foreground/70">
                          Tocca per scattare o caricare
                        </span>
                      </div>
                    )}
                  </motion.div>
                  <input type="file" accept="image/*" capture="user" onChange={handleSelfie} className="hidden" />
                </label>

                <button onClick={nextStep} className="flex items-center gap-1.5 font-body text-xs text-muted-foreground/50 transition-colors hover:text-muted-foreground">
                  <SkipForward className="h-3 w-3" /> Salta questo passaggio
                </button>
              </div>
            </MinimalCard>
          </motion.div>
        );

      case 2:
        return (
          <motion.div key="age" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            <MinimalCard>
              <div className="flex flex-col items-center gap-7 text-center">
                <div className="flex h-10 w-10 items-center justify-center border border-primary/20 bg-[hsl(var(--cream))] font-display text-sm font-bold text-primary">
                  3
                </div>

                <div>
                  <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                    {data.name}, quanti anni hai? 🌸
                  </h2>
                  <p className="mt-3 font-body text-sm text-muted-foreground">
                    Ogni età ha la sua bellezza, e la sua routine perfetta
                  </p>
                </div>

                <div className="relative">
                  <input
                    type="number"
                    inputMode="numeric"
                    min={13}
                    max={99}
                    value={data.age}
                    onChange={(e) => setData({ ...data, age: e.target.value })}
                    placeholder="Età"
                    className="w-36 border border-border bg-background px-6 py-4 text-center font-display text-3xl font-bold text-foreground placeholder:text-base placeholder:font-normal placeholder:text-muted-foreground/30 focus:border-primary focus:outline-none transition-all duration-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && data.age && nextStep()}
                  />
                  <motion.div
                    className="absolute -bottom-px left-1/2 h-px -translate-x-1/2 bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: data.age ? "80%" : "0%" }}
                    transition={{ duration: 0.4 }}
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={nextStep}
                  disabled={!data.age}
                  className="bg-[hsl(var(--v2-amber))] px-10 py-3.5 font-body text-xs font-semibold uppercase tracking-[0.2em] text-white transition-all hover:bg-[hsl(var(--v2-amber-dark))] disabled:opacity-30"
                >
                  Continua <ChevronRight className="ml-1 inline h-4 w-4" />
                </motion.button>
              </div>
            </MinimalCard>
          </motion.div>
        );

      case 3:
        return (
          <motion.div key="time" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            <MinimalCard>
              <div className="flex flex-col items-center gap-7 text-center">
                <div className="flex h-10 w-10 items-center justify-center border border-primary/20 bg-[hsl(var(--cream))] font-display text-sm font-bold text-primary">
                  4
                </div>

                <div>
                  <h2 className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                    Sappiamo che hai mille impegni, {data.name}
                  </h2>
                  <p className="mt-3 font-body text-sm text-muted-foreground">
                    Quanto tempo hai ogni giorno per la tua beauty routine?
                  </p>
                </div>

                <div className="grid w-full max-w-sm grid-cols-2 gap-3">
                  {timeOptions.map((opt, idx) => (
                    <motion.button
                      key={opt}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + idx * 0.08 }}
                      whileHover={{ scale: 1.04, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        setData({ ...data, time: opt });
                        setTimeout(() => setStep(4), 400);
                      }}
                      className={`border px-5 py-4 font-body text-sm font-medium transition-all duration-300 ${
                        data.time === opt
                          ? "border-primary bg-primary text-white"
                          : "border-border bg-background text-foreground hover:border-primary/30"
                      }`}
                    >
                      {opt}
                    </motion.button>
                  ))}
                </div>
              </div>
            </MinimalCard>
          </motion.div>
        );

      case 4:
        return (
          <motion.div key="skin" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            <MinimalCard>
              <div className="flex flex-col items-center gap-6 text-center">
                <div className="flex h-10 w-10 items-center justify-center border border-primary/20 bg-[hsl(var(--cream))] font-display text-sm font-bold text-primary">
                  5
                </div>

                <div>
                  <h2 className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                    Raccontaci di più, {data.name} 💫
                  </h2>
                  <p className="mt-3 max-w-sm font-body text-sm text-muted-foreground">
                    Com'è la tua pelle? Hai particolari esigenze? Che effetto vorresti ottenere?
                  </p>
                </div>

                {/* Suggestion chips */}
                <div className="flex max-w-md flex-wrap justify-center gap-2">
                  {skinSuggestions.map((s, idx) => (
                    <motion.button
                      key={s}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + idx * 0.06 }}
                      whileHover={{ scale: 1.06, y: -1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSuggestionClick(s)}
                      className="border border-border bg-background px-4 py-2 font-body text-[11px] font-medium text-muted-foreground transition-all duration-300 hover:border-primary/30 hover:text-foreground"
                    >
                      {s}
                    </motion.button>
                  ))}
                </div>

                <div className="relative w-full max-w-md">
                  <textarea
                    value={data.skinDescription}
                    onChange={(e) => setData({ ...data, skinDescription: e.target.value })}
                    placeholder="Es: Ho la pelle mista, con qualche imperfezione sulla zona T. Vorrei un effetto glow naturale..."
                    className="h-32 w-full resize-none border border-border bg-background px-5 py-4 pr-12 font-body text-sm text-foreground placeholder:text-muted-foreground/35 focus:border-primary focus:outline-none transition-all duration-300"
                    autoFocus
                  />
                  {/* AI enhance button */}
                  {data.skinDescription.trim().length > 10 && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={enhanceWithAI}
                      disabled={isEnhancing}
                      className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-primary px-3 py-1.5 font-body text-[10px] font-semibold text-white transition-all disabled:opacity-50"
                      title="Migliora il testo con l'AI"
                    >
                      {isEnhancing ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Sparkles className="h-3 w-3" />
                      )}
                      {isEnhancing ? "..." : "Migliora con AI"}
                    </motion.button>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={nextStep}
                  disabled={!data.skinDescription}
                  className="bg-[hsl(var(--v2-amber))] px-10 py-3.5 font-body text-xs font-semibold uppercase tracking-[0.2em] text-white transition-all hover:bg-[hsl(var(--v2-amber-dark))] disabled:opacity-30"
                >
                  Scopri la tua routine
                </motion.button>
              </div>
            </MinimalCard>
          </motion.div>
        );

      default:
        return null;
    }
  };

  const progress = ((step + 1) / 5) * 100;

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[hsl(var(--cream))] px-4 py-8">
      {/* Logo */}
      <div className="absolute top-6 left-6 z-50">
        <BrandLogo size="md" />
      </div>

      {/* Progress bar */}
      <div className="fixed left-0 right-0 top-0 z-50 h-0.5 bg-muted/50">
        <motion.div
          className="h-full bg-primary"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Back button */}
      {step > 0 && (
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={prevStep}
          className="fixed left-4 bottom-6 z-50 flex items-center gap-1.5 border border-border bg-background px-3.5 py-2 font-body text-xs text-muted-foreground shadow-elegant transition-all hover:text-foreground"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Indietro
        </motion.button>
      )}

      {/* Card container */}
      <div className="relative w-full max-w-lg">
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </div>

      {/* Step indicator — minimal lines */}
      <div className="mt-10 flex items-center gap-2.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.button
            key={i}
            onClick={() => i < step && setStep(i)}
            disabled={i > step}
            animate={{
              width: i === step ? 32 : 8,
              backgroundColor: i === step
                ? "hsl(40 45% 50%)"
                : i < step
                  ? "hsl(40 45% 50% / 0.4)"
                  : "hsl(0 0% 80% / 0.3)",
            }}
            className="h-1 cursor-pointer transition-colors"
          />
        ))}
      </div>
    </div>
  );
};

export default BeautyQuiz;
