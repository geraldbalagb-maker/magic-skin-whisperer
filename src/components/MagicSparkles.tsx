import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SparkleProps {
  count?: number;
  trigger?: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

const MagicSparkles = ({ count = 20, trigger = true }: SparkleProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  const generateParticles = useCallback(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 2,
      delay: Math.random() * 2,
      duration: Math.random() * 2 + 1,
    }));
  }, [count]);

  useEffect(() => {
    if (trigger) setParticles(generateParticles());
  }, [trigger, generateParticles]);

  if (!trigger) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gradient-gold"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            y: [-20, -60],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            repeatDelay: Math.random() * 3,
          }}
        />
      ))}
    </div>
  );
};

export default MagicSparkles;
