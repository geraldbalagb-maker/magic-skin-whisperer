import logoPng from "@/assets/logo-maison22.png";
import logoWhite from "@/assets/logo-maison22-white.png";

interface MaisonLogoProps {
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "h-10 w-10",
  md: "h-14 w-14",
  lg: "h-20 w-20",
};

const MaisonLogo = ({ variant = "dark", size = "md", className = "" }: MaisonLogoProps) => {
  const logo = variant === "light" ? logoWhite : logoPng;

  return (
    <img
      src={logo}
      alt="Maison 22 Esthétique"
      className={`${sizes[size]} object-cover rounded-full ${className}`}
    />
  );
};

export default MaisonLogo;
