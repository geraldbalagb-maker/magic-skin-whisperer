import { User, ShoppingCart } from "lucide-react";
import logoMe from "@/assets/logo-me.png";

interface BrandHeaderProps {
  showNav?: boolean;
  centerLabel?: string;
}

const BrandHeader = ({ showNav = true, centerLabel = "Beauty Routine AI" }: BrandHeaderProps) => (
  <header className="border-b border-border bg-background px-4 py-3">
    <div className="mx-auto flex max-w-7xl items-center justify-between">
      <a
        href="https://www.luxury-perfumes.net/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3"
      >
        <img src={logoMe} alt="Maison 22 Esthétique" className="h-20 w-auto object-contain md:h-24" />
      </a>

      {centerLabel && (
        <span className="hidden font-display text-sm font-semibold uppercase tracking-[0.2em] text-foreground md:block">
          {centerLabel}
        </span>
      )}

      {showNav && (
        <div className="flex items-center gap-4">
          <a
            href="https://www.luxury-perfumes.net/mio-account/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/70 transition-colors hover:text-foreground"
          >
            <User className="h-5 w-5" />
          </a>
          <a
            href="https://www.luxury-perfumes.net/carrello/"
            target="_blank"
            rel="noopener noreferrer"
            className="relative text-foreground/70 transition-colors hover:text-foreground"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[9px] font-bold text-background">
              0
            </span>
          </a>
        </div>
      )}
    </div>
  </header>
);

export default BrandHeader;
