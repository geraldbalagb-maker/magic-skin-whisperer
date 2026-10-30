import { motion } from "framer-motion";

export const MinimalCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`border border-border bg-background p-8 shadow-elegant md:p-10 ${className}`}>
    {children}
  </div>
);

export const StepBadge = ({ n }: { n: number }) => (
  <div className="flex h-10 w-10 items-center justify-center border border-primary/20 bg-[hsl(var(--cream))] font-display text-sm font-bold text-primary">
    {n}
  </div>
);

export const PrimaryButton = ({ children, disabled, onClick }: { children: React.ReactNode; disabled?: boolean; onClick: () => void }) => (
  <motion.button
    whileHover={{ scale: 1.03, y: -1 }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    disabled={disabled}
    className="bg-primary px-10 py-3.5 font-body text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-30"
  >
    {children}
  </motion.button>
);
