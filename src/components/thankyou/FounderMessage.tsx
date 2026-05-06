import { motion } from "framer-motion";
import founderSignatureImg from "@/assets/founder-signature.png";
import valentinaSmile from "@/assets/valentina-smile.jpg";

interface FounderMessageProps {
  name: string;
}

const FounderMessage = ({ name }: FounderMessageProps) => (
  <section className="bg-background">
    <div className="mx-auto max-w-4xl px-4 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden rounded-3xl border border-primary/10 bg-card shadow-elevated"
      >
        {/* Decorative corner accent */}
        <div
          className="absolute right-0 top-0 h-32 w-32 opacity-10"
          style={{ background: "radial-gradient(circle at 100% 0%, hsl(38 55% 55%), transparent 70%)" }}
        />

        <div className="grid gap-0 md:grid-cols-[260px_1fr]">
          <div className="relative h-64 md:h-auto">
            <img
              src={valentinaSmile}
              alt="Valentina Tecchio, Founder Maison 22 Esthétique"
              className="h-full w-full object-cover grayscale"
              loading="lazy"
            />
          </div>
        <div className="relative z-10 p-8 md:p-12 lg:p-16">
          {/* Quote mark */}
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 0.08, scale: 1 }}
            viewport={{ once: true }}
            className="pointer-events-none absolute left-6 top-4 font-display text-[120px] font-bold leading-none text-foreground md:left-10 md:top-6 md:text-[160px]"
          >
            &ldquo;
          </motion.span>

          <div className="relative">
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 font-body text-[10px] font-semibold uppercase tracking-widest text-primary">
              Un messaggio dalla Founder
            </span>

            <p className="mt-6 font-display text-lg leading-relaxed text-foreground/90 md:text-xl lg:text-2xl">
              Cara {name}, grazie di cuore per aver scelto di prenderti cura della tua pelle con noi.
            </p>
            <p className="mt-4 font-body text-sm leading-relaxed text-muted-foreground md:text-base">
              Ogni prodotto che hai ricevuto è stato pensato con amore e scienza.
              La bellezza autentica nasce dalla cura quotidiana, e io sono onorata
              di accompagnarti in questo viaggio. Il tuo regalo è un piccolo gesto
              per ringraziarti della fiducia — e per aver condiviso questa esperienza
              con le tue amiche.
            </p>
            <p className="mt-4 font-body text-sm leading-relaxed text-muted-foreground md:text-base">
              Ricorda: la tua pelle è unica, e merita il meglio.
              Non vedo l&apos;ora di vedere i tuoi risultati.
            </p>

            {/* Signature */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-8"
            >
              <img
                src={founderSignatureImg}
                alt="Firma Valentina Tecchio"
                className="h-16 w-auto object-contain md:h-20"
              />
              <div className="mt-2">
                <p className="font-display text-base font-semibold text-foreground">Valentina Tecchio</p>
                <p className="font-body text-xs text-muted-foreground">Founder &amp; CEO — Luxury Perfumes</p>
              </div>
            </motion.div>
          </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default FounderMessage;
