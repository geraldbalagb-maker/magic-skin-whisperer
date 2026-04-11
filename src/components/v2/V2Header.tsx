import { User } from "lucide-react";
import logoMe from "@/assets/logo-me.png";

const V2Header = () => (
  <header className="border-b border-border bg-background px-4 py-3">
    <div className="mx-auto flex max-w-7xl items-center justify-between">
      {/* Logo */}
      <a
        href="https://www.luxury-perfumes.net/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3"
      >
        <img src={logoMe} alt="Maison 22 Esthétique" className="h-20 w-auto object-contain md:h-24" />
      </a>

      {/* Center title */}
      <span className="hidden font-display text-sm font-semibold uppercase tracking-[0.2em] text-foreground md:block">
        Beauty Routine AI
      </span>

      {/* Right icons */}
      <div className="flex items-center gap-4">
        <a
          href="https://www.luxury-perfumes.net/mio-account/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground/70 transition-colors hover:text-foreground"
        >
          <User className="h-5 w-5" />
        </a>
      </div>
    </div>
  </header>
);

export default V2Header;
