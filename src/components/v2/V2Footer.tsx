import logoMe from "@/assets/logo-me.png";

const V2Footer = () => (
  <footer className="border-t border-border bg-background px-6 py-12">
    <div className="mx-auto max-w-7xl">
      <div className="grid gap-10 md:grid-cols-4">
        {/* Col 1 — Logo + Social */}
        <div>
          <img src={logoMe} alt="Maison 22 Esthétique" className="mb-4 h-16 w-auto object-contain" />
          <div className="flex gap-3">
            {["facebook", "instagram", "youtube", "linkedin"].map((social) => (
              <a
                key={social}
                href={`https://www.luxury-perfumes.net/`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-xs capitalize text-muted-foreground transition-colors hover:text-foreground"
              >
                {social.charAt(0).toUpperCase()}
              </a>
            ))}
          </div>
        </div>

        {/* Col 2 — Informazioni */}
        <div>
          <h4 className="mb-3 font-display text-xs font-bold uppercase tracking-wider text-foreground">
            Informazioni
          </h4>
          <ul className="space-y-2">
            {[
              { label: "Chi siamo", href: "https://www.luxury-perfumes.net/" },
              { label: "Spedizioni", href: "https://www.luxury-perfumes.net/spedizioni" },
              { label: "Resi e Rimborsi", href: "https://www.luxury-perfumes.net/" },
            ].map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 — Contatti */}
        <div>
          <h4 className="mb-3 font-display text-xs font-bold uppercase tracking-wider text-foreground">
            Contatti
          </h4>
          <ul className="space-y-2">
            <li>
              <a
                href="https://www.luxury-perfumes.net/contatti/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Contattaci
              </a>
            </li>
          </ul>
        </div>

        {/* Col 4 — Metodi di pagamento */}
        <div>
          <h4 className="mb-3 font-display text-xs font-bold uppercase tracking-wider text-foreground">
            Metodi di pagamento
          </h4>
          <div className="flex flex-wrap gap-2">
            {["Visa", "Mastercard", "PayPal", "Scalapay"].map((method) => (
              <span
                key={method}
                className="rounded border border-border px-2.5 py-1 font-body text-[10px] font-medium text-muted-foreground"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-10 border-t border-border pt-6 text-center">
        <p className="font-body text-[11px] text-muted-foreground">
          © 2026 Luxury Perfumes / Maison 22 Esthétique. Tutti i diritti riservati.
        </p>
      </div>
    </div>
  </footer>
);

export default V2Footer;
