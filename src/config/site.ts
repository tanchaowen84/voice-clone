import type { SiteConfig } from "@/types";

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export const siteConfig: SiteConfig = {
  name: "MkSaaS",
  title: "MkSaaS - The Best AI SaaS Boilerplate",
  tagline:
    "Make AI SaaS in hours, simply and effortlessly",
  description:
    "MkSaaS is the best AI SaaS boilerplate. Make AI SaaS in hours, simply and effortlessly",
  keywords: [
    "SaaS",
    "SaaS Website",
    "SaaS Website Template",
    "SaaS Website Boilerplate",
    "SaaS Website Builder",
  ],
  author: "MkSaaS",
  url: SITE_URL ?? "",
  image: `${SITE_URL}/og.png`,
  mail: "support@mksaas.com",
  links: {
    twitter: "https://x.com/javay_hu",
    bluesky: "https://bsky.app/profile/javayhu.com",
    github: "https://github.com/MkSaaSHQ",
    youtube: "https://www.youtube.com/@MkSaaSHQ",
    docs: "https://docs.mksaas.com",
    demo: "https://demo.mksaas.com",
    studio: "https://demo.mksaas.com/studio",
    showcase: "https://mksaas.com/showcase",
  },
};
