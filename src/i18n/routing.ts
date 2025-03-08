import { defineRouting } from "next-intl/routing";

export const LOCALE_LIST: Record<string, { flag: string; name: string }> = {
  en: { flag: "🇺🇸", name: "English" },
  zh: { flag: "🇨🇳", name: "中文" },
};
export const DEFAULT_LOCALE = "en";
export const LOCALES = Object.keys(LOCALE_LIST);

// The name of the cookie that is used to determine the locale
export const LOCALE_COOKIE_NAME = "NEXT_LOCALE";

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
  // Once a locale is detected, it will be remembered for 
  // future requests by being stored in the NEXT_LOCALE cookie.
  localeCookie: {
    name: LOCALE_COOKIE_NAME,
  },
  // The prefix to use for the locale in the URL
  // https://next-intl.dev/docs/routing#locale-prefix
  localePrefix: "as-needed",
  // The pathnames for each locale
  // https://next-intl.dev/docs/routing#pathnames
  // 
  // https://next-intl.dev/docs/routing/navigation#link
  // if we set pathnames, we need to use pathname in LocaleLink
  // pathnames: {
  //   // used in sietmap.ts
  //   "/": "/",
  //   // used in blog pages
  //   "/blog/[...slug]": "/blog/[...slug]",
  //   "/blog/category/[slug]": "/blog/category/[slug]",
  // },
});

// export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];
