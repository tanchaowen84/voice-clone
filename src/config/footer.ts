import type { FooterConfig } from "@/types";
import { siteConfig } from "./site";

export const footerConfig: FooterConfig = {
  links: [
    {
      title: "Product",
      items: [
        { title: "Features", href: "/#features" },
        { title: "Pricing", href: "/#pricing" },
        { title: "FAQ", href: "/#faq" },
      ],
    },
    {
      title: "Resources",
      items: [
        { title: "Showcase", href: "/showcase" },
        { title: "Blog", href: "/blog" },
        { title: "Documentation", href: "/docs", },
      ],
    },
    {
      title: "Support",
      items: [
        ...(siteConfig.links.twitter ? [{ title: "Twitter", href: siteConfig.links.twitter, external: true }] : []),
        ...(siteConfig.links.bluesky ? [{ title: "Bluesky", href: siteConfig.links.bluesky, external: true }] : []),
        ...(siteConfig.links.youtube ? [{ title: "Youtube", href: siteConfig.links.youtube, external: true }] : []),
      ],
    },
    {
      title: "Company",
      items: [
        { title: "About Us", href: "/about" },
        { title: "Privacy Policy", href: "/privacy" },
        { title: "Terms of Service", href: "/terms" },
      ],
    },
  ],
};
