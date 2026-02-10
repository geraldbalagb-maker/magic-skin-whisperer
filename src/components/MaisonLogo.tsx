import logoBlack from "@/assets/logo-maison22.jpg";
import logoWhite from "@/assets/logo-maison22-white.png";

interface MaisonLogoProps {
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg";
  circular?: boolean;
  className?: string;
}

const sizes = {
  sm: "h-10 w-10",
  md: "h-14 w-14",
  lg: "h-20 w-20",
};

const MaisonLogo = ({ variant = "dark", size = "md", circular = false, className = "" }: MaisonLogoProps) => {
  const logo = variant === "light" ? logoWhite : logoBlack;

  if (circular) {
    return (
      <div className={`${sizes[size]} overflow-hidden rounded-full bg-foreground flex items-center justify-center ${className}`}>
        <img src={logoWhite} alt="Maison 22 Esthétique" className="h-[70%] w-[70%] object-contain" />
      </div>
    );
  }

  return (
    <img
      src={logo}
      alt="Maison 22 Esthétique"
      className={`${sizes[size]} object-contain ${className}`}
    />
  );
};

export default MaisonLogo;
