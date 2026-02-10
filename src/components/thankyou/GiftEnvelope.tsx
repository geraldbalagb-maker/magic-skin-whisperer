import { motion } from "framer-motion";
import giftEnvelopeImg from "@/assets/gift-envelope.png";

interface GiftEnvelopeProps {
  onOpen: () => void;
}

const GiftEnvelope = ({ onOpen }: GiftEnvelopeProps) => {
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
          src={giftEnvelopeImg}
          alt="Busta regalo"
          className="h-48 w-48 object-contain drop-shadow-lg md:h-56 md:w-56"
        />
      </motion.button>
    </div>
  );
};

export default GiftEnvelope;
