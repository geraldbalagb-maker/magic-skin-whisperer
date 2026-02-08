import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface HeartBurstProps {
  show: boolean;
}

const HeartBurst = ({ show }: HeartBurstProps) => {
  if (!show) return null;
  return (
    <div className="pointer-events-none absolute inset-0">
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-rose"
          initial={{ opacity: 1, scale: 0, x: "50%", y: "50%" }}
          animate={{
            opacity: 0,
            scale: 1,
            x: `${50 + (Math.random() - 0.5) * 80}%`,
            y: `${50 - Math.random() * 60}%`,
          }}
          transition={{ duration: 0.8, delay: i * 0.05 }}
        >
          <Heart className="h-4 w-4 fill-current" />
        </motion.div>
      ))}
    </div>
  );
};

export default HeartBurst;
