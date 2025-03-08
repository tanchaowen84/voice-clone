import type { FooterConfig } from "@/types";
import { Routes } from "@/routes";

export const footerConfig: FooterConfig = {
  links: [
    {
      title: "Product",
      items: [
        { title: "Features", href: Routes.Features },
        { title: "Pricing", href: Routes.Pricing },
        { title: "FAQ", href: Routes.FAQ },
      ],
    },
    {
      title: "Resources",
      items: [
        { title: "Blog", href: Routes.Blog },
        { title: "Changelog", href: Routes.Changelog },
        { title: "Roadmap", href: Routes.Roadmap },
      ],
    },
    {
      title: "Company",
      items: [
        { title: "Waitlist", href: Routes.Waitlist },
        { title: "About Us", href: Routes.About },
        { title: "Contact Us", href: Routes.Contact },
      ],
    },
    {
      title: "Legal",
      items: [
        { title: "Cookie Policy", href: Routes.CookiePolicy },
        { title: "Privacy Policy", href: Routes.PrivacyPolicy },
        { title: "Terms of Service", href: Routes.TermsOfService },
      ],
    },
  ],
};
