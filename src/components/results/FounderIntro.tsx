import { motion } from "framer-motion";
import founderImg from "@/assets/founder-valentina.jpg";

const FounderIntro = () => (
  <section className="bg-background border-t border-border">
    <div className="mx-auto max-w-5xl px-4 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:gap-14"
      >
        <div className="order-1 overflow-hidden border border-border bg-[hsl(var(--cream))]">
          <img
            src={founderImg}
            alt="Valentina Tecchio, founder Maison 22 Esthétique"
            className="aspect-[4/5] w-full object-cover"
            loading="lazy"
          />
        </div>

        <div className="order-2">
          <span className="inline-block border border-border px-3 py-1 font-body text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            La Founder
          </span>
          <h2 className="mt-5 font-display text-3xl font-semibold leading-tight text-foreground md:text-4xl">
            Valentina Tecchio
          </h2>
          <p className="mt-4 font-body text-sm leading-relaxed text-muted-foreground md:text-base">
            Estetista professionista con oltre vent&apos;anni di esperienza nella cura della pelle,
            ho creato Maison 22 Esthétique per portare nella routine quotidiana la stessa precisione
            di un trattamento in cabina. Ogni formula nasce da un&apos;esigenza reale, vista e ascoltata
            sulle mie clienti.
          </p>
          <p className="mt-4 font-body text-sm leading-relaxed text-muted-foreground md:text-base">
            La routine che hai appena ricevuto è costruita con gli stessi prodotti che consiglio
            ogni giorno nel mio studio.
          </p>
        </div>
      </motion.div>
    </div>
  </section>
);

export default FounderIntro;
