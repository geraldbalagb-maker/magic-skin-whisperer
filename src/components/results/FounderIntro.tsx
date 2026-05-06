import { motion } from "framer-motion";
import valentinaPortrait from "@/assets/valentina-portrait.jpg";

const FounderIntro = () => (
  <section className="bg-background border-t border-border">
    <div className="mx-auto max-w-5xl px-4 py-16 md:py-24">
      <div className="grid gap-10 md:grid-cols-2 md:items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="overflow-hidden"
        >
          <img
            src={valentinaPortrait}
            alt="Valentina Tecchio, Founder Maison 22 Esthétique"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
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
        </motion.div>
      </div>
    </div>
  </section>
);

export default FounderIntro;
