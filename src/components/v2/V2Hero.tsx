import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-beauty-v2.jpg";
import logoMe from "@/assets/logo-me.png";

interface V2HeroProps {
  onStartQuiz: () => void;
}

const V2Hero = ({ onStartQuiz }: V2HeroProps) => (
  <section className="bg-background">
    <div className="mx-auto grid max-w-7xl md:grid-cols-2">
      {/* Left column — text & CTA */}
      <div className="flex flex-col justify-center px-6 py-8 md:px-12 md:py-20 lg:px-16">
        {/* Logo top-right above headline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-8 flex justify-start"
        >
          <img src={logoMe} alt="Maison 22 Esthétique" className="h-36 w-auto object-contain md:h-40 -ml-[5px]" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="font-display text-4xl font-normal leading-[1.05] tracking-tight text-foreground md:text-5xl lg:text-6xl"
        >
          La tua routine su misura, <span className="italic">in 1 minuto</span>
        </motion.h1>

        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 flex max-w-md flex-col gap-2.5 font-body text-sm text-muted-foreground md:text-base"
        >
          <li className="flex items-start gap-2">
            <span className="mt-1.5 inline-block h-1 w-3 bg-foreground" />
            Rispondi a poche domande sulla tua pelle
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 inline-block h-1 w-3 bg-foreground" />
            L'AI seleziona i prodotti ideali per te
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 inline-block h-1 w-3 bg-foreground" />
            Ricevi la tua routine personalizzata
          </li>
        </motion.ul>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center"
        >
          <button
            onClick={onStartQuiz}
            className="group flex items-center justify-center gap-2 bg-[hsl(var(--v2-amber))] px-8 py-3.5 font-body text-xs font-semibold uppercase tracking-widest text-white transition-all hover:bg-[hsl(var(--v2-amber-dark))]"
          >
            Scopri la tua routine
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
          <span className="font-body text-xs text-muted-foreground">
            ⏱ 60 secondi • 100% personalizzato
          </span>
        </motion.div>
      </div>

      {/* Right column — image */}
      <div className="relative min-h-[320px] md:min-h-[480px]">
        <img
          src={heroImage}
          alt="Scopri la tua beauty routine personalizzata"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  </section>
);

export default V2Hero;
