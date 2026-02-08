import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { products } from "@/data/products";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0, 0, 0.2, 1] as const },
  }),
};

const featuredProducts = products.slice(0, 8);

interface FeaturedProductsProps {
  onStartQuiz: () => void;
}

const FeaturedProducts = ({ onStartQuiz }: FeaturedProductsProps) => (
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
              <img src={product.image} alt={product.name} className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" />
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
);

export default FeaturedProducts;
