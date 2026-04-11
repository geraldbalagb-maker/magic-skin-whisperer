interface BrandCardProps {
  children: React.ReactNode;
  className?: string;
}

const BrandCard = ({ children, className = "" }: BrandCardProps) => (
  <div
    className={`rounded-lg border border-border bg-card p-6 shadow-elegant transition-shadow hover:shadow-elevated ${className}`}
  >
    {children}
  </div>
);

export default BrandCard;
