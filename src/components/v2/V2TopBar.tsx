import { Truck } from "lucide-react";

const V2TopBar = () => (
  <div className="bg-[hsl(0_0%_12%)] px-4 py-2">
    <div className="mx-auto flex max-w-7xl items-center justify-between">
      <div className="flex items-center gap-1.5 text-[hsl(0_0%_90%)]">
        <Truck className="h-3.5 w-3.5" />
        <a
          href="https://www.luxury-perfumes.net/spedizioni"
          target="_blank"
          rel="noopener noreferrer"
          className="font-body text-[11px]"
        >
          Gratuita con ordine minimo di 70€
        </a>
      </div>
      <div className="hidden items-center gap-4 sm:flex">
        <a
          href="https://www.luxury-perfumes.net/mio-account/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-body text-[11px] text-[hsl(0_0%_90%)] transition-colors hover:text-white"
        >
          MIO ACCOUNT
        </a>
        <a
          href="https://www.luxury-perfumes.net/contatti/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-body text-[11px] text-[hsl(0_0%_90%)] transition-colors hover:text-white"
        >
          CONTATTI
        </a>
        <a
          href="https://www.luxury-perfumes.net/spedizioni"
          target="_blank"
          rel="noopener noreferrer"
          className="font-body text-[11px] text-[hsl(0_0%_90%)] transition-colors hover:text-white"
        >
          SPEDIZIONI
        </a>
      </div>
    </div>
  </div>
);

export default V2TopBar;
