import { routing } from "@/i18n/routing";
import { Locale } from "next-intl";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ??
  `http://localhost:${process.env.PORT ?? 3000}`;

// TODO: fix all the places that use this function
export function getBaseUrl(): string {
  return baseUrl;
}

export function shouldAppendLocale(locale?: Locale | null): boolean {
  return !!locale && locale !== routing.defaultLocale && locale !== 'default';
}

export function getBaseUrlWithLocale(locale?: Locale | null): string {
  return shouldAppendLocale(locale) ? `${baseUrl}/${locale}` : baseUrl;
}
