import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ChevronRight, ChevronLeft, SkipForward, Sparkles, Loader2 } from "lucide-react";
import MaisonLogo from "@/components/MaisonLogo";
import { supabase } from "@/integrations/supabase/client";
import stepNameImg from "@/assets/steps/step-name.jpg";
import stepSelfieImg from "@/assets/steps/step-selfie.jpg";
import stepAgeImg from "@/assets/steps/step-age.jpg";
import stepTimeImg from "@/assets/steps/step-time.jpg";
import stepSkinImg from "@/assets/steps/step-skin.jpg";

const stepImages = [stepNameImg, stepSelfieImg, stepAgeImg, stepTimeImg, stepSkinImg];

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
  enter: { opacity: 0, y: 40, scale: 0.96 },
  center: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -40, scale: 0.96 },
};

const skinSuggestions = [
  "Pelle secca e disidratata",
  "Pelle grassa con pori dilatati",
  "Rughe e segni del tempo",
  "Acne e imperfezioni",
];

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
          <motion.div key="name" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.5 }} className="flex flex-col items-center gap-6 text-center">
            <div className="relative">
              <h2 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
                Come ti chiami?
              </h2>
              <p className="mt-2 font-body text-sm text-muted-foreground">
                Vogliamo creare un'esperienza su misura per te ✨
              </p>
            </div>
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              placeholder="Il tuo nome..."
              className="w-full max-w-xs rounded-lg border border-primary/20 bg-card/80 px-6 py-4 text-center font-display text-lg text-foreground shadow-elegant backdrop-blur-sm placeholder:text-muted-foreground/40 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && data.name && nextStep()}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextStep}
              disabled={!data.name}
              className="bg-gradient-cta rounded-sm px-8 py-3 font-body text-xs font-semibold uppercase tracking-widest text-cta-foreground shadow-cta transition-all disabled:opacity-40"
            >
              Continua <ChevronRight className="ml-1 inline h-4 w-4" />
            </motion.button>
          </motion.div>
        );

      case 1:
        return (
          <motion.div key="selfie" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.5 }} className="flex flex-col items-center gap-6 text-center">
            <Camera className="mx-auto h-8 w-8 text-foreground" />
            <h2 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
              {data.name}, fatti un selfie! 📸
            </h2>
            <p className="max-w-sm font-body text-sm text-muted-foreground">
              Ci serve una foto per capire com'è fatta la tua pelle e poterti consigliare al meglio. Tranquilla, rimarrà tra noi 🤫
            </p>
            <label className="group cursor-pointer">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center gap-3 rounded-sm border-2 border-dashed border-border bg-card p-8 transition-colors group-hover:border-foreground/40"
              >
                {data.selfie ? (
                  <img src={data.selfie} alt="Selfie" className="h-32 w-32 rounded-full object-cover shadow-elegant" />
                ) : (
                  <>
                    <div className="rounded-full bg-foreground p-4">
                      <Camera className="h-6 w-6 text-background" />
                    </div>
                    <span className="font-body text-sm text-muted-foreground">Tocca per scattare o caricare</span>
                  </>
                )}
              </motion.div>
              <input type="file" accept="image/*" capture="user" onChange={handleSelfie} className="hidden" />
            </label>
            <button onClick={nextStep} className="flex items-center gap-1 font-body text-xs text-muted-foreground/60 transition-colors hover:text-muted-foreground">
              <SkipForward className="h-3 w-3" /> Salta questo passaggio
            </button>
          </motion.div>
        );

      case 2:
        return (
          <motion.div key="age" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.5 }} className="flex flex-col items-center gap-6 text-center">
            <h2 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
              {data.name}, quanti anni hai? 🌸
            </h2>
            <p className="font-body text-sm text-muted-foreground">
              Ogni età ha la sua bellezza — e la sua routine perfetta
            </p>
            <input
              type="number"
              inputMode="numeric"
              min={13}
              max={99}
              value={data.age}
              onChange={(e) => setData({ ...data, age: e.target.value })}
              placeholder="Età"
              className="w-full max-w-[160px] rounded-lg border border-primary/20 bg-card/80 px-6 py-4 text-center font-display text-2xl text-foreground shadow-elegant backdrop-blur-sm placeholder:text-sm placeholder:text-muted-foreground/40 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && data.age && nextStep()}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextStep}
              disabled={!data.age}
              className="bg-gradient-cta rounded-sm px-8 py-3 font-body text-xs font-semibold uppercase tracking-widest text-cta-foreground shadow-cta transition-all disabled:opacity-40"
            >
              Continua <ChevronRight className="ml-1 inline h-4 w-4" />
            </motion.button>
          </motion.div>
        );

      case 3:
        return (
          <motion.div key="time" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.5 }} className="flex flex-col items-center gap-6 text-center">
            <h2 className="font-display text-2xl font-semibold text-foreground md:text-3xl">
              Sappiamo che hai mille impegni, {data.name}
            </h2>
            <p className="font-body text-sm text-muted-foreground">
              Quanto tempo hai ogni giorno per la tua beauty routine?
            </p>
            <div className="grid grid-cols-2 gap-3">
              {timeOptions.map((opt) => (
                <motion.button
                  key={opt}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setData({ ...data, time: opt });
                    setTimeout(() => setStep(4), 400);
                  }}
                  className={`rounded-sm border px-5 py-4 font-body text-sm transition-all ${
                    data.time === opt
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-card text-foreground hover:border-foreground/40"
                  }`}
                >
                  {opt}
                </motion.button>
              ))}
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div key="skin" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.5 }} className="flex flex-col items-center gap-6 text-center">
            <h2 className="font-display text-2xl font-semibold text-foreground md:text-3xl">
              Raccontaci di più, {data.name} 💫
            </h2>
            <p className="max-w-sm font-body text-sm text-muted-foreground">
              Com'è la tua pelle? Hai particolari esigenze? Che effetto vorresti ottenere?
            </p>

            {/* Suggestion chips */}
            <div className="flex max-w-md flex-wrap justify-center gap-2">
              {skinSuggestions.map((s) => (
                <motion.button
                  key={s}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSuggestionClick(s)}
                  className="rounded-full border border-border bg-card px-3 py-1.5 font-body text-[11px] text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground"
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
                className="h-32 w-full resize-none rounded-lg border border-primary/20 bg-card/80 px-5 py-4 pr-12 font-body text-sm text-foreground shadow-elegant backdrop-blur-sm placeholder:text-muted-foreground/40 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20"
                autoFocus
              />
              {/* AI enhance button */}
              {data.skinDescription.trim().length > 10 && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={enhanceWithAI}
                  disabled={isEnhancing}
                  className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-foreground px-2.5 py-1.5 font-body text-[10px] font-medium text-background transition-all disabled:opacity-50"
                  title="Migliora il testo con l'AI"
                >
                  {isEnhancing ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Sparkles className="h-3 w-3" />
                  )}
                  {isEnhancing ? "..." : "Migliora"}
                </motion.button>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextStep}
              disabled={!data.skinDescription}
              className="bg-gradient-cta rounded-sm px-8 py-3 font-body text-xs font-semibold uppercase tracking-widest text-cta-foreground shadow-cta transition-all disabled:opacity-40"
            >
              Scopri la tua routine
            </motion.button>
          </motion.div>
        );

      default:
        return null;
    }
  };

  const progress = ((step + 1) / 5) * 100;

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
      {/* Logo */}
      <div className="absolute top-6 left-1/2 z-50 -translate-x-1/2">
        <MaisonLogo variant="dark" size="md" />
      </div>
      {/* Step image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`img-${step}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.12, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
        >
          <img
            src={stepImages[step]}
            alt=""
            className="h-full w-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Progress bar */}
      <div className="fixed left-0 right-0 top-0 z-50 h-1 bg-muted">
        <motion.div
          className="h-full bg-gradient-gold"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Back button */}
      {step > 0 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={prevStep}
          className="fixed left-4 top-6 z-50 flex items-center gap-1 rounded-full bg-card/80 px-3 py-2 font-body text-xs text-muted-foreground shadow-sm backdrop-blur-sm transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Indietro
        </motion.button>
      )}

      {/* Chat-style container */}
      <div className="relative w-full max-w-lg">
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </div>

      {/* Step indicator */}
      <div className="mt-8 flex gap-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <button
            key={i}
            onClick={() => i < step && setStep(i)}
            disabled={i >= step}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === step ? "w-8 bg-foreground" : i < step ? "w-2 bg-foreground/40 cursor-pointer hover:bg-foreground/60" : "w-2 bg-muted"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default BeautyQuiz;
