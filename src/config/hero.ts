import type { HeroConfig } from "@/types";

export const heroConfig: HeroConfig = {
  title: {
    first: "Launch",
    second: "AI SaaS websites in minutes",
  },
  subtitle:
    "The best AI SaaS boilerplate, packed with AI, Payment, Blog, Authentication, Newsletter, SEO, Themes and more.",
  label: {
    text: "🎁 Special Gift - 50% OFF 🎁",
    href: "/#pricing",
    icon: "gift", 
    external: false,
  },
  primaryButton: {
    text: "Get Now",
    href: "/#pricing",
    icon: "rocket",
    variant: "default",
  },
  secondaryButton: {
    text: "Live Demo",
    href: "https://demo.mksaas.com",
    icon: "eye",
    variant: "outline",
  },
};