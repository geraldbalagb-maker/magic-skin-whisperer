import { motion } from "framer-motion";
import { ClipboardList, Sparkles, ShoppingBag } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "Rispondi al quiz",
    description: "Poche domande sulla tua pelle, le tue abitudini e i tuoi obiettivi.",
  },
  {
    icon: Sparkles,
    title: "Analisi AI",
    description: "La nostra intelligenza artificiale analizza le tue risposte e trova i prodotti ideali.",
  },
  {
    icon: ShoppingBag,
    title: "La tua routine",
    description: "Ricevi una routine personalizzata con i prodotti più adatti a te.",
  },
];

const V2HowItWorks = () => (
  <section className="border-t border-border bg-background px-6 py-16 md:py-20">
    <div className="mx-auto max-w-7xl">
      <div className="mb-12 text-center">
        <h2 className="font-display text-xl font-bold text-foreground md:text-2xl">
          Come funziona
        </h2>
        <div className="mx-auto mt-3 h-px w-12 bg-[hsl(34_55%_54%)]" />
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="group border border-border bg-background p-8 text-center transition-shadow hover:shadow-elevated"
          >
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center border border-border">
              <step.icon className="h-5 w-5 text-[hsl(34_55%_54%)]" />
            </div>
            <h3 className="mb-2 font-display text-sm font-bold uppercase tracking-wider text-foreground">
              {step.title}
            </h3>
            <p className="font-body text-sm leading-relaxed text-muted-foreground">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default V2HowItWorks;
