import { motion } from "framer-motion";
import { Star } from "lucide-react";
import tonerImg from "@/assets/products/toner.jpg";
import SectionHeader from "../landing/SectionHeader";

const GiftProductShowcase = () => (
  <section className="border-b border-border bg-gradient-cream">
    <div className="mx-auto max-w-5xl px-4 py-16 md:py-24">
      <SectionHeader label="Il tuo regalo esclusivo" title="Sbloccato per te" className="mb-12" />

      <div className="flex flex-col items-center gap-12 md:flex-row md:gap-16">
        {/* Product image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative w-full max-w-sm md:w-5/12"
        >
          <div
            className="absolute inset-0 m-auto h-[85%] w-[85%] rounded-full opacity-30 blur-3xl"
            style={{ background: "radial-gradient(circle, hsl(38 55% 55% / 0.5), transparent 70%)" }}
          />
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <div className="overflow-hidden rounded-3xl border border-primary/15 bg-card p-8 shadow-elevated">
              <motion.div
                initial={{ rotate: -12, scale: 0 }}
                whileInView={{ rotate: -12, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, type: "spring" }}
                className="absolute -right-2 -top-2 z-10 rounded-full bg-gradient-gold px-4 py-2 shadow-gold"
              >
                <span className="font-display text-sm font-bold text-primary-foreground">GRATIS</span>
              </motion.div>
              <img src={tonerImg} alt="Magic Tonix Travel Size" className="mx-auto h-auto w-full max-w-[240px] object-contain" />
            </div>
          </motion.div>
        </motion.div>

        {/* Product info */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="w-full text-center md:w-7/12 md:text-left"
        >
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 font-body text-[10px] font-semibold uppercase tracking-widest text-primary">
            Face+ SeboKey
          </span>
          <h3 className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl">
            Magic Tonix
            <br />
            <span className="text-gradient-gold">Travel Size</span>
          </h3>
          <p className="mt-4 font-body text-sm leading-relaxed text-muted-foreground md:text-base">
            Il tonico magico che ha conquistato migliaia di donne, ora nel formato perfetto da portare sempre con te.
            Formula concentrata per una pelle luminosa e idratata.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
            {[
              "Idratazione intensa",
              "Luminosità immediata",
              "Ingredienti naturali",
            ].map((text, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 font-body text-xs text-muted-foreground"
              >
                <span className="h-1 w-1 rounded-full bg-primary" /> {text}
              </motion.span>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex items-center justify-center gap-3 md:justify-start"
          >
            <span className="font-body text-lg text-muted-foreground line-through">€19,90</span>
            <span className="rounded-full bg-gradient-gold px-5 py-2 font-display text-xl font-bold text-primary-foreground shadow-gold">
              GRATIS
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-4 flex items-center justify-center gap-4 md:justify-start"
          >
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />
              ))}
            </div>
            <span className="font-body text-xs text-muted-foreground">4.9/5 (1.200+ recensioni)</span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default GiftProductShowcase;
