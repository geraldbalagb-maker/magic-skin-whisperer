import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Clock, ChevronRight, SkipForward } from "lucide-react";
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

const BeautyQuiz = ({ onComplete }: BeautyQuizProps) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<QuizData>({
    name: "",
    selfie: null,
    age: "",
    time: "",
    skinDescription: "",
  });

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

  const timeOptions = [
    { label: "5 minuti", emoji: "⚡" },
    { label: "10 minuti", emoji: "☕" },
    { label: "20 minuti", emoji: "🧖‍♀️" },
    { label: "30+ minuti", emoji: "👑" },
  ];

  const ageOptions = ["18-25", "26-35", "36-45", "46-55", "55+"];

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
              className="w-full max-w-xs rounded-xl border border-gold/30 bg-card px-6 py-4 text-center font-display text-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && data.name && nextStep()}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextStep}
              disabled={!data.name}
              className="bg-gradient-gold rounded-full px-8 py-3 font-body text-sm font-medium text-primary-foreground shadow-gold transition-all disabled:opacity-40"
            >
              Continua <ChevronRight className="ml-1 inline h-4 w-4" />
            </motion.button>
          </motion.div>
        );

      case 1:
        return (
          <motion.div key="selfie" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.5 }} className="flex flex-col items-center gap-6 text-center">
            <Camera className="mx-auto h-8 w-8 text-gold" />
            <h2 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
              {data.name}, fatti un selfie! 📸
            </h2>
            <p className="max-w-sm font-body text-sm text-muted-foreground">
              Ci serve una foto per capire com'è fatta la tua pelle e poterti consigliare al meglio. Tranquilla, rimarrà tra noi 🤫
            </p>
            <label className="group cursor-pointer">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-gold/30 bg-card p-8 transition-colors group-hover:border-gold/60"
              >
                {data.selfie ? (
                  <img src={data.selfie} alt="Selfie" className="h-32 w-32 rounded-full object-cover shadow-gold" />
                ) : (
                  <>
                    <div className="rounded-full bg-gradient-gold p-4">
                      <Camera className="h-6 w-6 text-primary-foreground" />
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
            <div className="flex flex-wrap justify-center gap-3">
              {ageOptions.map((age) => (
                <motion.button
                  key={age}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setData({ ...data, age });
                    setTimeout(() => setStep(3), 400);
                  }}
                  className={`rounded-full border px-6 py-3 font-body text-sm transition-all ${
                    data.age === age
                      ? "border-gold bg-gradient-gold text-primary-foreground shadow-gold"
                      : "border-gold/20 bg-card text-foreground hover:border-gold/50"
                  }`}
                >
                  {age}
                </motion.button>
              ))}
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div key="time" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.5 }} className="flex flex-col items-center gap-6 text-center">
            <Clock className="mx-auto h-8 w-8 text-gold" />
            <h2 className="font-display text-2xl font-semibold text-foreground md:text-3xl">
              Sappiamo che hai mille impegni, {data.name}
            </h2>
            <p className="font-body text-sm text-muted-foreground">
              Quanto tempo hai ogni giorno per la tua beauty routine?
            </p>
            <div className="grid grid-cols-2 gap-3">
              {timeOptions.map((opt) => (
                <motion.button
                  key={opt.label}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setData({ ...data, time: opt.label });
                    setTimeout(() => setStep(4), 400);
                  }}
                  className={`flex items-center gap-2 rounded-xl border px-5 py-4 font-body text-sm transition-all ${
                    data.time === opt.label
                      ? "border-gold bg-gradient-gold text-primary-foreground shadow-gold"
                      : "border-gold/20 bg-card text-foreground hover:border-gold/50"
                  }`}
                >
                  <span className="text-lg">{opt.emoji}</span> {opt.label}
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
            <textarea
              value={data.skinDescription}
              onChange={(e) => setData({ ...data, skinDescription: e.target.value })}
              placeholder="Es: Ho la pelle mista, con qualche imperfezione sulla zona T. Vorrei un effetto glow naturale..."
              className="h-32 w-full max-w-md resize-none rounded-xl border border-gold/30 bg-card px-5 py-4 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-gold/50"
              autoFocus
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextStep}
              disabled={!data.skinDescription}
              className="bg-gradient-gold rounded-full px-8 py-3 font-body text-sm font-medium text-primary-foreground shadow-gold transition-all disabled:opacity-40"
            >
              Scopri la tua routine ✨
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

      {/* Chat-style container */}
      <div className="relative w-full max-w-lg">
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </div>

      {/* Step indicator */}
      <div className="mt-8 flex gap-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === step ? "w-8 bg-gradient-gold" : i < step ? "w-2 bg-gold/50" : "w-2 bg-muted"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default BeautyQuiz;
