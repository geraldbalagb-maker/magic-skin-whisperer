import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Mail, Gift, Send, Star, Package, Truck, Shield } from "lucide-react";
import goldenEnvelopeImg from "@/assets/golden-envelope.jpg";
import founderSignatureImg from "@/assets/founder-signature.png";
import tonerImg from "@/assets/products/toner.jpg";

interface ThankYouPageProps {
  name: string;
}

/* ─── Confetti particle ─── */
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

const Confetti = () => {
  const colors = [
    "hsl(38 55% 55%)",
    "hsl(40 60% 75%)",
    "hsl(350 40% 70%)",
    "hsl(38 55% 65%)",
    "hsl(0 0% 95%)",
    "hsl(40 33% 85%)",
  ];
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {Array.from({ length: 60 }).map((_, i) => (
        <ConfettiPiece key={i} delay={i * 0.04} color={colors[i % colors.length]} />
      ))}
    </div>
  );
};

/* ─── Heart burst on email ─── */
const HeartBurst = ({ show }: { show: boolean }) => {
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

/* ─── Main component ─── */
const ThankYouPage = ({ name }: ThankYouPageProps) => {
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [emails, setEmails] = useState(["", "", ""]);
  const [validEmails, setValidEmails] = useState([false, false, false]);
  const [heartBursts, setHeartBursts] = useState([false, false, false]);
  const [allSent, setAllSent] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleEmailChange = (idx: number, value: string) => {
    const newEmails = [...emails];
    newEmails[idx] = value;
    setEmails(newEmails);

    if (isValidEmail(value) && !validEmails[idx]) {
      const newValid = [...validEmails];
      newValid[idx] = true;
      setValidEmails(newValid);

      const newBursts = [...heartBursts];
      newBursts[idx] = true;
      setHeartBursts(newBursts);
      setTimeout(() => {
        setHeartBursts((prev) => { const n = [...prev]; n[idx] = false; return n; });
      }, 1000);
    } else if (!isValidEmail(value)) {
      const newValid = [...validEmails];
      newValid[idx] = false;
      setValidEmails(newValid);
    }
  };

  const canSubmit = validEmails.every(Boolean);

  const handleSubmit = () => {
    if (canSubmit) {
      setShowConfetti(true);
      setAllSent(true);
    }
  };

  useEffect(() => {
    if (showConfetti) {
      const timeout = setTimeout(() => setShowConfetti(false), 4000);
      return () => clearTimeout(timeout);
    }
  }, [showConfetti]);

  /* ══════════════════════════════════════════════
     FINAL CELEBRATION SCREEN
     ══════════════════════════════════════════════ */
  if (allSent) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-background">
        {showConfetti && <Confetti />}

        {/* ─── Hero celebration ─── */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative overflow-hidden bg-gradient-dark"
        >
          {/* Background glow */}
          <div className="pointer-events-none absolute inset-0">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ background: "radial-gradient(circle, hsl(38 55% 55% / 0.3), transparent 70%)" }}
            />
          </div>

          <div className="relative z-10 mx-auto max-w-4xl px-4 py-20 text-center md:py-28">
            {/* Success badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-gold shadow-gold-lg"
            >
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="text-4xl"
              >
                🎁
              </motion.span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="font-display text-4xl font-bold leading-tight text-primary-foreground md:text-6xl"
            >
              Fantastico,{" "}
              <span className="sparkle-text">{name}</span>!
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mx-auto mt-4 max-w-lg font-body text-base text-primary-foreground/70 md:text-lg"
            >
              Le tue amiche riceveranno l'invito per scoprire la loro beauty routine personalizzata
            </motion.p>

            {/* Animated check marks */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mx-auto mt-8 flex max-w-xs flex-col gap-3"
            >
              {["Inviti inviati con successo", "Regalo sbloccato", "Aggiunto al tuo ordine"].map((text, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.15 }}
                  className="flex items-center gap-3"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.9 + i * 0.15, type: "spring" }}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20"
                  >
                    <span className="text-xs text-primary">✓</span>
                  </motion.div>
                  <span className="font-body text-sm text-primary-foreground/60">{text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* ─── Gift product showcase ─── */}
        <section className="border-b border-border bg-gradient-cream">
          <div className="mx-auto max-w-5xl px-4 py-16 md:py-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12 text-center"
            >
              <span className="font-body text-[11px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
                Il tuo regalo esclusivo
              </span>
              <h2 className="mt-2 font-display text-2xl font-bold text-foreground md:text-4xl">
                Sbloccato per te
              </h2>
              <div className="mx-auto mt-4 h-0.5 w-16 rounded-full bg-gradient-gold" />
            </motion.div>

            <div className="flex flex-col items-center gap-12 md:flex-row md:gap-16">
              {/* Product image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative w-full max-w-sm md:w-5/12"
              >
                {/* Glow ring */}
                <div className="absolute inset-0 m-auto h-[85%] w-[85%] rounded-full opacity-30 blur-3xl"
                  style={{ background: "radial-gradient(circle, hsl(38 55% 55% / 0.5), transparent 70%)" }}
                />
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="relative"
                >
                  <div className="overflow-hidden rounded-3xl border border-primary/15 bg-card p-8 shadow-elevated">
                    {/* Free badge */}
                    <motion.div
                      initial={{ rotate: -12, scale: 0 }}
                      whileInView={{ rotate: -12, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3, type: "spring" }}
                      className="absolute -right-2 -top-2 z-10 rounded-full bg-gradient-gold px-4 py-2 shadow-gold"
                    >
                      <span className="font-display text-sm font-bold text-primary-foreground">GRATIS</span>
                    </motion.div>
                    <img
                      src={tonerImg}
                      alt="Magic Tonix Travel Size"
                      className="mx-auto h-auto w-full max-w-[240px] object-contain"
                    />
                  </div>
                </motion.div>
              </motion.div>

              {/* Product info */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="w-full text-center md:w-7/12 md:text-left"
              >
                <span className="inline-block rounded-full bg-primary/10 px-3 py-1 font-body text-[10px] font-semibold uppercase tracking-widest text-primary">
                  Face+ SeboKey
                </span>
                <h3 className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl">
                  Magic Tonix
                  <br />
                  <span className="text-gradient-gold">Travel Size</span>
                </h3>
                <p className="mt-4 font-body text-sm leading-relaxed text-muted-foreground md:text-base">
                  Il tonico magico che ha conquistato migliaia di donne, ora nel formato perfetto da portare sempre con te.
                  Formula concentrata per una pelle luminosa e idratata.
                </p>

                {/* Features */}
                <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
                  {[
                    { icon: "💧", text: "Idratazione intensa" },
                    { icon: "✨", text: "Luminosità immediata" },
                    { icon: "🌿", text: "Ingredienti naturali" },
                  ].map((feat, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 font-body text-xs text-muted-foreground"
                    >
                      <span>{feat.icon}</span> {feat.text}
                    </motion.span>
                  ))}
                </div>

                {/* Price */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="mt-8 flex items-center justify-center gap-3 md:justify-start"
                >
                  <span className="font-body text-lg text-muted-foreground line-through">€19,90</span>
                  <span className="rounded-full bg-gradient-gold px-5 py-2 font-display text-xl font-bold text-primary-foreground shadow-gold">
                    GRATIS
                  </span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                  className="mt-4 flex items-center justify-center gap-4 md:justify-start"
                >
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />
                    ))}
                  </div>
                  <span className="font-body text-xs text-muted-foreground">4.9/5 (1.200+ recensioni)</span>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ─── Founder message ─── */}
        <section className="bg-background">
          <div className="mx-auto max-w-4xl px-4 py-16 md:py-24">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative overflow-hidden rounded-3xl border border-primary/10 bg-card shadow-elevated"
            >
              {/* Decorative corner accent */}
              <div className="absolute right-0 top-0 h-32 w-32 opacity-10"
                style={{ background: "radial-gradient(circle at 100% 0%, hsl(38 55% 55%), transparent 70%)" }}
              />

              <div className="relative z-10 p-8 md:p-12 lg:p-16">
                {/* Quote mark */}
                <motion.span
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 0.08, scale: 1 }}
                  viewport={{ once: true }}
                  className="pointer-events-none absolute left-6 top-4 font-display text-[120px] font-bold leading-none text-foreground md:left-10 md:top-6 md:text-[160px]"
                >
                  "
                </motion.span>

                <div className="relative">
                  <span className="inline-block rounded-full bg-primary/10 px-3 py-1 font-body text-[10px] font-semibold uppercase tracking-widest text-primary">
                    Un messaggio dalla Founder
                  </span>

                  <p className="mt-6 font-display text-lg leading-relaxed text-foreground/90 md:text-xl lg:text-2xl">
                    Cara {name}, grazie di cuore per aver scelto di prenderti cura della tua pelle con noi.
                  </p>
                  <p className="mt-4 font-body text-sm leading-relaxed text-muted-foreground md:text-base">
                    Ogni prodotto che hai ricevuto è stato pensato con amore e scienza.
                    La bellezza autentica nasce dalla cura quotidiana, e io sono onorata
                    di accompagnarti in questo viaggio. Il tuo regalo è un piccolo gesto
                    per ringraziarti della fiducia — e per aver condiviso questa esperienza
                    con le tue amiche.
                  </p>
                  <p className="mt-4 font-body text-sm leading-relaxed text-muted-foreground md:text-base">
                    Ricorda: la tua pelle è unica, e merita il meglio.
                    Non vedo l'ora di vedere i tuoi risultati! 💛
                  </p>

                  {/* Signature */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="mt-8"
                  >
                    <img
                      src={founderSignatureImg}
                      alt="Firma Valentina Tecchio"
                      className="h-16 w-auto object-contain md:h-20"
                    />
                    <div className="mt-2">
                      <p className="font-display text-base font-semibold text-foreground">
                        Valentina Tecchio
                      </p>
                      <p className="font-body text-xs text-muted-foreground">
                        Founder & CEO — Luxury Perfumes
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── Trust bar ─── */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-t border-border bg-gradient-cream"
        >
          <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-8 px-4 py-10 md:gap-12">
            {[
              { icon: <Truck className="h-5 w-5" />, label: "Spedizione gratuita" },
              { icon: <Shield className="h-5 w-5" />, label: "Pagamento sicuro" },
              { icon: <Package className="h-5 w-5" />, label: "Reso facile 30gg" },
              { icon: <Gift className="h-5 w-5" />, label: "Regalo incluso" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-2.5 text-muted-foreground"
              >
                <span className="text-primary">{item.icon}</span>
                <span className="font-body text-xs font-medium">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ─── Final closing ─── */}
        <section className="bg-gradient-dark py-16 text-center md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-lg px-4"
          >
            <span className="text-4xl">💛</span>
            <h3 className="mt-4 font-display text-xl font-bold text-primary-foreground md:text-2xl">
              La tua beauty routine ti aspetta
            </h3>
            <p className="mt-3 font-body text-sm text-primary-foreground/60">
              Controlla la tua email per il riepilogo dell'ordine e i dettagli di spedizione.
              La trasformazione della tua pelle inizia oggi.
            </p>
            <div className="mx-auto mt-6 h-0.5 w-16 rounded-full bg-gradient-gold opacity-40" />
          </motion.div>
        </section>
      </div>
    );
  }

  /* ══════════════════════════════════════════════
     REFERRAL / ENVELOPE SCREEN
     ══════════════════════════════════════════════ */
  return (
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

      {/* Envelope */}
      <AnimatePresence mode="wait">
        {!envelopeOpened ? (
          <motion.div
            key="envelope"
            className="mx-auto mb-12 max-w-sm cursor-pointer text-center"
            onClick={() => setEnvelopeOpened(true)}
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
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-500 ${
                        validEmails[idx] ? "bg-gradient-gold shadow-gold" : "bg-muted"
                      }`}>
                        {validEmails[idx] ? (
                          <Heart className="h-4 w-4 fill-primary-foreground text-primary-foreground" />
                        ) : (
                          <Mail className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <input
                        type="email"
                        value={emails[idx]}
                        onChange={(e) => handleEmailChange(idx, e.target.value)}
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
                onClick={handleSubmit}
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
};

export default ThankYouPage;
