import { motion, AnimatePresence } from "framer-motion";
import { Heart, Mail, Gift, Send } from "lucide-react";
import HeartBurst from "./HeartBurst";
import GiftEnvelope from "./GiftEnvelope";
import MaisonLogo from "@/components/MaisonLogo";

interface ReferralFormProps {
  name: string;
  envelopeOpened: boolean;
  onOpenEnvelope: () => void;
  emails: string[];
  validEmails: boolean[];
  heartBursts: boolean[];
  onEmailChange: (idx: number, value: string) => void;
  canSubmit: boolean;
  onSubmit: () => void;
}

const ReferralForm = ({
  name,
  envelopeOpened,
  onOpenEnvelope,
  emails,
  validEmails,
  heartBursts,
  onEmailChange,
  canSubmit,
  onSubmit,
}: ReferralFormProps) => (
  <div className="relative min-h-screen bg-background">
    {/* Logo */}
    <div className="absolute top-6 left-1/2 z-50 -translate-x-1/2">
      <MaisonLogo variant="dark" size="md" />
    </div>
    <AnimatePresence mode="wait">
      {!envelopeOpened ? (
        <motion.div
          key="envelope-screen"
          exit={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="flex min-h-screen flex-col items-center justify-center px-4"
        >
          {/* Background gradient */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background" />

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 mb-16 text-center"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block rounded-full bg-primary/10 px-4 py-1.5 font-body text-[10px] font-semibold uppercase tracking-widest text-primary"
            >
              Ordine confermato ✓
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="mt-5 font-display text-3xl font-bold text-foreground md:text-5xl"
            >
              Grazie, <span className="sparkle-text">{name}</span>!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mx-auto mt-3 max-w-sm font-body text-sm text-muted-foreground"
            >
              La tua beauty routine sta per arrivare. Ma prima...
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, type: "spring", bounce: 0.4 }}
            className="relative z-10"
          >
            <GiftEnvelope onOpen={onOpenEnvelope} />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="relative z-10 mt-10 font-body text-xs text-muted-foreground/60"
          >
            Tocca la busta per scoprire la sorpresa
          </motion.p>
        </motion.div>
      ) : (
        <motion.div
          key="gift-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0, 0, 0.2, 1] }}
          className="flex min-h-screen flex-col items-center justify-center px-4 py-12"
        >
          <div className="w-full max-w-md rounded-2xl border border-primary/30 bg-card p-8 text-center shadow-gold-lg">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.1 }}
            >
              <Gift className="mx-auto mb-4 h-12 w-12 text-primary" />
            </motion.div>
            <h2 className="font-display text-2xl font-bold text-foreground">
              Un regalo esclusivo per te! 🎁
            </h2>
            <p className="mt-3 font-body text-sm text-muted-foreground">
              Invita <strong>3 amiche</strong> a scoprire la loro beauty routine e riceverai in omaggio il nostro{" "}
              <span className="font-semibold text-primary">Magic Tonix Travel Size</span> aggiunto al tuo ordine!
            </p>

            <div className="mt-8 space-y-4">
              {[0, 1, 2].map((idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + idx * 0.12 }}
                  className="relative"
                >
                  <HeartBurst show={heartBursts[idx]} />
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-500 ${
                        validEmails[idx] ? "bg-gradient-gold shadow-gold" : "bg-muted"
                      }`}
                    >
                      {validEmails[idx] ? (
                        <Heart className="h-4 w-4 fill-primary-foreground text-primary-foreground" />
                      ) : (
                        <Mail className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <input
                      type="email"
                      value={emails[idx]}
                      onChange={(e) => onEmailChange(idx, e.target.value)}
                      placeholder={`Email amica ${idx + 1}`}
                      className={`flex-1 rounded-xl border px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none transition-all duration-500 ${
                        validEmails[idx]
                          ? "border-primary bg-primary/5 shadow-gold focus:ring-2 focus:ring-primary/30"
                          : "border-primary/20 bg-card focus:ring-2 focus:ring-primary/30"
                      }`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: canSubmit ? 1.05 : 1 }}
              whileTap={{ scale: canSubmit ? 0.95 : 1 }}
              onClick={onSubmit}
              disabled={!canSubmit}
              className="mt-6 w-full rounded-sm bg-gradient-cta px-8 py-4 font-body text-xs font-semibold uppercase tracking-widest text-cta-foreground shadow-cta transition-all disabled:opacity-40"
            >
              <Send className="mr-2 inline h-4 w-4" /> Invia gli inviti e ricevi il regalo
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default ReferralForm;
