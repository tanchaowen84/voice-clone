import { LOCALE_COOKIE_NAME, routing } from '@/i18n/routing';
import { shouldAppendLocale } from '@/lib/urls/get-base-url';
import { type ClassValue, clsx } from 'clsx';
import { parse as parseCookies } from 'cookie';
import { Locale } from 'next-intl';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Gets the initials of a name used for avatar placeholders display in UIs.
 *
 * This function extracts initials from a name by:
 * - Taking first letters of up to 2 words
 * - Converting them to uppercase
 * - Joining them together
 *
 * Examples:
 * "John Doe" → "JD"
 * "Alice Bob Charles" → "AB" (only first 2 words)
 * "jane" → "J"
 * "John Doe" → "JD" (handles multiple spaces)
 *
 * @param name - The name to get the initials of
 * @returns The initials of the name
 */
export function getInitials(name: string): string {
  if (!name) {
    return '';
  }
  return name
    .replace(/\s+/, ' ')
    .split(' ')
    .slice(0, 2)
    .map((v) => v && v[0].toUpperCase())
    .join('');
}

/**
 * get locale date string, like "2024/10/01"
 */
export function getLocaleDate(input: string | number): string {
  const date = new Date(input);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}/${month}/${day}`;
}

/**
 * Gets the locale from a request by parsing the cookies
 * If no locale is found in the cookies, returns the default locale
 *
 * @param request - The request to get the locale from
 * @returns The locale from the request or the default locale
 */
export function getLocaleFromRequest(request?: Request): Locale {
  const cookies = parseCookies(request?.headers.get('cookie') ?? '');
  return (cookies[LOCALE_COOKIE_NAME] as Locale) ?? routing.defaultLocale;
}

/**
 * Estimates the reading time of a text
 *
 * @param text - The text to estimate the reading time of
 * @param wordsPerMinute - The number of words per minute to use for the estimate
 * @returns The estimated reading time
 */
export function estimateReadingTime(
  text: string,
  wordsPerMinute: number = 250
): string {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes === 1 ? '1 minute read' : `${minutes} minutes read`;
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
export function addLocaleToUrl(url: string, locale: Locale): string {
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
  } catch (e) {
    // If URL parsing fails, return the original URL
    console.warn('Failed to parse URL for locale insertion:', url, e);
    return url;
  }
}
