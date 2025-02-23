import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { marketingConfig } from "@/config/marketing";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default async function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar scroll={true} config={marketingConfig} />

      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
}
