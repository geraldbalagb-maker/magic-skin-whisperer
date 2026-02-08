import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import SectionHeader from "./SectionHeader";
import routineCleansingImg from "@/assets/steps/routine-cleansing.jpg";
import routineExfoliationImg from "@/assets/steps/routine-exfoliation.jpg";
import routineMoisturizerImg from "@/assets/steps/routine-moisturizer.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0, 0, 0.2, 1] as const },
  }),
};

const categories = [
  { name: "Detersione", description: "Detergenti delicati per ogni tipo di pelle", image: routineCleansingImg },
  { name: "Esfoliazione", description: "Scrub e peeling per una pelle luminosa", image: routineExfoliationImg },
  { name: "Idratazione", description: "Creme e sieri per un'idratazione profonda", image: routineMoisturizerImg },
];

interface CategoryGridProps {
  onStartQuiz: () => void;
}

const CategoryGrid = ({ onStartQuiz }: CategoryGridProps) => (
  <section className="border-t border-border bg-gradient-cream px-6 py-20 md:py-28">
    <div className="mx-auto max-w-6xl">
      <SectionHeader label="I nostri trattamenti" title="Scopri per categoria" className="mb-14" />

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
              <img src={cat.image} alt={cat.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
              <h3 className="absolute bottom-4 left-5 font-display text-xl font-bold text-background">{cat.name}</h3>
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
);

export default CategoryGrid;
