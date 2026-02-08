import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift } from "lucide-react";

interface GiftEnvelopeProps {
  onOpen: () => void;
}

const GiftEnvelope = ({ onOpen }: GiftEnvelopeProps) => {
  const [phase, setPhase] = useState<"sealed" | "opening" | "revealed">("sealed");

  const handleClick = () => {
    if (phase !== "sealed") return;
    setPhase("opening");
    // After flap opens, reveal the card
    setTimeout(() => setPhase("revealed"), 800);
    // Callback after full animation
    setTimeout(onOpen, 2400);
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Ambient glow */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 300,
          height: 300,
          background: "radial-gradient(circle, hsl(var(--gold) / 0.12), transparent 70%)",
        }}
        animate={
          phase === "sealed"
            ? { scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }
            : { scale: 2.5, opacity: 0 }
        }
        transition={
          phase === "sealed"
            ? { duration: 3, repeat: Infinity, ease: "easeInOut" }
            : { duration: 1.2 }
        }
      />

      {/* Floating gold particles */}
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 3 + (i % 3) * 2,
              height: 3 + (i % 3) * 2,
              background: `hsl(var(--gold-light))`,
              left: `${20 + (i * 60) / 8}%`,
              top: `${30 + Math.sin(i) * 30}%`,
            }}
            animate={{
              y: [-10, -30, -10],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 2 + i * 0.3,
              delay: i * 0.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Envelope container with 3D perspective */}
      <motion.div
        onClick={handleClick}
        className="relative z-10 cursor-pointer select-none"
        style={{ perspective: 800 }}
        animate={phase === "sealed" ? { y: [0, -6, 0] } : {}}
        transition={phase === "sealed" ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" } : {}}
        whileHover={phase === "sealed" ? { scale: 1.04 } : {}}
        whileTap={phase === "sealed" ? { scale: 0.97 } : {}}
      >
        {/* Envelope structure */}
        <div
          className="relative"
          style={{
            width: 260,
            height: 180,
          }}
        >
          {/* === BACK of envelope (visible behind flap) === */}
          <div
            className="absolute inset-x-0 top-0 rounded-t-lg"
            style={{
              height: 90,
              background: "linear-gradient(180deg, hsl(var(--gold-dark)), hsl(var(--gold)))",
              borderRadius: "8px 8px 0 0",
            }}
          />

          {/* === Card that rises out === */}
          <AnimatePresence>
            {phase === "revealed" && (
              <motion.div
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: -90, opacity: 1 }}
                transition={{ duration: 0.9, type: "spring", bounce: 0.35 }}
                className="absolute left-1/2 z-20 -translate-x-1/2"
                style={{ top: 20, width: 200 }}
              >
                <div
                  className="flex flex-col items-center justify-center rounded-xl border px-6 py-5"
                  style={{
                    background: "linear-gradient(135deg, hsl(var(--card)), hsl(var(--cream-dark)))",
                    borderColor: "hsl(var(--gold-light) / 0.4)",
                    boxShadow: "0 12px 40px hsl(var(--gold) / 0.25), 0 2px 8px hsl(var(--gold) / 0.1)",
                  }}
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3, type: "spring", bounce: 0.5 }}
                  >
                    <Gift className="mb-2 h-8 w-8 text-primary" />
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="font-display text-sm font-bold text-foreground"
                  >
                    Hai un regalo!
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="mt-1 font-body text-[10px] text-muted-foreground"
                  >
                    Un prodotto esclusivo ti aspetta
                  </motion.p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* === BODY of envelope (front face) === */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{
              borderRadius: 8,
              background: "linear-gradient(145deg, hsl(40 45% 90%), hsl(38 40% 84%), hsl(36 35% 78%))",
              boxShadow: "0 8px 32px hsl(var(--gold) / 0.25), inset 0 1px 0 hsl(40 50% 95%)",
              border: "1px solid hsl(var(--gold-light) / 0.3)",
            }}
          >
            {/* Inner V-fold decorative lines */}
            <svg
              viewBox="0 0 260 180"
              className="absolute inset-0 h-full w-full"
              preserveAspectRatio="none"
            >
              {/* Left fold line */}
              <line
                x1="0" y1="0" x2="130" y2="110"
                stroke="hsl(38 30% 70%)"
                strokeWidth="0.6"
                opacity="0.4"
              />
              {/* Right fold line */}
              <line
                x1="260" y1="0" x2="130" y2="110"
                stroke="hsl(38 30% 70%)"
                strokeWidth="0.6"
                opacity="0.4"
              />
            </svg>

            {/* Subtle texture overlay */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 2px,
                  hsl(var(--gold-dark)) 2px,
                  hsl(var(--gold-dark)) 3px
                )`,
              }}
            />
          </div>

          {/* === FLAP (triangular lid) with real 3D rotation === */}
          <motion.div
            className="absolute inset-x-0 top-0 z-30"
            style={{
              height: 100,
              transformOrigin: "top center",
              transformStyle: "preserve-3d",
            }}
            animate={
              phase !== "sealed"
                ? { rotateX: 180 }
                : { rotateX: 0 }
            }
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Front side of flap (visible when closed) */}
            <div
              className="absolute inset-0"
              style={{
                clipPath: "polygon(0 0, 50% 100%, 100% 0)",
                background: "linear-gradient(180deg, hsl(38 42% 82%), hsl(40 45% 86%), hsl(38 40% 80%))",
                backfaceVisibility: "hidden",
                border: "none",
              }}
            >
              {/* Flap edge highlight */}
              <svg viewBox="0 0 260 100" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
                <line x1="0" y1="0" x2="130" y2="100" stroke="hsl(38 30% 72%)" strokeWidth="0.8" opacity="0.5" />
                <line x1="260" y1="0" x2="130" y2="100" stroke="hsl(38 30% 72%)" strokeWidth="0.8" opacity="0.5" />
              </svg>
            </div>

            {/* Back side of flap (visible when opened = flipped 180°) */}
            <div
              className="absolute inset-0"
              style={{
                clipPath: "polygon(0 0, 50% 100%, 100% 0)",
                background: "linear-gradient(180deg, hsl(var(--gold)), hsl(var(--gold-dark)))",
                backfaceVisibility: "hidden",
                transform: "rotateX(180deg)",
              }}
            />
          </motion.div>

          {/* === WAX SEAL === */}
          <AnimatePresence>
            {phase === "sealed" && (
              <motion.div
                className="absolute left-1/2 z-40 -translate-x-1/2"
                style={{ top: 55 }}
                exit={{
                  scale: [1, 1.3, 0],
                  opacity: [1, 1, 0],
                  rotate: [0, 10, -20],
                }}
                transition={{ duration: 0.4, ease: "easeIn" }}
              >
                {/* Seal outer */}
                <div
                  className="relative flex items-center justify-center"
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "radial-gradient(circle at 35% 35%, hsl(var(--gold)), hsl(var(--gold-dark)) 70%)",
                    boxShadow: "0 3px 12px hsl(var(--gold-dark) / 0.5), inset 0 1px 2px hsl(40 60% 75% / 0.4)",
                  }}
                >
                  {/* Seal edge bumps */}
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `conic-gradient(
                        from 0deg,
                        hsl(var(--gold)) 0deg,
                        hsl(var(--gold-dark)) 15deg,
                        hsl(var(--gold)) 30deg,
                        hsl(var(--gold-dark)) 45deg,
                        hsl(var(--gold)) 60deg,
                        hsl(var(--gold-dark)) 75deg,
                        hsl(var(--gold)) 90deg,
                        hsl(var(--gold-dark)) 105deg,
                        hsl(var(--gold)) 120deg,
                        hsl(var(--gold-dark)) 135deg,
                        hsl(var(--gold)) 150deg,
                        hsl(var(--gold-dark)) 165deg,
                        hsl(var(--gold)) 180deg,
                        hsl(var(--gold-dark)) 195deg,
                        hsl(var(--gold)) 210deg,
                        hsl(var(--gold-dark)) 225deg,
                        hsl(var(--gold)) 240deg,
                        hsl(var(--gold-dark)) 255deg,
                        hsl(var(--gold)) 270deg,
                        hsl(var(--gold-dark)) 285deg,
                        hsl(var(--gold)) 300deg,
                        hsl(var(--gold-dark)) 315deg,
                        hsl(var(--gold)) 330deg,
                        hsl(var(--gold-dark)) 345deg,
                        hsl(var(--gold)) 360deg
                      )`,
                      mask: "radial-gradient(circle, transparent 60%, black 61%, black 100%)",
                      WebkitMask: "radial-gradient(circle, transparent 60%, black 61%, black 100%)",
                    }}
                  />
                  {/* Inner circle */}
                  <div
                    className="flex items-center justify-center rounded-full"
                    style={{
                      width: 30,
                      height: 30,
                      background: "radial-gradient(circle at 40% 40%, hsl(var(--gold)), hsl(var(--gold-dark)))",
                      border: "1px solid hsl(var(--gold-light) / 0.3)",
                    }}
                  >
                    <span
                      className="font-display text-xs font-bold"
                      style={{ color: "hsl(40 60% 88%)", letterSpacing: "0.05em" }}
                    >
                      LP
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Full-screen flash on open */}
      <AnimatePresence>
        {phase !== "sealed" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0] }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="pointer-events-none fixed inset-0 z-50"
            style={{ background: "radial-gradient(circle at 50% 60%, hsl(var(--gold) / 0.3), transparent 70%)" }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GiftEnvelope;
