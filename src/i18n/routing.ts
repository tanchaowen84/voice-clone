import { defineRouting } from "next-intl/routing";

export const LOCALES = ["en", "zh"];
export const DEFAULT_LOCALE = "en";
export const LOCALE_LIST: Record<string, string> = {
  en: "🇬🇧 English",
  zh: "🇨🇳 中文",
};

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
  },
});

export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];
