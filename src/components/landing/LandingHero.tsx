import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-beauty.jpg";
import MaisonLogo from "@/components/MaisonLogo";

interface LandingHeroProps {
  onStartQuiz: () => void;
}

const LandingHero = ({ onStartQuiz }: LandingHeroProps) => (
  <section className="relative flex min-h-[100dvh] flex-col items-end justify-end overflow-hidden pb-24">
    {/* Logo top center */}
    <div className="absolute top-6 left-1/2 z-20 -translate-x-1/2">
      <MaisonLogo variant="dark" size="lg" />
    </div>

    <div className="absolute inset-0">
      <img src={heroImage} alt="Beauty" className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/60 to-transparent" />
    </div>

    <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-start gap-8 px-6 md:px-12">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-xl"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
           <span className="font-body text-xs font-semibold uppercase tracking-[0.3em] text-primary">
             Maison 22 Esthétique
           </span>
        </motion.div>

         <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="font-display text-4xl font-bold leading-[1.1] text-foreground md:text-5xl lg:text-6xl"
        >
          La tua beauty routine su misura
          <br />
          in <span className="sparkle-text">1 minuto</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-5 max-w-md font-body text-sm leading-relaxed text-muted-foreground md:text-base"
        >
          Rispondi a poche domande e scopri i prodotti perfetti per la tua pelle, selezionati dall'intelligenza artificiale.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <button
            onClick={onStartQuiz}
            className="group flex items-center justify-center gap-2 rounded-sm bg-gradient-cta px-8 py-4 font-body text-xs font-semibold uppercase tracking-widest text-cta-foreground shadow-cta transition-all hover:opacity-90"
          >
            Scopri la tua routine
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
          <span className="font-body text-xs text-muted-foreground">
            ⏱ 60 secondi • 100% personalizzato
          </span>
        </motion.div>
      </motion.div>
    </div>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5 }}
      className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
    >
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="flex flex-col items-center gap-2"
      >
        <span className="font-body text-[10px] uppercase tracking-widest text-muted-foreground/60">Scopri</span>
        <div className="h-8 w-px bg-gradient-to-b from-muted-foreground/30 to-transparent" />
      </motion.div>
    </motion.div>
  </section>
);

export default LandingHero;
