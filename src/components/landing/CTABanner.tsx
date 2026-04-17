import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import ctaBg from "@/assets/cta-banner-bg.jpg";

interface CTABannerProps {
  onStartQuiz: () => void;
}

const CTABanner = ({ onStartQuiz }: CTABannerProps) => (
  <section className="relative overflow-hidden bg-[hsl(var(--charcoal))]">
    {/* Background image with cinematic overlay */}
    <div className="absolute inset-0">
      <img
        src={ctaBg}
        alt=""
        loading="lazy"
        width={1920}
        height={1080}
        className="h-full w-full object-cover object-right opacity-90"
      />
      {/* Left-to-right gradient for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--charcoal))] via-[hsl(var(--charcoal))]/85 to-transparent md:via-[hsl(var(--charcoal))]/70" />
      {/* Bottom fade */}
      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--charcoal))]/60 via-transparent to-[hsl(var(--charcoal))]/40" />
    </div>

    {/* Decorative gold particles glow */}
    <div className="pointer-events-none absolute inset-0 opacity-40">
      <div className="absolute left-1/4 top-1/3 h-96 w-96 rounded-full bg-primary/10 blur-[120px]" />
      <div className="absolute right-1/3 bottom-1/4 h-72 w-72 rounded-full bg-primary/15 blur-[100px]" />
    </div>

    <div className="relative z-10 mx-auto flex min-h-[90vh] max-w-6xl flex-col items-start justify-center px-6 py-24 md:min-h-[85vh] md:px-12 md:py-32 lg:py-40">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0, 0, 0.2, 1] }}
        className="max-w-2xl"
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mb-8 flex items-center gap-3"
        >
          <span className="h-px w-12 bg-primary" />
          <span className="font-body text-[10px] font-semibold uppercase tracking-[0.4em] text-primary">
            Maison 22 Esthétique
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="font-display text-4xl font-bold leading-[1.05] text-white md:text-5xl lg:text-6xl"
        >
          La bellezza
          <br />
          inizia con il{" "}
          <span className="italic text-gradient-gold">protocollo giusto</span>.
        </motion.h2>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-8 max-w-lg font-body text-base leading-relaxed text-white/70 md:text-lg"
        >
          Un'analisi avanzata della tua pelle per costruire una routine
          esclusiva, calibrata sulle tue esigenze reali.
        </motion.p>

        {/* Divider line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-10 h-px w-24 origin-left bg-gradient-to-r from-primary to-transparent"
        />

        {/* CTA + Meta */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStartQuiz}
            className="group relative inline-flex items-center gap-3 overflow-hidden bg-primary px-10 py-5 font-body text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-gold-lg transition-all hover:shadow-[0_15px_60px_-10px_hsl(40_45%_50%/0.6)]"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
            <Sparkles className="h-4 w-4" strokeWidth={1.5} />
            <span className="relative">Inizia il tuo protocollo</span>
            <ArrowRight className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>

          <div className="flex flex-col gap-1">
            <span className="font-body text-[11px] uppercase tracking-widest text-primary/90">
              Gratuito · 60 secondi
            </span>
            <span className="font-body text-xs text-white/50">
              Nessuna registrazione richiesta
            </span>
          </div>
        </motion.div>

        {/* Trust signals */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-16 flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-white/10 pt-8"
        >
          {[
            { value: "12.000+", label: "Donne soddisfatte" },
            { value: "97%", label: "Risultati visibili" },
            { value: "30", label: "Prodotti esclusivi" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <span className="font-display text-2xl font-bold text-white md:text-3xl">
                {stat.value}
              </span>
              <span className="font-body text-[10px] uppercase tracking-widest text-white/50">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  </section>
);

export default CTABanner;
