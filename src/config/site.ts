import type { SiteConfig } from "@/types";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const siteConfig: SiteConfig = {
  name: "MkSaaS",
  title: "MkSaaS - The Best AI SaaS Boilerplate",
  tagline:
    "Launch AI SaaS Websites in hours, simply and effortlessly",
  description:
    "MkSaaS is the best AI SaaS boilerplate. Launch AI SaaS websites in hours, simply and effortlessly",
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
  utm: {
    source: "mksaas.com",
    medium: "referral",
    campaign: "navigation",
  },
  links: {
    twitter: "https://x.com/javay_hu",
    bluesky: "https://bsky.app/profile/javayhu.com",
    github: "https://github.com/MkSaaS",
    youtube: "https://www.youtube.com/@MkSaaS",
    docs: "https://docs.mksaas.com",
    demo: "https://demo.mksaas.com",
    studio: "https://demo.mksaas.com/studio",
    showcase: "https://mksaas.com/showcase",
  },
};
