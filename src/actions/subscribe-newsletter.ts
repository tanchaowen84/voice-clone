'use server';

import { subscribe } from '@/newsletter';
import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';

// Create a safe action client
const actionClient = createSafeActionClient();

// Newsletter schema for validation
const newsletterSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

// Create a safe action for newsletter subscription
export const subscribeNewsletterAction = actionClient
  .schema(newsletterSchema)
  .action(async ({ parsedInput: { email } }) => {
    try {
      const subscribed = await subscribe(email);

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