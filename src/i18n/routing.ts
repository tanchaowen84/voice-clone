import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "de", "zh"],
  defaultLocale: "en",
  pathnames: {
    "/": "/",
  }
});

export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];
