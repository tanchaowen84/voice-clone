import { ResendNewsletterProvider } from './provider/resend';
import {
  CheckSubscribeStatusProps,
  NewsletterConfig,
  NewsletterProvider,
  SubscribeNewsletterP,
  UnsubscribeNewsletterProps
} from './types';

// Re-export types for convenience
export type {
  NewsletterProvider,
  NewsletterConfig,
  SubscribeNewsletterP as SubscribeNewsletterProps,
  UnsubscribeNewsletterProps,
  CheckSubscribeStatusProps
};

// Export provider implementation
export { ResendNewsletterProvider } from './provider/resend';

/**
 * Global newsletter provider instance
 */
let newsletterProvider: NewsletterProvider | null = null;

/**
 * Initialize the newsletter provider
 * @returns initialized newsletter provider
 */
export const initializeNewsletterProvider = (config?: NewsletterConfig): NewsletterProvider => {
  if (newsletterProvider) {
    return newsletterProvider;
  }

  // If no config is provided, use environment variables
  const resendApiKey = process.env.RESEND_API_KEY;
  const resendAudienceId = process.env.RESEND_AUDIENCE_ID;
  
  if (config?.resend) {
    newsletterProvider = new ResendNewsletterProvider(
      config.resend.apiKey,
      config.resend.audienceId
    );
  } else if (resendApiKey && resendAudienceId) {
    newsletterProvider = new ResendNewsletterProvider(
      resendApiKey,
      resendAudienceId
    );
  } else {
    // Default for development/testing
    const testApiKey = 'test_api_key';
    const testAudienceId = 'test_audience_id';
    newsletterProvider = new ResendNewsletterProvider(testApiKey, testAudienceId);
    
    if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'development') {
      console.warn(
        'Using Resend with test credentials. This should only happen in development/test environments.'
      );
    }
  }
  
  return newsletterProvider;
};

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

/**
 * Create a newsletter provider based on the specified type
 * @param type The provider type
 * @param config The provider configuration
 * @returns A configured newsletter provider instance
 */
export const createNewsletterProvider = (
  type: string,
  config: Record<string, any>
): NewsletterProvider => {
  switch (type.toLowerCase()) {
    case 'resend':
      return new ResendNewsletterProvider(
        config.apiKey,
        config.audienceId
      );
    default:
      throw new Error(`Unsupported newsletter provider type: ${type}`);
  }
};