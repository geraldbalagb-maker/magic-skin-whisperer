import { Truck, ShieldCheck, Lock, Sparkles } from "lucide-react";

const items = [
  { icon: Truck, label: "Spedizione gratuita", sub: "su tutti gli ordini" },
  { icon: ShieldCheck, label: "Prodotti certificati", sub: "qualità garantita" },
  { icon: Lock, label: "Pagamenti sicuri", sub: "transazioni protette" },
  { icon: Sparkles, label: "Routine AI", sub: "100% personalizzata" },
];

const V2TrustBar = () => (
  <section className="border-t border-border bg-background px-6 py-16 md:py-20">
    <div className="mx-auto grid max-w-6xl grid-cols-2 gap-10 md:grid-cols-4 md:gap-8">
      {items.map((item) => (
        <div key={item.label} className="flex flex-col items-center text-center">
          <item.icon
            className="h-9 w-9 text-foreground md:h-10 md:w-10"
            strokeWidth={1.25}
          />
          <span className="mt-4 font-display text-lg font-normal text-foreground md:text-xl">
            {item.label}
          </span>
          <span className="mt-1 font-body text-xs uppercase tracking-[0.2em] text-muted-foreground md:text-[0.7rem]">
            {item.sub}
          </span>
        </div>
      ))}
    </div>
  </section>
);

export default V2TrustBar;
