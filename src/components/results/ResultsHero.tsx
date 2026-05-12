import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import type { QuizData } from "../BeautyQuiz";
import type { AIRoutineResult } from "../AnalysisScreen";
import BrandLogo from "@/components/shared/BrandLogo";

interface ResultsHeroProps {
  name: string;
  quizData: QuizData;
  aiResult: AIRoutineResult;
}

const ResultsHero = ({ name, quizData, aiResult }: ResultsHeroProps) => (
  <motion.header
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1 }}
    className="relative overflow-hidden bg-gradient-dark"
  >
    {/* Animated background mesh */}
    <div className="pointer-events-none absolute inset-0">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute -top-1/2 -left-1/2 h-[200%] w-[200%] opacity-[0.04]"
        style={{
          background: "conic-gradient(from 0deg, hsl(38 55% 55%), transparent, hsl(40 60% 75%), transparent, hsl(38 55% 55%))",
        }}
      />
    </div>

    <div className="relative z-10 mx-auto max-w-5xl px-4 py-16 md:py-24">
      {/* Logo */}
      <div className="mb-8 flex justify-center">
        <BrandLogo size="lg" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8 flex justify-center"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-5 py-2 font-body text-[11px] font-medium uppercase tracking-[0.3em] text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
          Analisi completata
        </span>
      </motion.div>

      {/* Main heading */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="text-center font-display text-4xl font-bold leading-tight text-primary-foreground md:text-6xl lg:text-7xl"
      >
        Il tuo rituale,
        <br />
        <span className="sparkle-text">{name}</span>
      </motion.h1>

      {/* Skin analysis — editorial quote style */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.7 }}
        className="mx-auto mt-10 max-w-2xl"
      >
        <div className="relative rounded-2xl border border-primary/15 bg-primary/5 px-8 py-6 backdrop-blur-sm md:px-10 md:py-8">
          <div className="absolute -top-3 left-8 flex h-6 items-center gap-1.5 rounded-full bg-gradient-gold px-3">
            <span className="font-body text-[10px] font-semibold uppercase tracking-widest text-primary-foreground">
              Analisi AI
            </span>
          </div>
          <p className="font-body text-base leading-relaxed text-primary-foreground/85 md:text-lg">
            {aiResult.skin_analysis}
          </p>
        </div>
      </motion.div>

      {/* Quiz recap chips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mx-auto mt-8 flex max-w-lg flex-wrap justify-center gap-3"
      >
        {[
          { label: `${quizData.age} anni` },
          { label: quizData.time },
          ...(quizData.skinDescription
            ? [{ label: `"${quizData.skinDescription.slice(0, 40)}…"` }]
            : []),
        ].map((chip, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 + i * 0.1 }}
            className="rounded-full border border-primary/25 bg-primary/10 px-5 py-2.5 font-body text-sm text-primary-foreground/85 backdrop-blur-md md:text-base"
          >
            {chip.label}
          </motion.span>
        ))}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-12 flex justify-center"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex cursor-pointer flex-col items-center gap-2"
          onClick={() => document.getElementById("routine-section")?.scrollIntoView({ behavior: "smooth" })}
        >
          <span className="font-body text-[10px] uppercase tracking-widest text-primary-foreground/40">
            Scopri la tua routine
          </span>
          <ChevronRight className="h-4 w-4 rotate-90 text-primary/50" />
        </motion.div>
      </motion.div>
    </div>
  </motion.header>
);

export default ResultsHero;
