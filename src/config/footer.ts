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
      title: "Resources",
      items: [
        { title: "Blog", href: "/blog" },
        { title: "Documentation", href: "/docs", },
        { title: "Changelog", href: "/changelog" },
      ],
    },
    {
      title: "Company",
      items: [
        { title: "Waitlist", href: "/waitlist" },
        { title: "About Us", href: "/about" },
        { title: "Contact Us", href: "/contact" },
      ],
    },
    {
      title: "Legal",
      items: [
        { title: "Cookie Policy", href: "/cookie" },
        { title: "Privacy Policy", href: "/privacy" },
        { title: "Terms of Service", href: "/terms" },
      ],
    },
  ],
};
