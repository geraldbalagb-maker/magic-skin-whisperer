import { motion } from "framer-motion";

interface SectionHeaderProps {
  label?: string;
  title: string;
  subtitle?: string;
  className?: string;
}

const SectionHeader = ({ label, title, subtitle, className = "" }: SectionHeaderProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={`text-center ${className}`}
  >
    {label && (
      <span className="font-body text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
        {label}
      </span>
    )}
    <h2 className="mt-2 font-display text-2xl font-bold text-foreground md:text-4xl">
      {title}
    </h2>
    {subtitle && (
      <p className="mx-auto mt-3 max-w-md font-body text-sm text-muted-foreground">
        {subtitle}
      </p>
    )}
    <div className="mx-auto mt-4 h-px w-16 bg-gradient-gold" />
  </motion.div>
);

export default SectionHeader;
