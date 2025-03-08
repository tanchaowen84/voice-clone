import { getBaseUrl } from "@/lib/urls/get-base-url";
import type { SiteConfig } from "@/types";

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
  url: getBaseUrl(),
  image: `${getBaseUrl()}/og.png`,
  mail: "support@mksaas.com",
};
