import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-beauty.jpg";

interface V2HeroProps {
  onStartQuiz: () => void;
}

const V2Hero = ({ onStartQuiz }: V2HeroProps) => (
  <section className="relative overflow-hidden">
    {/* Hero image */}
    <div className="relative h-[50vh] min-h-[360px] w-full md:h-[55vh]">
      <img
        src={heroImage}
        alt="Scopri la tua beauty routine personalizzata"
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

      {/* Overlay content */}
      <div className="absolute inset-x-0 bottom-0 px-6 pb-8 md:pb-12">
        <div className="mx-auto max-w-7xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="font-display text-2xl font-bold leading-tight text-foreground md:text-4xl"
          >
            La tua routine su misura,
            <br />
            <span className="text-primary">in 1 minuto</span>
          </motion.h1>
        </div>
      </div>
    </div>

    {/* Content below image */}
    <div className="bg-background px-6 py-10 md:py-14">
      <div className="mx-auto max-w-7xl">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-lg font-body text-sm leading-relaxed text-muted-foreground md:text-base"
        >
          Rispondi a poche domande e scopri i prodotti perfetti per la tua pelle,
          selezionati dall'intelligenza artificiale. Un'esperienza pensata per te,
          con la cura e l'attenzione che meriti.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center"
        >
          <button
            onClick={onStartQuiz}
            className="group flex items-center justify-center gap-2 bg-[hsl(34_55%_54%)] px-8 py-3.5 font-body text-xs font-semibold uppercase tracking-widest text-white transition-all hover:bg-[hsl(34_55%_42%)]"
          >
            Scopri la tua routine
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
          <span className="font-body text-xs text-muted-foreground">
            ⏱ 60 secondi • 100% personalizzato
          </span>
        </motion.div>
      </div>
    </div>
  </section>
);

export default V2Hero;
