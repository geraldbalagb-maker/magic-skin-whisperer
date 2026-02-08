import { motion } from "framer-motion";
import { Camera, Clock, Zap } from "lucide-react";
import SectionHeader from "./SectionHeader";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0, 0, 0.2, 1] as const },
  }),
};

const steps = [
  { icon: Camera, title: "Scatta un selfie", desc: "L'AI analizza il tuo tipo di pelle, le tue esigenze e le aree da migliorare." },
  { icon: Clock, title: "Rispondi in 60 secondi", desc: "Poche domande rapide su età, tempo a disposizione e preferenze di skincare." },
  { icon: Zap, title: "Ricevi la tua routine", desc: "Un protocollo personalizzato con prodotti professionali selezionati per te dall'AI." },
];

const HowItWorks = () => (
  <section className="border-t border-border bg-background px-6 py-20 md:py-28">
    <div className="mx-auto max-w-5xl">
      <SectionHeader label="Come funziona" title="La tua skincare, come per magia" className="mb-14" />

      <div className="grid gap-8 md:grid-cols-3">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={i + 1}
            className="group text-center"
          >
            <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary transition-all group-hover:bg-gradient-gold group-hover:shadow-gold">
              <step.icon className="h-6 w-6 text-foreground transition-colors group-hover:text-primary-foreground" />
              <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-foreground font-body text-[10px] font-bold text-background">
                {i + 1}
              </span>
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground">{step.title}</h3>
            <p className="mt-2 font-body text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
