import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/marketing/navbar";
import { marketingConfig } from "@/config/marketing";
import { setRequestLocale } from "next-intl/server";

interface MarketingLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function MarketingLayout({
  children,
  params
}: MarketingLayoutProps) {
  const { locale } = params;

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar scroll={true} config={marketingConfig} />

      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
}
