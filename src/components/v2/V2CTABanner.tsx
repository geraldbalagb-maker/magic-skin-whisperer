import { motion } from "framer-motion";


interface V2CTABannerProps {
  onStartQuiz: () => void;
}

const V2CTABanner = ({ onStartQuiz }: V2CTABannerProps) => (
  <section className="relative overflow-hidden bg-[hsl(var(--charcoal))]">
    {/* Subtle decorative glow */}
    <div className="pointer-events-none absolute inset-0 opacity-40">
      <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-[140px]" />
    </div>

    <div className="relative z-10 mx-auto flex min-h-[80vh] max-w-3xl flex-col items-center justify-center px-6 py-24 text-center md:py-32 lg:py-40">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0, 0, 0.2, 1] }}
        className="flex flex-col items-center"
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mb-8 flex items-center gap-3"
        >
          <span className="h-px w-12 bg-white/40" />
          <span className="font-body text-[10px] font-semibold uppercase tracking-[0.4em] text-white/80">
            Maison 22 Esthétique
          </span>
          <span className="h-px w-12 bg-white/40" />
        </motion.div>

        {/* Main headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="font-display text-4xl font-bold leading-[1.1] text-white md:text-5xl lg:text-6xl"
        >
          La bellezza inizia con il{" "}
          <span className="italic text-gradient-gold">protocollo giusto</span>.
        </motion.h2>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-8 max-w-xl font-body text-base leading-relaxed text-white/70 md:text-lg"
        >
          Un'analisi avanzata della tua pelle per costruire una routine
          esclusiva, calibrata sulle tue esigenze reali.
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-10 h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent"
        />

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-10 flex flex-col items-center gap-6"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStartQuiz}
            className="group relative inline-flex items-center gap-3 overflow-hidden bg-primary px-10 py-5 font-body text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-gold-lg transition-all hover:shadow-[0_15px_60px_-10px_hsl(40_45%_50%/0.6)]"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
            <span className="relative">Inizia il tuo protocollo</span>
          </motion.button>

          <div className="flex flex-col items-center gap-1">
            <span className="font-body text-[11px] uppercase tracking-widest text-primary/90">
              Gratuito · 60 secondi
            </span>
            <span className="font-body text-xs text-white/50">
              Nessuna registrazione richiesta
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

export default V2CTABanner;
