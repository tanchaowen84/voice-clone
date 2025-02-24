import type { Icons } from "@/components/icons/icons";

/**
 * utm parameters
 * https://utmbuilder.com/
 */
export type SiteConfig = {
  name: string;
  title: string;
  tagline: string;
  description: string;
  keywords: string[];
  author: string;
  url: string;
  image: string;
  mail: string;
  links: {
    github?: string;
    twitter?: string;
    twitter_cn?: string;
    bluesky?: string;
    youtube?: string;
    docs?: string;
    demo?: string;
    studio?: string;
    showcase?: string;
  };
};

export type HeroConfig = {
  title: {
    first: string;
    second: string;
  };
  subtitle: string;
  label: {
    text: string;
    icon: keyof typeof Icons;
    href: string;
    external: boolean;
  };
  primaryButton: {
    text: string;
    icon: keyof typeof Icons;
    href: string;
    variant: "default" | "outline";
  };
  secondaryButton: {
    text: string;
    icon: keyof typeof Icons;
    href: string;
    variant: "default" | "outline";
  };
};

export type MarketingConfig = {
  menus: NavItem[];
};

export type DashboardConfig = {
  menus: NavItem[];
};

export type UserButtonConfig = {
  menus: NavItem[];
};

export type FooterConfig = {
  links: NestedNavItem[];
};

export type NavItem = {
  title: string;
  href: string;
  badge?: number;
  disabled?: boolean;
  external?: boolean;
  authorizeOnly?: UserRole;
  icon?: keyof typeof Icons;
};

export type NestedNavItem = {
  title: string;
  items: NavItem[];
  authorizeOnly?: UserRole;
  icon?: keyof typeof Icons;
};

export type PriceConfig = {
  plans: PricePlan[];
};

export type PricePlan = {
  title: string;
  description: string;
  benefits: string[];
  limitations: string[];
  price: number;
  originalPrice?: number;
  stripePriceId: string | null;
};

export type FAQConfig = {
  items: FAQItem[];
};

export type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

export type TemplateConfig = {
  plans: PricePlan[];
};

// landing sections
export type MkdirsInfoLdg = {
  title: string;
  images: string[];
  description: string;
  list: InfoList[];
  button?: {
    text: string;
    icon: keyof typeof Icons;
    href: string;
    variant: "default" | "outline";
  };
};

export type InfoList = {
  icon: keyof typeof Icons;
  title: string;
  description: string;
};

export type InfoLdg = {
  title: string;
  image: string;
  description: string;
  list: InfoList[];
};

export type PoweredLdg = {
  title: string;
  description: string;
  link: string;
  icon: keyof typeof Icons;
};

export type FeatureLdg = {
  title: string;
  description: string;
  link: string;
  icon: keyof typeof Icons;
};

export type TestimonialType = {
  name: string;
  job: string;
  image: string;
  review: string;
};
