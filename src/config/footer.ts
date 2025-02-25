import type { FooterConfig } from "@/types";

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
      title: "Solution",
      items: [
        { title: "Blog", href: "/blog" },
        { title: "Documentation", href: "/docs", },
        { title: "Changelog", href: "/changelog" },
      ],
    },
    {
      title: "Company",
      items: [
        { title: "About Us", href: "/about" },
        { title: "Contact Us", href: "/contact" },
        { title: "Careers", href: "/careers" },
      ],
    },
    {
      title: "Legal",
      items: [
        { title: "Privacy Policy", href: "/privacy" },
        { title: "Cookie Policy", href: "/cookie" },
        { title: "Terms of Service", href: "/terms" },
      ],
    },
  ],
};
