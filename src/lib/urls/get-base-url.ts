// import { DEFAULT_LOCALE } from '@/lib/i18n/locale';

const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL ??
  `http://localhost:${process.env.PORT ?? 3000}`;

export function getBaseUrl(): string {
  return baseUrl;
}

// export function shouldAppendLocale(locale?: string | null): boolean {
//   return !!locale && locale !== DEFAULT_LOCALE && locale !== 'default';
// }

// export function getBaseUrl(locale?: string | null): string {
//   return shouldAppendLocale(locale) ? `${baseUrl}/${locale}` : baseUrl;
// }