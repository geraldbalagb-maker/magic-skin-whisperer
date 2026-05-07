import { motion } from "framer-motion";
import { Gift, Truck, Shield, Package } from "lucide-react";
import Confetti from "./Confetti";
import GiftProductShowcase from "./GiftProductShowcase";
import FounderMessage from "./FounderMessage";

interface CelebrationScreenProps {
  name: string;
  showConfetti: boolean;
}

const CelebrationScreen = ({ name, showConfetti }: CelebrationScreenProps) => (
  <div className="relative min-h-screen overflow-hidden bg-background">
    {showConfetti && <Confetti />}

    {/* ─── Hero celebration ─── */}
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative overflow-hidden bg-gradient-dark"
    >
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, hsl(38 55% 55% / 0.3), transparent 70%)" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-20 text-center md:py-28">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-gold shadow-gold-lg"
        >
          <Gift className="h-9 w-9 text-primary-foreground" strokeWidth={1.5} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="font-display text-4xl font-bold leading-tight text-primary-foreground md:text-6xl"
        >
          Fantastico,{" "}
          <span className="sparkle-text">{name}</span>!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mx-auto mt-4 max-w-lg font-body text-base text-primary-foreground/70 md:text-lg"
        >
          Le tue amiche riceveranno l'invito per scoprire la loro beauty routine personalizzata
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mx-auto mt-8 flex max-w-xs flex-col gap-3"
        >
          {["Inviti inviati con successo", "Regalo sbloccato", "Aggiunto al tuo ordine"].map((text, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + i * 0.15 }}
              className="flex items-center gap-3"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.9 + i * 0.15, type: "spring" }}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-foreground/15 ring-1 ring-primary-foreground/30"
              >
                <span className="text-xs font-bold text-primary-foreground">✓</span>
              </motion.div>
              <span className="font-body text-sm text-primary-foreground/60">{text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>

    <GiftProductShowcase />
    <FounderMessage name={name} />

    {/* ─── Trust bar ─── */}
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="border-t border-border bg-gradient-cream"
    >
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-8 px-4 py-10 md:gap-12">
        {[
          { icon: <Truck className="h-5 w-5" />, label: "Spedizione gratuita" },
          { icon: <Shield className="h-5 w-5" />, label: "Pagamento sicuro" },
          { icon: <Package className="h-5 w-5" />, label: "Reso facile 30gg" },
          { icon: <Gift className="h-5 w-5" />, label: "Regalo incluso" },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-2.5 text-muted-foreground"
          >
            <span className="text-primary">{item.icon}</span>
            <span className="font-body text-xs font-medium">{item.label}</span>
          </motion.div>
        ))}
      </div>
    </motion.section>

    {/* ─── Final closing ─── */}
    <section className="bg-gradient-dark py-16 text-center md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto max-w-lg px-4"
      >
        <div className="mx-auto h-0.5 w-12 rounded-full bg-gradient-gold" />
        <h3 className="mt-4 font-display text-xl font-bold text-primary-foreground md:text-2xl">
          La tua beauty routine ti aspetta
        </h3>
        <p className="mt-3 font-body text-sm text-primary-foreground/60">
          Controlla la tua email per il riepilogo dell'ordine e i dettagli di spedizione.
          La trasformazione della tua pelle inizia oggi.
        </p>
        <div className="mx-auto mt-6 h-0.5 w-16 rounded-full bg-gradient-gold opacity-40" />
      </motion.div>
    </section>
  </div>
);

export default CelebrationScreen;
