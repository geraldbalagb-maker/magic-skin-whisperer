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
    setTimeout(() => setPhase("revealed"), 700);
    setTimeout(onOpen, 2600);
  };

  const W = 260;
  const BODY_H = 150;
  const FLAP_H = 90;

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
              background: "hsl(var(--gold-light))",
              left: `${20 + (i * 60) / 8}%`,
              top: `${30 + Math.sin(i) * 30}%`,
            }}
            animate={{ y: [-10, -30, -10], opacity: [0, 0.6, 0] }}
            transition={{
              duration: 2 + i * 0.3,
              delay: i * 0.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Envelope wrapper */}
      <motion.div
        onClick={handleClick}
        className="relative z-10 cursor-pointer select-none"
        animate={phase === "sealed" ? { y: [0, -6, 0] } : {}}
        transition={
          phase === "sealed"
            ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
            : {}
        }
        whileHover={phase === "sealed" ? { scale: 1.04 } : {}}
        whileTap={phase === "sealed" ? { scale: 0.97 } : {}}
      >
        <div
          className="relative"
          style={{ width: W, height: FLAP_H + BODY_H, perspective: 900 }}
        >
          {/* ============================================
              CARD — sits behind the body, slides up on reveal
              ============================================ */}
          <AnimatePresence>
            {phase === "revealed" && (
              <motion.div
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: -100, opacity: 1 }}
                transition={{
                  duration: 0.9,
                  type: "spring",
                  bounce: 0.3,
                  delay: 0.1,
                }}
                className="absolute z-10"
                style={{
                  left: W / 2 - 100,
                  top: FLAP_H + 10,
                  width: 200,
                }}
              >
                <div
                  className="flex flex-col items-center justify-center rounded-xl border px-6 py-5"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(var(--card)), hsl(var(--cream-dark)))",
                    borderColor: "hsl(var(--gold-light) / 0.4)",
                    boxShadow:
                      "0 12px 40px hsl(var(--gold) / 0.25), 0 2px 8px hsl(var(--gold) / 0.1)",
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

          {/* ============================================
              ENVELOPE BODY — the rectangular front face
              ============================================ */}
          <div
            className="absolute overflow-hidden"
            style={{
              left: 0,
              top: FLAP_H,
              width: W,
              height: BODY_H,
              borderRadius: "0 0 10px 10px",
              background:
                "linear-gradient(160deg, hsl(40 45% 90%), hsl(38 40% 84%), hsl(36 35% 78%))",
              boxShadow:
                "0 8px 32px hsl(var(--gold) / 0.2), inset 0 1px 0 hsl(40 50% 95%)",
              border: "1px solid hsl(var(--gold-light) / 0.3)",
              borderTop: "none",
              zIndex: 20,
            }}
          >
            {/* Inner V fold lines */}
            <svg
              viewBox={`0 0 ${W} ${BODY_H}`}
              className="absolute inset-0 h-full w-full"
              preserveAspectRatio="none"
            >
              <line
                x1="0" y1="0" x2={W / 2} y2={BODY_H * 0.75}
                stroke="hsl(38 30% 70%)" strokeWidth="0.6" opacity="0.4"
              />
              <line
                x1={W} y1="0" x2={W / 2} y2={BODY_H * 0.75}
                stroke="hsl(38 30% 70%)" strokeWidth="0.6" opacity="0.4"
              />
            </svg>

            {/* Subtle diagonal texture */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  45deg, transparent, transparent 2px,
                  hsl(var(--gold-dark)) 2px, hsl(var(--gold-dark)) 3px
                )`,
              }}
            />
          </div>

          {/* ============================================
              INNER TRIANGLE — visible behind flap when it opens
              ============================================ */}
          <div
            className="absolute"
            style={{
              left: 0,
              top: FLAP_H,
              width: W,
              height: FLAP_H,
              zIndex: 15,
            }}
          >
            <svg viewBox={`0 0 ${W} ${FLAP_H}`} className="h-full w-full">
              <defs>
                <linearGradient id="inner-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(36 50% 40%)" />
                  <stop offset="100%" stopColor="hsl(38 55% 55%)" />
                </linearGradient>
              </defs>
              <polygon
                points={`0,0 ${W},0 ${W / 2},${FLAP_H * 0.85}`}
                fill="url(#inner-grad)"
              />
            </svg>
          </div>

          {/* ============================================
              FLAP — the triangular lid, hinged at its TOP edge
              Rotates backward (rotateX) to open
              ============================================ */}
          <motion.div
            className="absolute"
            style={{
              left: 0,
              top: 0,
              width: W,
              height: FLAP_H + 1, // +1 to overlap body seamlessly
              transformOrigin: `center ${FLAP_H}px`, // hinge at the BOTTOM of the flap (where it meets the body)
              transformStyle: "preserve-3d",
              zIndex: 30,
            }}
            animate={
              phase !== "sealed" ? { rotateX: -180 } : { rotateX: 0 }
            }
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Front of flap (visible when closed) */}
            <div
              className="absolute inset-0"
              style={{ backfaceVisibility: "hidden" }}
            >
              <svg viewBox={`0 0 ${W} ${FLAP_H}`} className="h-full w-full drop-shadow-sm">
                <defs>
                  <linearGradient id="flap-front" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="hsl(38 42% 82%)" />
                    <stop offset="60%" stopColor="hsl(40 45% 86%)" />
                    <stop offset="100%" stopColor="hsl(38 40% 80%)" />
                  </linearGradient>
                </defs>
                <polygon
                  points={`0,${FLAP_H} ${W / 2},0 ${W},${FLAP_H}`}
                  fill="url(#flap-front)"
                  stroke="hsl(38 30% 72%)"
                  strokeWidth="0.5"
                />
                {/* Subtle center line */}
                <line
                  x1={W / 2} y1="12" x2={W / 2} y2={FLAP_H - 10}
                  stroke="hsl(38 30% 72%)" strokeWidth="0.3" opacity="0.3"
                />
              </svg>
            </div>

            {/* Back of flap (visible when opened/flipped) */}
            <div
              className="absolute inset-0"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateX(180deg)",
              }}
            >
              <svg viewBox={`0 0 ${W} ${FLAP_H}`} className="h-full w-full">
                <defs>
                  <linearGradient id="flap-back" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(36 50% 45%)" />
                    <stop offset="100%" stopColor="hsl(38 55% 55%)" />
                  </linearGradient>
                </defs>
                <polygon
                  points={`0,${FLAP_H} ${W / 2},0 ${W},${FLAP_H}`}
                  fill="url(#flap-back)"
                />
              </svg>
            </div>
          </motion.div>

          {/* ============================================
              WAX SEAL — centered on the flap/body junction
              ============================================ */}
          <AnimatePresence>
            {phase === "sealed" && (
              <motion.div
                className="absolute left-1/2 -translate-x-1/2"
                style={{ top: FLAP_H - 22, zIndex: 40 }}
                exit={{
                  scale: [1, 1.3, 0],
                  opacity: [1, 1, 0],
                  rotate: [0, 10, -20],
                }}
                transition={{ duration: 0.35, ease: "easeIn" }}
              >
                <div
                  className="relative flex items-center justify-center"
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle at 35% 35%, hsl(var(--gold)), hsl(var(--gold-dark)) 70%)",
                    boxShadow:
                      "0 3px 12px hsl(var(--gold-dark) / 0.5), inset 0 1px 2px hsl(40 60% 75% / 0.4)",
                  }}
                >
                  {/* Seal scalloped edge */}
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `conic-gradient(from 0deg,
                        hsl(var(--gold)) 0deg, hsl(var(--gold-dark)) 15deg,
                        hsl(var(--gold)) 30deg, hsl(var(--gold-dark)) 45deg,
                        hsl(var(--gold)) 60deg, hsl(var(--gold-dark)) 75deg,
                        hsl(var(--gold)) 90deg, hsl(var(--gold-dark)) 105deg,
                        hsl(var(--gold)) 120deg, hsl(var(--gold-dark)) 135deg,
                        hsl(var(--gold)) 150deg, hsl(var(--gold-dark)) 165deg,
                        hsl(var(--gold)) 180deg, hsl(var(--gold-dark)) 195deg,
                        hsl(var(--gold)) 210deg, hsl(var(--gold-dark)) 225deg,
                        hsl(var(--gold)) 240deg, hsl(var(--gold-dark)) 255deg,
                        hsl(var(--gold)) 270deg, hsl(var(--gold-dark)) 285deg,
                        hsl(var(--gold)) 300deg, hsl(var(--gold-dark)) 315deg,
                        hsl(var(--gold)) 330deg, hsl(var(--gold-dark)) 345deg,
                        hsl(var(--gold)) 360deg
                      )`,
                      mask: "radial-gradient(circle, transparent 58%, black 59%)",
                      WebkitMask:
                        "radial-gradient(circle, transparent 58%, black 59%)",
                    }}
                  />
                  <div
                    className="flex items-center justify-center rounded-full"
                    style={{
                      width: 30,
                      height: 30,
                      background:
                        "radial-gradient(circle at 40% 40%, hsl(var(--gold)), hsl(var(--gold-dark)))",
                      border: "1px solid hsl(var(--gold-light) / 0.3)",
                    }}
                  >
                    <span
                      className="font-display text-xs font-bold"
                      style={{
                        color: "hsl(40 60% 88%)",
                        letterSpacing: "0.05em",
                      }}
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

      {/* Full-screen radial flash on open */}
      <AnimatePresence>
        {phase !== "sealed" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0] }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="pointer-events-none fixed inset-0 z-50"
            style={{
              background:
                "radial-gradient(circle at 50% 60%, hsl(var(--gold) / 0.3), transparent 70%)",
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GiftEnvelope;
