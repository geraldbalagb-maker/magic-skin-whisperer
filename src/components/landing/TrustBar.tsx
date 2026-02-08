import { Truck, ShieldCheck, CreditCard, Wand2, type LucideIcon } from "lucide-react";

interface TrustItem {
  icon: LucideIcon;
  label: string;
}

const defaultItems: TrustItem[] = [
  { icon: Truck, label: "Spedizione gratuita" },
  { icon: ShieldCheck, label: "Prodotti certificati" },
  { icon: CreditCard, label: "Pagamenti sicuri" },
  { icon: Wand2, label: "Routine AI personalizzata" },
];

interface TrustBarProps {
  items?: TrustItem[];
}

const TrustBar = ({ items = defaultItems }: TrustBarProps) => (
  <section className="border-t border-border bg-background px-6 py-12">
    <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-8 md:gap-16">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2.5">
          <item.icon className="h-5 w-5 text-primary" />
          <span className="font-body text-xs font-medium text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  </section>
);

export default TrustBar;
