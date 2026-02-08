import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Sparkles } from "lucide-react";

interface GiftEnvelopeProps {
  onOpen: () => void;
}

const GiftEnvelope = ({ onOpen }: GiftEnvelopeProps) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleClick = () => {
    if (isOpening) return;
    setIsOpening(true);
    // Delay the callback to let animation play
    setTimeout(onOpen, 1800);
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Floating particles behind envelope */}
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full"
            style={{
              background: i % 2 === 0 ? "hsl(38 55% 55%)" : "hsl(40 60% 75%)",
            }}
            animate={{
              x: [0, Math.cos((i * Math.PI * 2) / 12) * 80],
              y: [0, Math.sin((i * Math.PI * 2) / 12) * 80],
              opacity: [0, 0.6, 0],
              scale: [0, 1.2, 0],
            }}
            transition={{
              duration: 2.5,
              delay: i * 0.15,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Glow effect */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 260,
          height: 260,
          background: "radial-gradient(circle, hsl(38 55% 55% / 0.15), transparent 70%)",
        }}
        animate={
          isOpening
            ? { scale: [1, 3], opacity: [0.3, 0] }
            : { scale: [1, 1.15, 1], opacity: [0.2, 0.35, 0.2] }
        }
        transition={
          isOpening
            ? { duration: 1.2, ease: "easeOut" }
            : { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }
      />

      {/* The Envelope */}
      <motion.div
        onClick={handleClick}
        className="relative z-10 cursor-pointer select-none"
        animate={isOpening ? {} : { y: [0, -6, 0] }}
        transition={isOpening ? {} : { duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        whileHover={isOpening ? {} : { scale: 1.06 }}
        whileTap={isOpening ? {} : { scale: 0.96 }}
      >
        <svg
          viewBox="0 0 240 180"
          className="w-56 md:w-64 drop-shadow-2xl"
          style={{ filter: "drop-shadow(0 8px 32px hsl(38 55% 55% / 0.3))" }}
        >
          {/* Envelope body */}
          <defs>
            <linearGradient id="env-body" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="hsl(38 40% 88%)" />
              <stop offset="50%" stopColor="hsl(40 45% 82%)" />
              <stop offset="100%" stopColor="hsl(38 35% 75%)" />
            </linearGradient>
            <linearGradient id="env-flap" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(38 50% 70%)" />
              <stop offset="100%" stopColor="hsl(40 45% 82%)" />
            </linearGradient>
            <linearGradient id="env-inner" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(38 55% 55%)" />
              <stop offset="100%" stopColor="hsl(40 50% 65%)" />
            </linearGradient>
            <linearGradient id="env-seal" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="hsl(38 60% 50%)" />
              <stop offset="100%" stopColor="hsl(35 55% 40%)" />
            </linearGradient>
          </defs>

          {/* Inner triangle visible when flap opens */}
          <polygon points="10,60 120,130 230,60" fill="url(#env-inner)" opacity="0.5" />

          {/* Body rect */}
          <rect x="10" y="60" width="220" height="110" rx="6" fill="url(#env-body)" stroke="hsl(38 30% 70%)" strokeWidth="1" />

          {/* Bottom fold lines */}
          <line x1="10" y1="60" x2="120" y2="130" stroke="hsl(38 30% 70%)" strokeWidth="0.5" opacity="0.5" />
          <line x1="230" y1="60" x2="120" y2="130" stroke="hsl(38 30% 70%)" strokeWidth="0.5" opacity="0.5" />

          {/* Flap (animated) */}
          <motion.g
            style={{ transformOrigin: "120px 60px" }}
            animate={isOpening ? { rotateX: 180 } : {}}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <polygon
              points="10,60 120,6 230,60"
              fill="url(#env-flap)"
              stroke="hsl(38 30% 70%)"
              strokeWidth="1"
            />
            {/* Subtle line on flap */}
            <line x1="60" y1="40" x2="180" y2="40" stroke="hsl(38 30% 65%)" strokeWidth="0.3" opacity="0.6" />
          </motion.g>

          {/* Wax seal */}
          <AnimatePresence>
            {!isOpening && (
              <motion.g
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <circle cx="120" cy="60" r="16" fill="url(#env-seal)" />
                <circle cx="120" cy="60" r="13" fill="none" stroke="hsl(35 45% 35%)" strokeWidth="0.5" />
                {/* LP monogram */}
                <text
                  x="120"
                  y="65"
                  textAnchor="middle"
                  fontFamily="'Cormorant Garamond', serif"
                  fontSize="13"
                  fontWeight="700"
                  fill="hsl(40 60% 85%)"
                >
                  LP
                </text>
              </motion.g>
            )}
          </AnimatePresence>
        </svg>

        {/* Card rising out of envelope on open */}
        <AnimatePresence>
          {isOpening && (
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.8 }}
              animate={{ y: -80, opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8, type: "spring", bounce: 0.3 }}
              className="absolute left-1/2 top-0 -translate-x-1/2"
            >
              <div className="flex h-28 w-44 flex-col items-center justify-center rounded-xl border border-primary/20 bg-card shadow-elevated md:h-32 md:w-52">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.9, type: "spring" }}
                >
                  <Gift className="mb-2 h-8 w-8 text-primary" />
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 }}
                  className="font-display text-sm font-bold text-foreground"
                >
                  Hai un regalo!
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3 }}
                  className="font-body text-[10px] text-muted-foreground"
                >
                  Clicca per scoprirlo
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Sparkle icon */}
      {!isOpening && (
        <motion.div
          className="absolute -right-4 -top-4 z-20 text-primary"
          animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="h-6 w-6" />
        </motion.div>
      )}

      {/* Screen-wide flash on open */}
      <AnimatePresence>
        {isOpening && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0] }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="fixed inset-0 z-50 bg-primary/10 pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GiftEnvelope;
