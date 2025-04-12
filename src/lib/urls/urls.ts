import { routing } from "@/i18n/routing";
import { Locale } from "next-intl";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ??
  `http://localhost:${process.env.PORT ?? 3000}`;

/**
 * Get the base URL of the application
 */
export function getBaseUrl(): string {
  return baseUrl;
}

/**
 * Check if the locale should be appended to the URL
 */
export function shouldAppendLocale(locale?: Locale | null): boolean {
  return !!locale && locale !== routing.defaultLocale && locale !== 'default';
}

/**
 * Get the base URL of the application with the locale appended
 */
export function getBaseUrlWithLocale(locale?: Locale | null): string {
  return shouldAppendLocale(locale) ? `${baseUrl}/${locale}` : baseUrl;
}

/**
 * Adds locale to the callbackURL parameter in authentication URLs
 * 
 * Example:
 * Input: http://localhost:3000/api/auth/reset-password/token?callbackURL=/auth/reset-password
 * Output: http://localhost:3000/api/auth/reset-password/token?callbackURL=/zh/auth/reset-password
 * 
 * http://localhost:3000/api/auth/verify-email?token=eyJhbGciOiJIUzI1NiJ9&callbackURL=/dashboard
 * Output: http://localhost:3000/api/auth/verify-email?token=eyJhbGciOiJIUzI1NiJ9&callbackURL=/zh/dashboard
 * 
 * @param url - The original URL with callbackURL parameter
 * @param locale - The locale to add to the callbackURL
 * @returns The URL with locale added to callbackURL if necessary
 */
export function getUrlWithLocaleInCallbackUrl(url: string, locale: Locale): string {
  // If we shouldn't append locale, return original URL
  if (!shouldAppendLocale(locale)) {
    return url;
  }

  try {
    // Parse the URL
    const urlObj = new URL(url);
    
    // Check if there's a callbackURL parameter
    const callbackURL = urlObj.searchParams.get('callbackURL');
    
    if (callbackURL) {
      // Only modify the callbackURL if it doesn't already include the locale
      if (!callbackURL.match(new RegExp(`^/${locale}(/|$)`))) {
        // Add locale to the callbackURL
        const localizedCallbackURL = callbackURL.startsWith('/') 
          ? `/${locale}${callbackURL}` 
          : `/${locale}/${callbackURL}`;
          
        // Update the search parameter
        urlObj.searchParams.set('callbackURL', localizedCallbackURL);
      }
    }
    
    return urlObj.toString();
  } catch (error) {
    // If URL parsing fails, return the original URL
    console.warn('Failed to parse URL for locale insertion:', url, error);
    return url;
  }
}
