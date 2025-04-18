'use server';

import { isSubscribed } from '@/newsletter';
import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';

// Create a safe action client
const actionClient = createSafeActionClient();

// Newsletter schema for validation
const newsletterSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

// Create a safe action to check if a user is subscribed to the newsletter
export const checkNewsletterStatusAction = actionClient
  .schema(newsletterSchema)
  .action(async ({ parsedInput: { email } }) => {
    try {
      const subscribed = await isSubscribed(email);

      return {
        success: true,
        subscribed,
      };
    } catch (error) {
      console.error('check newsletter status error:', error);
      return {
        success: false,
        subscribed: false,
        error: error instanceof Error ? error.message : 'Something went wrong',
      };
    }
  });
