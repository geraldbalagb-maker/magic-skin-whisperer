import { motion } from "framer-motion";
import giftBoxImg from "@/assets/gift-box.png";

interface GiftEnvelopeProps {
  onOpen: () => void;
}

const GiftEnvelope = ({ onOpen }: GiftEnvelopeProps) => {
  return (
    <div className="relative flex flex-col items-center gap-6">
      {/* Ambient glow */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 300,
          height: 300,
          background: "radial-gradient(circle, hsl(var(--gold) / 0.15), transparent 70%)",
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.button
        onClick={onOpen}
        className="relative z-10 cursor-pointer"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
      >
        <img
          src={giftBoxImg}
          alt="Pacchetto regalo"
          className="h-48 w-48 object-contain drop-shadow-lg md:h-56 md:w-56"
        />
      </motion.button>

      {/* CTA text */}
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="font-body text-sm font-medium text-primary"
      >
        Tocca il pacchetto per scoprire il tuo regalo
      </motion.p>
    </div>
  );
};

export default GiftEnvelope;
