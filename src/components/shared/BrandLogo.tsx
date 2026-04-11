import logoMe from "@/assets/logo-me.png";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "h-12 w-auto",
  md: "h-16 w-auto",
  lg: "h-24 w-auto",
};

const BrandLogo = ({ size = "md", className = "" }: BrandLogoProps) => (
  <img
    src={logoMe}
    alt="Maison 22 Esthétique"
    className={`${sizes[size]} object-contain ${className}`}
  />
);

export default BrandLogo;
