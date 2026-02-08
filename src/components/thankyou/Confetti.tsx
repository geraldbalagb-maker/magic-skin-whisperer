import { motion } from "framer-motion";

const ConfettiPiece = ({ delay, color }: { delay: number; color: string }) => {
  const x = Math.random() * 100;
  const rotation = Math.random() * 720 - 360;
  const size = Math.random() * 8 + 4;
  const isCircle = Math.random() > 0.5;

  return (
    <motion.div
      className="pointer-events-none absolute"
      style={{
        left: `${x}%`,
        top: -20,
        width: size,
        height: isCircle ? size : size * 2.5,
        borderRadius: isCircle ? "50%" : "2px",
        backgroundColor: color,
      }}
      initial={{ opacity: 1, y: -20, rotate: 0 }}
      animate={{
        opacity: [1, 1, 0],
        y: [0, window.innerHeight * 0.8],
        rotate: rotation,
        x: [0, (Math.random() - 0.5) * 200],
      }}
      transition={{
        duration: 2.5 + Math.random() * 1.5,
        delay,
        ease: "easeOut",
      }}
    />
  );
};

const COLORS = [
  "hsl(38 55% 55%)",
  "hsl(40 60% 75%)",
  "hsl(350 40% 70%)",
  "hsl(38 55% 65%)",
  "hsl(0 0% 95%)",
  "hsl(40 33% 85%)",
];

const Confetti = () => (
  <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
    {Array.from({ length: 60 }).map((_, i) => (
      <ConfettiPiece key={i} delay={i * 0.04} color={COLORS[i % COLORS.length]} />
    ))}
  </div>
);

export default Confetti;
