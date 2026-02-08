import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0, 0, 0.2, 1] as const },
  }),
};

interface CTABannerProps {
  onStartQuiz: () => void;
}

const CTABanner = ({ onStartQuiz }: CTABannerProps) => (
  <section className="relative overflow-hidden border-t border-border">
    <div className="bg-gradient-dark px-6 py-20 md:py-28">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        custom={0}
        className="relative z-10 mx-auto max-w-2xl text-center"
      >
        <h2 className="font-display text-3xl font-bold text-background md:text-4xl">
          Pronta a scoprire la tua{" "}
          <span className="text-gradient-gold">routine perfetta</span>?
        </h2>
        <p className="mx-auto mt-4 max-w-md font-body text-sm leading-relaxed text-background/60">
          L'intelligenza artificiale analizza il tuo tipo di pelle e crea un protocollo su misura in soli 60 secondi.
        </p>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={onStartQuiz}
          className="mt-8 inline-flex items-center gap-2 rounded-sm bg-gradient-cta px-10 py-4 font-body text-xs font-semibold uppercase tracking-widest text-cta-foreground shadow-cta"
        >
          Inizia il quiz
          <ArrowRight className="h-4 w-4" />
        </motion.button>
      </motion.div>
    </div>
  </section>
);

export default CTABanner;
