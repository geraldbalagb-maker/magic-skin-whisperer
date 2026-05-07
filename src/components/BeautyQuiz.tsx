import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Sparkles, Loader2, Pencil } from "lucide-react";
import BrandLogo from "@/components/shared/BrandLogo";
import CameraCapture from "@/components/shared/CameraCapture";
import { supabase } from "@/integrations/supabase/client";

export interface QuizData {
  name: string;
  selfie: string | null;
  age: string;
  time: string;
  skinDescription: string;
  skinGoals: string[];
  currentProducts: string[];
  budget: string;
}

interface BeautyQuizProps {
  onComplete: (data: QuizData) => void;
}

const stepVariants = {
  enter: { opacity: 0, y: 30, filter: "blur(6px)" },
  center: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -30, filter: "blur(6px)" },
};


const skinGoalsOptions = ["Più distesa", "Senza macchie", "Luminosa", "Senza pori dilatati"];

const productOptions = [
  "Detergente",
  "Tonico",
  "Siero",
  "Crema viso",
  "Crema contorno occhi",
  "Maschera",
  "Scrub / Esfoliante",
  "Protezione solare (SPF)",
];

const budgetOptions = ["Entro i 50€", "Fino a 100€", "Oltre i 100€"];
const timeOptions = ["5 minuti", "10 minuti", "20 minuti", "30+ minuti"];

const TOTAL_STEPS = 8; // 0..7

const MinimalCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`border border-border bg-background p-8 shadow-elegant md:p-10 ${className}`}>
    {children}
  </div>
);

const StepBadge = ({ n }: { n: number }) => (
  <div className="flex h-10 w-10 items-center justify-center border border-primary/20 bg-[hsl(var(--cream))] font-display text-sm font-bold text-primary">
    {n}
  </div>
);

const PrimaryButton = ({ children, disabled, onClick }: { children: React.ReactNode; disabled?: boolean; onClick: () => void }) => (
  <motion.button
    whileHover={{ scale: 1.03, y: -1 }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    disabled={disabled}
    className="bg-primary px-10 py-3.5 font-body text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-30"
  >
    {children}
  </motion.button>
);

const BeautyQuiz = ({ onComplete }: BeautyQuizProps) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<QuizData>({
    name: "",
    selfie: null,
    age: "",
    time: "",
    skinDescription: "",
    skinGoals: [],
    currentProducts: [],
    budget: "",
  });
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [isAnalyzingSelfie, setIsAnalyzingSelfie] = useState(false);
  const [selfieAnalysisDone, setSelfieAnalysisDone] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const prevStep = () => step > 0 && setStep(step - 1);

  const nextStep = () => {
    if (step < TOTAL_STEPS - 1) setStep(step + 1);
    else onComplete(data);
  };

  const handleSelfie = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setData((prev) => ({ ...prev, selfie: reader.result as string }));
    };
    reader.readAsDataURL(file);
    // reset input so the same file can be selected again
    e.target.value = "";
  };

  const toggleArray = (key: "skinGoals" | "currentProducts", value: string) => {
    setData((prev) => {
      const arr = prev[key];
      const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
      return { ...prev, [key]: next };
    });
  };

  const setAllProducts = () => {
    setData((prev) => ({
      ...prev,
      currentProducts:
        prev.currentProducts.length === productOptions.length ? [] : [...productOptions],
    }));
  };

  const analyzeSelfie = useCallback(async () => {
    if (!data.selfie || isAnalyzingSelfie) return;
    setIsAnalyzingSelfie(true);
    try {
      const res = await supabase.functions.invoke("analyze-selfie", {
        body: { selfie: data.selfie, name: data.name, age: data.age },
      });
      if (res.data?.analysis) {
        setData((prev) => ({ ...prev, skinDescription: String(res.data.analysis) }));
        setSelfieAnalysisDone(true);
      } else if (res.error) {
        console.warn("Selfie analysis failed:", res.error);
        setSelfieAnalysisDone(true);
      }
    } catch (err) {
      console.warn("Selfie analysis failed:", err);
      setSelfieAnalysisDone(true);
    } finally {
      setIsAnalyzingSelfie(false);
    }
  }, [data.selfie, data.name, data.age, isAnalyzingSelfie]);

  // Trigger AI analysis quando si entra nello step 7 con selfie disponibile
  useEffect(() => {
    if (step === 7 && data.selfie && !selfieAnalysisDone && !isAnalyzingSelfie) {
      analyzeSelfie();
    }
  }, [step, data.selfie, selfieAnalysisDone, isAnalyzingSelfie, analyzeSelfie]);


  const enhanceWithAI = useCallback(async () => {
    if (!data.skinDescription.trim() || isEnhancing) return;
    setIsEnhancing(true);
    try {
      const res = await supabase.functions.invoke("enhance-text", {
        body: { text: data.skinDescription, name: data.name },
      });
      if (res.data?.enhanced) {
        // strip any markdown that may have slipped through
        const clean = String(res.data.enhanced)
          .replace(/[*_`#>]+/g, "")
          .replace(/\n{2,}/g, "\n")
          .trim();
        setData((prev) => ({ ...prev, skinDescription: clean }));
      }
    } catch (err) {
      console.warn("Text enhancement failed:", err);
    } finally {
      setIsEnhancing(false);
    }
  }, [data.skinDescription, data.name, isEnhancing]);

  const renderStep = () => {
    switch (step) {
      // 0 — NAME
      case 0:
        return (
          <motion.div key="name" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.5 }}>
            <MinimalCard>
              <div className="flex flex-col items-center gap-7 text-center">
                <StepBadge n={1} />
                <div>
                  <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">Come ti chiami?</h2>
                  <p className="mt-3 font-body text-sm text-muted-foreground">Vogliamo creare un'esperienza su misura per te</p>
                </div>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  placeholder="Il tuo nome..."
                  className="w-full max-w-xs border border-border bg-background px-6 py-4 text-center font-display text-lg text-foreground placeholder:text-muted-foreground/35 focus:border-primary focus:outline-none transition-all"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && data.name && nextStep()}
                />
                <PrimaryButton onClick={nextStep} disabled={!data.name}>Continua</PrimaryButton>
              </div>
            </MinimalCard>
          </motion.div>
        );

      // 1 — SELFIE (scatta vs carica, no auto-advance, preview grande, conferma esplicita)
      case 1:
        return (
          <motion.div key="selfie" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.5 }}>
            <MinimalCard>
              <div className="flex flex-col items-center gap-6 text-center">
                <StepBadge n={2} />
                <div>
                  <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                    {data.name}, fatti un selfie
                  </h2>
                  <p className="mt-3 max-w-sm font-body text-sm text-muted-foreground">
                    Una foto ravvicinata del viso a luce naturale ci aiuta ad analizzare la tua pelle in modo accurato.
                  </p>
                </div>

                {/* Preview area */}
                {data.selfie ? (
                  <div className="flex w-full flex-col items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setData((p) => ({ ...p, selfie: null }))}
                      title="Tocca per rifare/ricaricare"
                      className="relative w-full max-w-sm overflow-hidden border border-border bg-[hsl(var(--cream))] p-2 transition hover:border-primary/40"
                    >
                      <img src={data.selfie} alt="Selfie" className="aspect-square w-full object-cover" />
                      <span className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-foreground/80 px-3 py-1 font-body text-[10px] uppercase tracking-[0.2em] text-background">
                        Tocca per cambiare
                      </span>
                    </button>
                  </div>
                ) : (
                  <div className="flex w-full max-w-sm flex-col gap-3">
                    <button
                      type="button"
                      onClick={() => setCameraOpen(true)}
                      className="border border-primary bg-primary px-6 py-4 font-body text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground transition hover:bg-primary/90"
                    >
                      Scatta una foto
                    </button>
                    <button
                      type="button"
                      onClick={() => galleryInputRef.current?.click()}
                      className="border border-border bg-background px-6 py-4 font-body text-xs font-semibold uppercase tracking-[0.2em] text-foreground transition hover:border-primary"
                    >
                      Carica dalla galleria
                    </button>
                  </div>
                )}

                <input
                  ref={galleryInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleSelfie}
                  className="hidden"
                />

                <CameraCapture
                  open={cameraOpen}
                  onClose={() => setCameraOpen(false)}
                  onCapture={(dataUrl) => setData((p) => ({ ...p, selfie: dataUrl }))}
                />

                <div className="flex flex-col items-center gap-3 pt-2">
                  <PrimaryButton onClick={nextStep} disabled={!data.selfie}>
                    Vai avanti <ChevronRight className="ml-1 inline h-4 w-4" />
                  </PrimaryButton>
                  {!data.selfie && (
                    <p className="font-body text-[11px] text-muted-foreground/70">
                      La foto è necessaria per un'analisi accurata della tua pelle
                    </p>
                  )}
                </div>
              </div>
            </MinimalCard>
          </motion.div>
        );

      // 2 — AGE
      case 2:
        return (
          <motion.div key="age" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.5 }}>
            <MinimalCard>
              <div className="flex flex-col items-center gap-7 text-center">
                <StepBadge n={3} />
                <div>
                  <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                    {data.name}, quanti anni hai?
                  </h2>
                  <p className="mt-3 font-body text-sm text-muted-foreground">Ogni età ha la sua bellezza, e la sua routine perfetta</p>
                </div>
                <input
                  type="number"
                  inputMode="numeric"
                  min={13}
                  max={99}
                  value={data.age}
                  onChange={(e) => setData({ ...data, age: e.target.value })}
                  placeholder="Età"
                  className="w-36 border border-border bg-background px-6 py-4 text-center font-display text-3xl font-bold text-foreground placeholder:text-base placeholder:font-normal placeholder:text-muted-foreground/30 focus:border-primary focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && data.age && nextStep()}
                />
                <PrimaryButton onClick={nextStep} disabled={!data.age}>Continua</PrimaryButton>
              </div>
            </MinimalCard>
          </motion.div>
        );

      // 3 — TIME (no auto-advance)
      case 3:
        return (
          <motion.div key="time" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.5 }}>
            <MinimalCard>
              <div className="flex flex-col items-center gap-7 text-center">
                <StepBadge n={4} />
                <div>
                  <h2 className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                    Sappiamo che hai mille impegni, {data.name}
                  </h2>
                  <p className="mt-3 font-body text-sm text-muted-foreground">Quanto tempo hai ogni giorno per la tua beauty routine?</p>
                </div>
                <div className="grid w-full max-w-sm grid-cols-2 gap-3">
                  {timeOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setData({ ...data, time: opt })}
                      className={`border px-5 py-4 font-body text-sm font-medium transition ${
                        data.time === opt
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-foreground hover:border-primary/40"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <PrimaryButton onClick={nextStep} disabled={!data.time}>Continua</PrimaryButton>
              </div>
            </MinimalCard>
          </motion.div>
        );

      // 4 — SKIN GOALS (NEW)
      case 4:
        return (
          <motion.div key="goals" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.5 }}>
            <MinimalCard>
              <div className="flex flex-col items-center gap-7 text-center">
                <StepBadge n={5} />
                <div>
                  <h2 className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                    Come vorresti vedere la tua pelle?
                  </h2>
                  <p className="mt-3 font-body text-sm text-muted-foreground">Seleziona uno o più obiettivi (puoi sceglierne anche più di uno)</p>
                </div>
                <div className="grid w-full max-w-sm grid-cols-2 gap-3">
                  {skinGoalsOptions.map((opt) => {
                    const active = data.skinGoals.includes(opt);
                    return (
                      <button
                        key={opt}
                        onClick={() => toggleArray("skinGoals", opt)}
                        className={`border px-4 py-4 font-body text-sm font-medium transition ${
                          active
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-foreground hover:border-primary/40"
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
                <PrimaryButton onClick={nextStep} disabled={data.skinGoals.length === 0}>Continua</PrimaryButton>
              </div>
            </MinimalCard>
          </motion.div>
        );

      // 5 — CURRENT PRODUCTS (NEW)
      case 5:
        return (
          <motion.div key="current" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.5 }}>
            <MinimalCard>
              <div className="flex flex-col items-center gap-6 text-center">
                <StepBadge n={6} />
                <div>
                  <h2 className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                    Cosa usi di solito?
                  </h2>
                  <p className="mt-3 font-body text-sm text-muted-foreground">Indica i prodotti che fanno già parte della tua routine</p>
                </div>

                <button
                  onClick={setAllProducts}
                  className="border border-foreground bg-background px-5 py-2.5 font-body text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground transition hover:bg-foreground hover:text-background"
                >
                  {data.currentProducts.length === productOptions.length
                    ? "Deseleziona tutto"
                    : "Beauty routine completa"}
                </button>

                <div className="grid w-full max-w-md grid-cols-2 gap-2">
                  {productOptions.map((opt) => {
                    const active = data.currentProducts.includes(opt);
                    return (
                      <label
                        key={opt}
                        className={`flex cursor-pointer items-center gap-2.5 border px-3.5 py-3 font-body text-[13px] transition ${
                          active
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-foreground hover:border-primary/40"
                        }`}
                      >
                        <span
                          className={`flex h-4 w-4 flex-shrink-0 items-center justify-center border ${
                            active ? "border-primary-foreground bg-primary-foreground" : "border-border bg-background"
                          }`}
                        >
                          {active && <span className="h-2 w-2 bg-primary" />}
                        </span>
                        <span className="text-left">{opt}</span>
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={active}
                          onChange={() => toggleArray("currentProducts", opt)}
                        />
                      </label>
                    );
                  })}
                </div>
                <PrimaryButton onClick={nextStep}>Continua</PrimaryButton>
              </div>
            </MinimalCard>
          </motion.div>
        );

      // 6 — BUDGET (NEW)
      case 6:
        return (
          <motion.div key="budget" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.5 }}>
            <MinimalCard>
              <div className="flex flex-col items-center gap-7 text-center">
                <StepBadge n={7} />
                <div>
                  <h2 className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                    Qual è il tuo budget?
                  </h2>
                  <p className="mt-3 font-body text-sm text-muted-foreground">Adattiamo la routine alle tue esigenze economiche</p>
                </div>
                <div className="flex w-full max-w-sm flex-col gap-3">
                  {budgetOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setData({ ...data, budget: opt })}
                      className={`border px-5 py-4 font-body text-sm font-medium transition ${
                        data.budget === opt
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-foreground hover:border-primary/40"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <PrimaryButton onClick={nextStep} disabled={!data.budget}>Continua</PrimaryButton>
              </div>
            </MinimalCard>
          </motion.div>
        );

      // 7 — SKIN DESCRIPTION (con analisi AI del selfie)
      case 7: {
        const showTextarea = !data.selfie || isEditingDescription || (selfieAnalysisDone && !data.skinDescription.trim());
        return (
          <motion.div key="skin" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.5 }}>
            <MinimalCard>
              <div className="flex flex-col items-center gap-6 text-center">
                <StepBadge n={8} />
                <div>
                  <h2 className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                    Raccontaci di più, {data.name}
                  </h2>
                  <p className="mt-3 max-w-sm font-body text-sm text-muted-foreground">
                    {data.selfie
                      ? "Abbiamo fatto una prima analisi AI del tuo selfie. Puoi modificarla per aggiungere ciò che senti."
                      : "Com'è la tua pelle? Hai particolari esigenze? Che effetto vorresti ottenere?"}
                  </p>
                </div>

                {/* Stato 1: AI sta analizzando */}
                {data.selfie && isAnalyzingSelfie && (
                  <div className="flex w-full max-w-md flex-col items-center gap-3 border border-border bg-[hsl(var(--cream))] px-5 py-8">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <p className="font-body text-sm text-foreground">L'AI sta analizzando il tuo selfie…</p>
                    <p className="font-body text-[11px] text-muted-foreground">Pochi secondi</p>
                  </div>
                )}

                {/* Stato 2: AI ha finito — mostra analisi in card con possibilità di modifica */}
                {data.selfie && !isAnalyzingSelfie && !showTextarea && data.skinDescription.trim() && (
                  <div className="w-full max-w-md">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 bg-foreground px-2.5 py-1 font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-background">
                        <Sparkles className="h-3 w-3" /> Analisi AI
                      </span>
                      <button
                        onClick={() => setIsEditingDescription(true)}
                        className="inline-flex items-center gap-1.5 font-body text-[11px] font-medium uppercase tracking-wider text-muted-foreground transition hover:text-foreground"
                      >
                        <Pencil className="h-3 w-3" />
                        Modifica
                      </button>
                    </div>
                    <div className="border border-border bg-[hsl(var(--cream))] px-5 py-4 text-left">
                      <p className="font-body text-sm leading-relaxed text-foreground">{data.skinDescription}</p>
                    </div>
                    <p className="mt-2 text-left font-body text-[11px] text-muted-foreground">
                      Questa è una prima impressione automatica. Se vuoi, modificala per aggiungere dettagli.
                    </p>
                  </div>
                )}

                {/* Stato 3: textarea (selfie assente, oppure utente in modifica) */}
                {showTextarea && (
                  <div className="relative w-full max-w-md">
                    <textarea
                      value={data.skinDescription}
                      onChange={(e) => setData({ ...data, skinDescription: e.target.value })}
                      placeholder="Es: Ho la pelle mista, con qualche imperfezione sulla zona T. Vorrei un effetto glow naturale..."
                      className="h-32 w-full resize-none border border-border bg-background px-5 py-4 pr-12 font-body text-sm text-foreground placeholder:text-muted-foreground/35 focus:border-primary focus:outline-none"
                      autoFocus
                    />
                    {data.skinDescription.trim().length > 10 && (
                      <button
                        onClick={enhanceWithAI}
                        disabled={isEnhancing}
                        className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-primary px-3 py-1.5 font-body text-[10px] font-semibold uppercase tracking-wider text-primary-foreground transition disabled:opacity-50"
                        title="Migliora il testo con l'AI"
                      >
                        {isEnhancing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                        {isEnhancing ? "..." : "Migliora con AI"}
                      </button>
                    )}
                    {data.selfie && isEditingDescription && (
                      <button
                        onClick={() => setIsEditingDescription(false)}
                        className="mt-2 font-body text-[11px] uppercase tracking-wider text-muted-foreground transition hover:text-foreground"
                      >
                        Annulla modifica
                      </button>
                    )}
                  </div>
                )}

                <PrimaryButton onClick={nextStep} disabled={!data.skinDescription || isAnalyzingSelfie}>
                  Scopri la tua routine
                </PrimaryButton>
              </div>
            </MinimalCard>
          </motion.div>
        );
      }


      default:
        return null;
    }
  };

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[hsl(var(--cream))] px-4 py-8">
      {/* Logo */}
      <div className="absolute top-6 left-6 z-50">
        <BrandLogo size="md" />
      </div>

      {/* Progress bar */}
      <div className="fixed left-0 right-0 top-0 z-50 h-0.5 bg-muted/50">
        <motion.div className="h-full bg-primary" animate={{ width: `${progress}%` }} transition={{ duration: 0.5, ease: "easeOut" }} />
      </div>

      {/* Back button */}
      {step > 0 && (
        <button
          onClick={prevStep}
          className="fixed left-4 bottom-6 z-50 flex items-center gap-1.5 border border-border bg-background px-3.5 py-2 font-body text-xs text-muted-foreground shadow-elegant transition hover:text-foreground"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Indietro
        </button>
      )}

      <div className="relative w-full max-w-lg">
        <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
      </div>

      {/* Step indicator */}
      <div className="mt-10 flex items-center gap-2">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <button
            key={i}
            onClick={() => i < step && setStep(i)}
            disabled={i > step}
            className={`h-1 transition-all ${i === step ? "w-8 bg-primary" : i < step ? "w-2 bg-primary/40" : "w-2 bg-muted"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BeautyQuiz;
