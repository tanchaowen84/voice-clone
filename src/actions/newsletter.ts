'use server';

import {
  subscribe as subscribeToNewsletter,
  unsubscribe as unsubscribeFromNewsletter
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