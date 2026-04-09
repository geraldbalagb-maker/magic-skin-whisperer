import { Truck, ShieldCheck, CreditCard, Sparkles } from "lucide-react";

const items = [
  { icon: Truck, label: "Spedizione gratuita" },
  { icon: ShieldCheck, label: "Prodotti certificati" },
  { icon: CreditCard, label: "Pagamenti sicuri" },
  { icon: Sparkles, label: "Routine AI personalizzata" },
];

const V2TrustBar = () => (
  <section className="border-t border-border bg-background px-6 py-10">
    <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-8 md:gap-14">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <item.icon className="h-4 w-4 text-[hsl(34_55%_54%)]" />
          <span className="font-body text-xs text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  </section>
);

export default V2TrustBar;
