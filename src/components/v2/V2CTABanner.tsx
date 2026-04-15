import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface V2CTABannerProps {
  onStartQuiz: () => void;
}

const V2CTABanner = ({ onStartQuiz }: V2CTABannerProps) => (
  <section className="border-t border-border bg-[hsl(var(--charcoal))] px-6 py-16 md:py-20">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mx-auto max-w-xl text-center"
    >
      <h2 className="font-display text-xl font-bold text-white md:text-2xl">
        Pronta a scoprire la tua routine?
      </h2>
      <p className="mx-auto mt-4 max-w-md font-body text-sm leading-relaxed text-white/60">
        La tua pelle merita attenzione. Rispondi al quiz e lasciati guidare
        verso i prodotti più adatti a te.
      </p>
      <button
        onClick={onStartQuiz}
        className="group mt-8 inline-flex items-center gap-2 border border-primary bg-transparent px-8 py-3.5 font-body text-xs font-semibold uppercase tracking-widest text-primary transition-all hover:bg-primary hover:text-white"
      >
        Inizia il quiz
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </button>
    </motion.div>
  </section>
);

export default V2CTABanner;
