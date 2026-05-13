import logoMe from "@/assets/logo-me.png";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  /** Inverte il colore del logo (usalo su sfondi scuri) */
  invert?: boolean;
}

const sizes = {
  sm: "h-16 w-auto",
  md: "h-20 w-auto",
  lg: "h-28 w-auto",
};

const BrandLogo = ({ size = "md", className = "", invert = false }: BrandLogoProps) => (
  <img
    src={logoMe}
    alt="Maison 22 Esthétique"
    className={`${sizes[size]} object-contain ${invert ? "invert brightness-0" : ""} ${className}`}
    style={invert ? { filter: "invert(1) brightness(2)" } : undefined}
  />
);

export default BrandLogo;

