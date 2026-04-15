import { motion } from "framer-motion";
import howStep01 from "@/assets/steps/how-step-01.jpg";
import howStep02 from "@/assets/steps/how-step-02.jpg";
import howStep03 from "@/assets/steps/how-step-03.jpg";

const steps = [
  {
    number: "01",
    title: "Racconta la tua pelle",
    description:
      "Rispondi a poche domande sulle tue abitudini, il tuo tipo di pelle e i risultati che desideri.",
    image: howStep01,
  },
  {
    number: "02",
    title: "L'AI trova il match perfetto",
    description:
      "Il nostro algoritmo analizza le risposte e incrocia i dati con il catalogo per trovare i prodotti ideali.",
    image: howStep02,
  },
  {
    number: "03",
    title: "Ricevi la tua routine",
    description:
      "Una skincare routine completa e personalizzata, pronta da acquistare con un click.",
    image: howStep03,
  },
];

const V2HowItWorks = () => (
  <section className="border-t border-border bg-background px-6 py-20 md:py-28">
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-16 text-center">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-body text-xs font-semibold uppercase tracking-[0.25em] text-primary"
        >
          Come funziona
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-3 font-display text-2xl font-bold text-foreground md:text-3xl"
        >
          Tre semplici passi verso la tua routine ideale
        </motion.h2>
      </div>

      {/* Steps */}
      <div className="flex flex-col gap-10 md:gap-0">
        {steps.map((step, i) => {
          const isEven = i % 2 === 1;
          return (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className={`relative flex flex-col items-center gap-6 md:flex-row md:gap-12 ${
                isEven ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Image card */}
              <div className="w-full shrink-0 overflow-hidden md:w-1/2">
                <img
                  src={step.image}
                  alt={step.title}
                  className="h-52 w-full object-cover md:h-64"
                  loading="lazy"
                  width={800}
                  height={800}
                />
              </div>

              {/* Text */}
              <div className="flex-1 text-center md:text-left">
                <span className="font-display text-3xl font-bold text-primary/20 md:text-4xl">
                  {step.number}
                </span>
                <h3 className="mt-1 font-display text-lg font-bold text-foreground md:text-xl">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-sm font-body text-sm leading-relaxed text-muted-foreground md:text-base">
                  {step.description}
                </p>
              </div>

              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="absolute -bottom-10 left-1/2 hidden h-10 w-px bg-border md:block" />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export default V2HowItWorks;
