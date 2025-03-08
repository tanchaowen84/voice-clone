import { AppInfo } from "@/constants/app-info";
import { Locale, LOCALE_COOKIE_NAME, routing } from "@/i18n/routing";
import { type ClassValue, clsx } from "clsx";
import { parse as parseCookies } from "cookie";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Creates a title for the page
 * @param title - The title of the page
 * @param addSuffix - Whether to add the app name as a suffix
 * @returns The title for the page
 */
export function createTitle(title: string, addSuffix: boolean = true): string {
  if (!addSuffix) {
    return title;
  }
  if (!title) {
    return AppInfo.APP_NAME;
  }

  return `${title} | ${AppInfo.APP_NAME}`;
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
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}/${month}/${day}`;
}

/**
 * Gets the locale from a request by parsing the cookies
 * If no locale is found in the cookies, returns the default locale
 * 
 * @param request - The request to get the locale from
 * @returns The locale from the request or the default locale
 */
export const getLocaleFromRequest = (request?: Request) => {
  const cookies = parseCookies(request?.headers.get("cookie") ?? "");
  return (
    (cookies[LOCALE_COOKIE_NAME] as Locale) ??
    routing.defaultLocale
  );
};