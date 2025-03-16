'use server';

import {
  subscribe as subscribeToNewsletter,
  unsubscribe as unsubscribeFromNewsletter,
  isSubscribed as checkIsSubscribed
} from '@/newsletter';
import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';

// Create a safe action client
const actionClient = createSafeActionClient();

// Newsletter schema for validation
const newsletterSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

// Create a safe action for newsletter subscription
export const subscribeAction = actionClient
  .schema(newsletterSchema)
  .action(async ({ parsedInput: { email } }) => {
    try {
      const subscribed = await subscribeToNewsletter(email);

      if (!subscribed) {
        console.error('Failed to subscribe to the newsletter', email);
        return {
          success: false,
          error: 'Failed to subscribe to the newsletter',
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    }
  });

// Create a safe action for newsletter unsubscription
export const unsubscribeAction = actionClient
  .schema(newsletterSchema)
  .action(async ({ parsedInput: { email } }) => {
    try {
      const unsubscribed = await unsubscribeFromNewsletter(email);

      if (!unsubscribed) {
        console.error('Failed to unsubscribe from the newsletter', email);
        return {
          success: false,
          error: 'Failed to unsubscribe from the newsletter',
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      console.error('Newsletter unsubscription error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    }
  });

// Create a safe action to check if a user is subscribed to the newsletter
export const isSubscribedAction = actionClient
  .schema(newsletterSchema)
  .action(async ({ parsedInput: { email } }) => {
    try {
      const subscribed = await checkIsSubscribed(email);
      
      return {
        success: true,
        subscribed,
      };
    } catch (error) {
      console.error('Newsletter subscription check error:', error);
      return {
        success: false,
        subscribed: false,
        error: 'An unexpected error occurred',
      };
    }
  });