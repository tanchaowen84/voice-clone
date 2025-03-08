import { marketingConfig } from "@/config/marketing";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar scroll={true} config={marketingConfig} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}