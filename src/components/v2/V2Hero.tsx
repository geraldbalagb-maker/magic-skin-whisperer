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
      <div className="flex flex-col justify-center px-6 py-10 md:px-12 md:py-24 lg:px-16">
        {/* Mobile-only logo */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-8 md:hidden"
        >
          <a href="https://www.luxury-perfumes.net/" target="_blank" rel="noopener noreferrer">
            <img src={logoMe} alt="Maison 22 Esthétique" className="h-24 w-auto object-contain" />
          </a>
        </motion.div>

        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="eyebrow"
        >
          La tua routine
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7 }}
          className="h-display mt-4 text-4xl text-foreground md:text-5xl lg:text-6xl"
        >
          Su misura,<br />in 1 minuto
        </motion.h1>

        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex max-w-md flex-col gap-3 font-body text-sm text-muted-foreground md:text-base"
        >
          <li className="flex items-start gap-3">
            <span aria-hidden className="mt-2 h-px w-4 shrink-0 bg-foreground" />
            Rispondi a poche domande sulla tua pelle
          </li>
          <li className="flex items-start gap-3">
            <span aria-hidden className="mt-2 h-px w-4 shrink-0 bg-foreground" />
            L'AI seleziona i prodotti ideali per te
          </li>
          <li className="flex items-start gap-3">
            <span aria-hidden className="mt-2 h-px w-4 shrink-0 bg-foreground" />
            Ricevi la tua routine personalizzata
          </li>
        </motion.ul>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
        >
          <button onClick={onStartQuiz} className="btn-primary-black group">
            Scopri la tua routine
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
          <span className="font-body text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            60 secondi · 100% personalizzato
          </span>
        </motion.div>
      </div>

      {/* Right column — image */}
      <div className="relative min-h-[360px] md:min-h-[560px]">
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
