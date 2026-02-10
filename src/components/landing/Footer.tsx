import MaisonLogo from "@/components/MaisonLogo";

const Footer = () => (
  <footer className="border-t border-border bg-foreground px-6 py-10">
    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
      <div className="flex items-center gap-3">
        <MaisonLogo variant="light" size="sm" />
        <span className="font-display text-sm font-semibold text-background">Maison 22 Esthétique</span>
      </div>
      <p className="font-body text-[11px] text-background/50">
        © 2026 Maison 22 Esthétique. Tutti i diritti riservati.
      </p>
      <div className="flex gap-4">
        <a href="https://www.maison22esthetique.it" target="_blank" rel="noopener noreferrer" className="font-body text-xs text-background/50 transition-colors hover:text-background">
          Sito ufficiale
        </a>
        <a href="#" className="font-body text-xs text-background/50 transition-colors hover:text-background">
          Privacy
        </a>
        <a href="#" className="font-body text-xs text-background/50 transition-colors hover:text-background">
          Contatti
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
