import BrandHeader from "./BrandHeader";
import BrandFooter from "./BrandFooter";

interface PageShellProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  headerCenterLabel?: string;
}

const PageShell = ({
  children,
  showHeader = true,
  showFooter = true,
  headerCenterLabel,
}: PageShellProps) => (
  <div className="flex min-h-screen flex-col bg-background">
    {showHeader && <BrandHeader centerLabel={headerCenterLabel} />}
    <main className="flex-1">{children}</main>
    {showFooter && <BrandFooter />}
  </div>
);

export default PageShell;
