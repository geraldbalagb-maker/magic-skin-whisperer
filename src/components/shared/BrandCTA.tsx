import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface BrandCTAProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "checkout";
  disabled?: boolean;
  className?: string;
  showArrow?: boolean;
}

const BrandCTA = ({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  className = "",
  showArrow = false,
}: BrandCTAProps) => {
  const base =
    "group inline-flex items-center gap-2 px-8 py-3.5 font-body text-xs font-semibold uppercase tracking-widest transition-all disabled:opacity-30";

  const variants = {
    primary:
      "bg-[hsl(var(--v2-amber))] text-white hover:bg-[hsl(var(--v2-amber-dark))]",
    checkout:
      "bg-gradient-cta text-cta-foreground shadow-cta hover:shadow-cta/80",
  };

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.03, y: -1 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
      {showArrow && (
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      )}
    </motion.button>
  );
};

export default BrandCTA;
