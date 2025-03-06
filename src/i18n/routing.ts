import { defineRouting } from "next-intl/routing";

export const LOCALE_LIST: Record<string, { flag: string; name: string }> = {
  en: { flag: "🇺🇸", name: "English" },
  zh: { flag: "🇨🇳", name: "中文" },
};
export const DEFAULT_LOCALE = "en";
export const LOCALES = Object.keys(LOCALE_LIST);

/**
 * Next.js internationalized routing
 * 
 * https://next-intl.dev/docs/routing
 */
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: LOCALES,
  // Default locale when no locale matches
  defaultLocale: DEFAULT_LOCALE,
  // Auto detect locale
  // https://next-intl.dev/docs/routing/middleware#locale-detection
  localeDetection: false,
  // The prefix to use for the locale in the URL
  // https://next-intl.dev/docs/routing#locale-prefix
  localePrefix: "as-needed",
  // The pathnames for each locale
  // https://next-intl.dev/docs/routing#pathnames
  pathnames: {
    "/": "/",
    "/blog": "/blog",
    "/blog/[...slug]": "/blog/[...slug]",
    "/blog/category/[slug]": "/blog/category/[slug]",
    // 认证相关路径
    "/auth/login": "/auth/login",
    "/auth/register": "/auth/register",
    "/auth/forgot-password": "/auth/forgot-password",
    "/auth/reset-password": "/auth/reset-password",
    "/auth/error": "/auth/error",
  },
});

export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];
