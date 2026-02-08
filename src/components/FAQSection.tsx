import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Shield, Truck, RotateCcw, MessageCircle } from "lucide-react";

const faqs = [
  {
    q: "Come funziona l'analisi AI della pelle?",
    a: "La nostra intelligenza artificiale analizza il selfie che carichi insieme alle risposte del quiz per identificare il tuo tipo di pelle, le problematiche specifiche e le esigenze. Basandosi su un database di oltre 200 combinazioni di ingredienti attivi, crea una routine su misura con i prodotti più adatti.",
  },
  {
    q: "Quanto tempo ci vuole per vedere i risultati?",
    a: "I primi miglioramenti sono visibili già dopo 7-14 giorni di utilizzo costante. I risultati ottimali si raggiungono dopo 28 giorni, quando i principi attivi hanno completato un ciclo completo di rigenerazione cellulare. Il 98% delle nostre clienti riporta miglioramenti significativi entro il primo mese.",
  },
  {
    q: "Posso modificare la routine consigliata?",
    a: "Assolutamente sì! La routine AI è un punto di partenza ottimale, ma puoi aggiungere o rimuovere singoli prodotti dal carrello. Se hai dubbi su un prodotto specifico, il nostro beauty coach è disponibile per una consulenza personalizzata gratuita.",
  },
  {
    q: "Il bundle ha davvero uno sconto del 20%?",
    a: "Sì, lo sconto del 20% viene applicato automaticamente quando acquisti tutti i prodotti della tua routine personalizzata. È il nostro modo di premiare chi investe nella propria skincare completa. Lo sconto non è cumulabile con altre promozioni.",
  },
  {
    q: "Quali sono i tempi e costi di spedizione?",
    a: "La spedizione è gratuita per tutti gli ordini superiori a 49€ (e il bundle la include sempre). Consegna in 24-48 ore lavorative in tutta Italia. Spediamo anche in Europa con tempi di 3-5 giorni lavorativi.",
  },
  {
    q: "Posso restituire i prodotti se non sono soddisfatta?",
    a: "Offriamo una garanzia soddisfatti o rimborsati di 30 giorni. Se i prodotti non soddisfano le tue aspettative, puoi restituirli (anche parzialmente utilizzati) e ricevere un rimborso completo. Contattaci e ti guideremo nel processo.",
  },
  {
    q: "I prodotti sono testati dermatologicamente?",
    a: "Tutti i prodotti delle linee Rigenera, Xaikonix, Face+ Sensation e Face+ SeboKey sono dermatologicamente testati, formulati in Italia e privi di parabeni, siliconi e ingredienti aggressivi. Sono adatti anche alle pelli più sensibili.",
  },
];

const trustBadges = [
  {
    icon: Truck,
    title: "Spedizione Gratuita",
    desc: "Su ordini sopra 49€",
  },
  {
    icon: Shield,
    title: "Pagamento Sicuro",
    desc: "Crittografia SSL 256-bit",
  },
  {
    icon: RotateCcw,
    title: "Reso Gratuito",
    desc: "30 giorni soddisfatti o rimborsati",
  },
  {
    icon: MessageCircle,
    title: "Beauty Coach",
    desc: "Consulenza gratuita inclusa",
  },
];

const FAQSection = () => {
  return (
    <>
      {/* ─── FAQ ─── */}
      <section className="border-t border-border bg-background">
        <div className="mx-auto max-w-3xl px-4 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <span className="font-body text-[11px] font-medium uppercase tracking-[0.25em] text-primary">
              Domande frequenti
            </span>
            <h2 className="mt-3 font-display text-2xl font-bold text-foreground md:text-3xl">
              Hai qualche dubbio?
            </h2>
            <p className="mx-auto mt-3 max-w-md font-body text-sm text-muted-foreground">
              Trova le risposte alle domande più comuni sulla tua routine personalizzata.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-12"
          >
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="overflow-hidden rounded-2xl border border-border bg-card px-6 data-[state=open]:border-primary/15 data-[state=open]:shadow-sm"
                >
                  <AccordionTrigger className="py-5 font-display text-sm font-semibold text-foreground hover:no-underline md:text-base [&[data-state=open]]:text-primary">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 font-body text-sm leading-relaxed text-muted-foreground">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* ─── Trust Bar ─── */}
      <section className="border-t border-border bg-card/50">
        <div className="mx-auto max-w-5xl px-4 py-14">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {trustBadges.map((badge, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex flex-col items-center text-center"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/5">
                  <badge.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="mt-3 font-display text-sm font-semibold text-foreground">{badge.title}</p>
                <p className="mt-1 font-body text-[11px] text-muted-foreground">{badge.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="border-t border-border bg-gradient-cream">
        <div className="mx-auto max-w-2xl px-4 py-16 text-center md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
              La tua pelle merita il meglio.
            </h2>
            <p className="mx-auto mt-3 max-w-md font-body text-sm text-muted-foreground">
              Unisciti a oltre 15.000 donne che hanno già scoperto la propria routine ideale con l'aiuto dell'intelligenza artificiale.
            </p>
            <p className="mt-6 font-body text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Formulato in Italia 🇮🇹 · Dermatologicamente testato · Cruelty free
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default FAQSection;
