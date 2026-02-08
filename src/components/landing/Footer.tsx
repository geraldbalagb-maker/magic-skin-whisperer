const Footer = () => (
  <footer className="border-t border-border bg-secondary/30 px-6 py-10">
    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
      <div className="flex items-center gap-2">
        <span className="font-display text-sm font-semibold text-foreground">Luxury Perfumes</span>
      </div>
      <p className="font-body text-[11px] text-muted-foreground">
        © 2026 Luxury Perfumes. Tutti i diritti riservati.
      </p>
      <div className="flex gap-4">
        <a href="https://www.luxury-perfumes.net" target="_blank" rel="noopener noreferrer" className="font-body text-xs text-muted-foreground transition-colors hover:text-foreground">
          Shop
        </a>
        <a href="#" className="font-body text-xs text-muted-foreground transition-colors hover:text-foreground">
          Privacy
        </a>
        <a href="#" className="font-body text-xs text-muted-foreground transition-colors hover:text-foreground">
          Contatti
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
