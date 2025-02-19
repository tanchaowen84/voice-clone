import { AppInfo } from "@/app/constants/app-info";
import { type ClassValue, clsx } from "clsx";
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
