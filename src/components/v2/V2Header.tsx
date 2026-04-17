import { User } from "lucide-react";
import logoMe from "@/assets/logo-me.png";

const V2Header = () => (
  <header className="hidden md:block border-b border-border bg-background px-4 py-3">
    <div className="mx-auto flex max-w-7xl items-center justify-between">
      {/* Logo */}
      <a href="/" className="flex items-center gap-3">
        <img src={logoMe} alt="Maison 22 Esthétique" className="h-24 w-auto object-contain" />
      </a>

      {/* Center — intentionally empty for minimal look */}
      <div />

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
