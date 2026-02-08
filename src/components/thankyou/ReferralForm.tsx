import { motion, AnimatePresence } from "framer-motion";
import { Heart, Mail, Gift, Send } from "lucide-react";
import goldenEnvelopeImg from "@/assets/golden-envelope.jpg";
import HeartBurst from "./HeartBurst";

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
  <div className="relative min-h-screen bg-background px-4 py-12">
    {/* Thank you header */}
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12 text-center"
    >
      <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
        Grazie, {name}!
      </h1>
      <p className="mx-auto mt-3 max-w-md font-body text-muted-foreground">
        Il tuo ordine è confermato. La tua beauty routine sta per arrivare!
      </p>
    </motion.div>

    <AnimatePresence mode="wait">
      {!envelopeOpened ? (
        <motion.div
          key="envelope"
          className="mx-auto mb-12 max-w-sm cursor-pointer text-center"
          onClick={onOpenEnvelope}
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="relative"
          >
            <img
              src={goldenEnvelopeImg}
              alt="Busta sorpresa"
              className="mx-auto w-64 rounded-2xl shadow-gold-lg"
            />
            <div className="absolute -right-2 -top-2 rounded-full bg-gradient-gold p-2 shadow-gold animate-pulse-glow">
              <Gift className="h-5 w-5 text-primary-foreground" />
            </div>
          </motion.div>
          <p className="mt-4 font-display text-lg font-medium text-foreground">
            Hai un regalo che ti aspetta! 🎁
          </p>
          <p className="font-body text-sm text-muted-foreground">
            Clicca sulla busta per scoprirlo
          </p>
        </motion.div>
      ) : (
        <motion.div
          key="gift-content"
          initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="mx-auto mb-12 max-w-md"
        >
          <div className="rounded-2xl border border-primary/30 bg-card p-8 text-center shadow-gold-lg">
            <Gift className="mx-auto mb-4 h-12 w-12 text-primary" />
            <h2 className="font-display text-2xl font-bold text-foreground">
              Un regalo esclusivo per te! 🎁
            </h2>
            <p className="mt-3 font-body text-sm text-muted-foreground">
              Invita <strong>3 amiche</strong> a scoprire la loro beauty routine e riceverai in omaggio il nostro{" "}
              <span className="font-semibold text-primary">Magic Tonix Travel Size</span> aggiunto al tuo ordine!
            </p>

            <div className="mt-8 space-y-4">
              {[0, 1, 2].map((idx) => (
                <div key={idx} className="relative">
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
                </div>
              ))}
            </div>

            <motion.button
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
