import { motion } from "framer-motion";
import SectionHeader from "../landing/SectionHeader";

interface AITip {
  title: string;
  text: string;
}

interface AITipsGridProps {
  tips: AITip[] | string[];
}



const AITipsGrid = ({ tips }: AITipsGridProps) => {
  if (!tips || tips.length === 0) return null;

  // Support both old string[] and new {title, text}[] format
  const normalizedTips: AITip[] = tips.map((tip, i) =>
    typeof tip === "string"
      ? { title: `Consiglio #${i + 1}`, text: tip }
      : tip
  );

  return (
    <div className="border-b border-border bg-gradient-cream">
      <div className="mx-auto max-w-5xl px-4 py-14 md:py-20">
        <SectionHeader
          label="Consigli personalizzati"
          title="I segreti per la tua pelle"
          className="mb-10"
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {normalizedTips.map((tip, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className={`group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-elegant transition-all hover:border-primary/20 hover:shadow-elevated ${
                i === 0 ? "md:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 animate-shimmer" />

              <div className="relative z-10">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-gold font-display text-sm font-bold text-primary-foreground shadow-gold">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="font-display text-sm font-semibold text-foreground">
                    {tip.title}
                  </h3>
                </div>
                <p className="font-body text-sm leading-relaxed text-muted-foreground">
                  {tip.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AITipsGrid;
