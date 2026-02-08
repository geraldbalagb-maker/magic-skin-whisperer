import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

interface Review {
  name: string;
  age: string;
  skinType: string;
  text: string;
  rating: number;
  product: string;
  verified: boolean;
}

const reviews: Review[] = [
  {
    name: "Giulia M.",
    age: "34 anni",
    skinType: "Pelle mista",
    text: "Dopo 28 giorni la mia pelle è completamente trasformata. Le macchie si sono schiarite e la texture è molto più uniforme. Il beauty coach AI ha azzeccato ogni singolo prodotto!",
    rating: 5,
    product: "Kit Completo Personalizzato",
    verified: true,
  },
  {
    name: "Francesca L.",
    age: "42 anni",
    skinType: "Pelle secca",
    text: "Non credevo che un'analisi AI potesse essere così precisa. I prodotti Rigenera Xaikonix sono fantastici, la crema notte con retinolo ha fatto miracoli per le mie rughe.",
    rating: 5,
    product: "Retynol.me + Hydra.me",
    verified: true,
  },
  {
    name: "Sara B.",
    age: "28 anni",
    skinType: "Pelle grassa",
    text: "Finalmente una routine che tiene sotto controllo il sebo senza seccare la pelle. La Flawless Mousse e l'Acn-End sono diventati i miei prodotti irrinunciabili.",
    rating: 5,
    product: "Linea SeboKey",
    verified: true,
  },
  {
    name: "Elena R.",
    age: "51 anni",
    skinType: "Pelle matura",
    text: "Lo sconto del 20% sul bundle mi ha convinta a provare. Sono al secondo ordine e le amiche non smettono di chiedermi cosa uso. L'Esosomi Serum è un prodotto straordinario.",
    rating: 5,
    product: "Esosomi Serum + Bundle",
    verified: true,
  },
];

const stats = [
  { value: "98%", label: "Clienti soddisfatte" },
  { value: "4.9/5", label: "Valutazione media" },
  { value: "28gg", label: "Risultati visibili" },
  { value: "15K+", label: "Routine create" },
];

const ReviewsSection = () => {
  return (
    <section className="border-t border-border bg-card/50">
      <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="font-body text-[11px] font-medium uppercase tracking-[0.25em] text-primary">
            Testimonianze verificate
          </span>
          <h2 className="mt-3 font-display text-2xl font-bold text-foreground md:text-3xl lg:text-4xl">
            Chi ha provato, non torna indietro.
          </h2>
          <p className="mx-auto mt-3 max-w-md font-body text-sm text-muted-foreground">
            Migliaia di donne hanno già trasformato la propria skincare con una routine personalizzata dall'intelligenza artificiale.
          </p>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-4 md:grid-cols-4"
        >
          {stats.map((stat, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-5 text-center">
              <p className="font-display text-2xl font-bold text-gradient-gold">{stat.value}</p>
              <p className="mt-1 font-body text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Reviews grid */}
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {reviews.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/15 hover:shadow-sm"
            >
              {/* Stars */}
              <div className="flex items-center gap-1">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>

              {/* Quote */}
              <p className="mt-4 font-body text-sm leading-relaxed text-foreground/90 italic">
                "{review.text}"
              </p>

              {/* Author */}
              <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-display text-sm font-semibold text-foreground">{review.name}</p>
                    {review.verified && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 font-body text-[9px] font-semibold uppercase tracking-wider text-primary">
                        Verificata
                      </span>
                    )}
                  </div>
                  <p className="font-body text-[11px] text-muted-foreground">
                    {review.age} · {review.skinType}
                  </p>
                </div>
                <p className="font-body text-[10px] font-medium text-primary">{review.product}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
