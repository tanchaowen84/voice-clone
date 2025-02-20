import type { SiteConfig } from "@/types";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const siteConfig: SiteConfig = {
  name: "Mkdirs",
  title: "Mkdirs - The Best Directory Boilerplate with AI",
  tagline:
    "Launch AI-powered directory websites in minutes, simply and effortlessly",
  description:
    "Mkdirs is the best directory website boilerplate with AI. Launch AI-powered directory websites in minutes, simply and effortlessly",
  keywords: [
    "Directory",
    "Directory Website",
    "Directory Website Template",
    "Directory Website Boilerplate",
    "Directory Website Builder",
  ],
  author: "Mkdirs",
  url: SITE_URL ?? "",
  image: `${SITE_URL}/og.png?v=20250119`,
  mail: "support@mkdirs.com",
  utm: {
    source: "mkdirs.com",
    medium: "referral",
    campaign: "navigation",
  },
  links: {
    twitter: "https://x.com/javay_hu",
    bluesky: "https://bsky.app/profile/javayhu.com",
    github: "https://github.com/MkdirsHQ",
    youtube: "https://www.youtube.com/@MkdirsHQ",
    docs: "https://docs.mkdirs.com",
    demo: "https://demo.mkdirs.com",
    studio: "https://demo.mkdirs.com/studio",
    showcase: "https://mkdirs.com/showcase",
  },
};
