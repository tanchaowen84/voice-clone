import { websiteConfig } from '@/config/website';
import { ResendNewsletterProvider } from './provider/resend';
import type { NewsletterProvider } from './types';

/**
 * Global newsletter provider instance
 */
let newsletterProvider: NewsletterProvider | null = null;

/**
 * Get the newsletter provider
 * @returns current newsletter provider instance
 */
export const getNewsletterProvider = (): NewsletterProvider => {
  if (!newsletterProvider) {
    return initializeNewsletterProvider();
  }
  return newsletterProvider;
};

/**
 * Initialize the newsletter provider
 * @returns initialized newsletter provider
 */
export const initializeNewsletterProvider = (): NewsletterProvider => {
  if (!newsletterProvider) {
    if (websiteConfig.newsletter.provider === 'resend') {
      newsletterProvider = new ResendNewsletterProvider();
    } else {
      throw new Error(
        `Unsupported newsletter provider: ${websiteConfig.newsletter.provider}`
      );
    }
  }

  return newsletterProvider;
};

/**
 * Subscribe a user to the newsletter
 * @param email The email address to subscribe
 * @returns True if the subscription was successful, false otherwise
 */
export const subscribe = async (email: string): Promise<boolean> => {
  const provider = getNewsletterProvider();
  return provider.subscribe({ email });
};

/**
 * Unsubscribe a user from the newsletter
 * @param email The email address to unsubscribe
 * @returns True if the unsubscription was successful, false otherwise
 */
export const unsubscribe = async (email: string): Promise<boolean> => {
  const provider = getNewsletterProvider();
  return provider.unsubscribe({ email });
};

/**
 * Check if a user is subscribed to the newsletter
 * @param email The email address to check
 * @returns True if the user is subscribed, false otherwise
 */
export const isSubscribed = async (email: string): Promise<boolean> => {
  const provider = getNewsletterProvider();
  return provider.checkSubscribeStatus({ email });
};
