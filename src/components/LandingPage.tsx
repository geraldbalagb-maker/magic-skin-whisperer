import { motion } from "framer-motion";
import { ArrowRight, Star, Camera, Clock, Zap, ShieldCheck, Truck, CreditCard, Wand2 } from "lucide-react";
import heroImage from "@/assets/hero-beauty.jpg";
import { products } from "@/data/products";

// Curated featured products
import routineCleansingImg from "@/assets/steps/routine-cleansing.jpg";
import routineExfoliationImg from "@/assets/steps/routine-exfoliation.jpg";
import routineMoisturizerImg from "@/assets/steps/routine-moisturizer.jpg";

interface LandingPageProps {
  onStartQuiz: () => void;
}

const featuredProducts = products.slice(0, 8);

const categories = [
  { name: "Detersione", description: "Detergenti delicati per ogni tipo di pelle", image: routineCleansingImg },
  { name: "Esfoliazione", description: "Scrub e peeling per una pelle luminosa", image: routineExfoliationImg },
  { name: "Idratazione", description: "Creme e sieri per un'idratazione profonda", image: routineMoisturizerImg },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0, 0, 0.2, 1] as const },
  }),
};

const LandingPage = ({ onStartQuiz }: LandingPageProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* ─── Hero ─── */}
      <section className="relative flex min-h-[100dvh] flex-col items-end justify-end overflow-hidden pb-24">
        {/* Background image — more visible */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Beauty"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/60 to-transparent" />
        </div>

        

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-start gap-8 px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <span className="font-body text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Luxury Perfumes
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="font-display text-4xl font-bold leading-[1.1] text-foreground md:text-5xl lg:text-6xl"
            >
              La beauty routine
              <br />
              adatta a te in{" "}
              <span className="sparkle-text">1 minuto</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-5 max-w-md font-body text-sm leading-relaxed text-muted-foreground md:text-base"
            >
              Rispondi a poche domande e scopri i prodotti perfetti per la tua pelle, selezionati dall'intelligenza artificiale.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <button
                onClick={onStartQuiz}
                className="group flex items-center justify-center gap-2 rounded-sm bg-gradient-cta px-8 py-4 font-body text-xs font-semibold uppercase tracking-widest text-cta-foreground shadow-cta transition-all hover:opacity-90"
              >
                Scopri la tua routine
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <span className="font-body text-xs text-muted-foreground">
                ⏱ 60 secondi • 100% personalizzato
              </span>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
          >
            <span className="font-body text-[10px] uppercase tracking-widest text-muted-foreground/60">Scopri</span>
            <div className="h-8 w-px bg-gradient-to-b from-muted-foreground/30 to-transparent" />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── How it works ─── */}
      <section className="border-t border-border bg-background px-6 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="mb-14 text-center"
          >
            <span className="font-body text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
              Come funziona
            </span>
            <h2 className="mt-3 font-display text-2xl font-bold text-foreground md:text-4xl">
              La tua skincare, come per magia
            </h2>
            <div className="mx-auto mt-4 h-px w-16 bg-gradient-gold" />
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              { icon: Camera, title: "Scatta un selfie", desc: "L'AI analizza il tuo tipo di pelle, le tue esigenze e le aree da migliorare." },
              { icon: Clock, title: "Rispondi in 60 secondi", desc: "Poche domande rapide su età, tempo a disposizione e preferenze di skincare." },
              { icon: Zap, title: "Ricevi la tua routine", desc: "Un protocollo personalizzato con prodotti professionali selezionati per te dall'AI." },
            ].map((step, i) => (
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

      {/* ─── Categories ─── */}
      <section className="border-t border-border bg-gradient-cream px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="mb-14 text-center"
          >
            <span className="font-body text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
              I nostri trattamenti
            </span>
            <h2 className="mt-3 font-display text-2xl font-bold text-foreground md:text-4xl">
              Scopri per categoria
            </h2>
            <div className="mx-auto mt-4 h-px w-16 bg-gradient-gold" />
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i + 1}
                whileHover={{ y: -4 }}
                className="group cursor-pointer overflow-hidden rounded-sm border border-border bg-card transition-shadow hover:shadow-elevated"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
                  <h3 className="absolute bottom-4 left-5 font-display text-xl font-bold text-background">
                    {cat.name}
                  </h3>
                </div>
                <div className="p-5">
                  <p className="font-body text-sm text-muted-foreground">{cat.description}</p>
                  <button
                    onClick={onStartQuiz}
                    className="mt-3 flex items-center gap-1 font-body text-xs font-semibold uppercase tracking-wider text-foreground transition-colors hover:text-cta"
                  >
                    Scopri i prodotti
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Products ─── */}
      <section className="border-t border-border bg-background px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="mb-14 flex flex-col items-center justify-between gap-4 md:flex-row"
          >
            <div>
              <span className="font-body text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
                Best seller
              </span>
              <h2 className="mt-2 font-display text-2xl font-bold text-foreground md:text-4xl">
                I più amati
              </h2>
            </div>
            <button
              onClick={onStartQuiz}
              className="flex items-center gap-2 rounded-sm border border-foreground/20 px-6 py-2.5 font-body text-xs font-semibold uppercase tracking-wider text-foreground transition-all hover:border-foreground hover:bg-foreground hover:text-background"
            >
              Vedi tutti
              <ArrowRight className="h-3 w-3" />
            </button>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            {featuredProducts.map((product, i) => (
              <motion.a
                key={product.id}
                href={product.link}
                target="_blank"
                rel="noopener noreferrer"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i * 0.5}
                whileHover={{ y: -4 }}
                className="group block"
              >
                <div className="relative aspect-square overflow-hidden rounded-sm border border-border bg-secondary/30 p-4 transition-all group-hover:border-foreground/20 group-hover:shadow-elegant">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="mt-3 px-1">
                  <p className="font-body text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                    {product.brand}
                  </p>
                  <p className="mt-0.5 truncate font-body text-sm font-medium text-foreground">
                    {product.name}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: product.rating }).map((_, j) => (
                        <Star key={j} className="h-2.5 w-2.5 fill-primary text-primary" />
                      ))}
                    </div>
                    <span className="font-display text-sm font-bold text-foreground">
                      {product.price.toFixed(2)}€
                    </span>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
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

      {/* ─── Trust Bar ─── */}
      <section className="border-t border-border bg-background px-6 py-12">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-8 md:gap-16">
          {[
            { icon: Truck, label: "Spedizione gratuita" },
            { icon: ShieldCheck, label: "Prodotti certificati" },
            { icon: CreditCard, label: "Pagamenti sicuri" },
            { icon: Wand2, label: "Routine AI personalizzata" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2.5">
              <item.icon className="h-5 w-5 text-primary" />
              <span className="font-body text-xs font-medium text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border bg-secondary/30 px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <span className="font-display text-sm font-semibold text-foreground">Luxury Perfumes</span>
          </div>
          <p className="font-body text-[11px] text-muted-foreground">
            © 2026 Luxury Perfumes. Tutti i diritti riservati.
          </p>
          <div className="flex gap-4">
            <a href="https://www.luxury-perfumes.net" target="_blank" rel="noopener noreferrer" className="font-body text-xs text-muted-foreground transition-colors hover:text-foreground">
              Shop
            </a>
            <a href="#" className="font-body text-xs text-muted-foreground transition-colors hover:text-foreground">
              Privacy
            </a>
            <a href="#" className="font-body text-xs text-muted-foreground transition-colors hover:text-foreground">
              Contatti
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
