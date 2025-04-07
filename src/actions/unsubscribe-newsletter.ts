'use server';

import { getSession } from '@/lib/server';
import { unsubscribe } from '@/newsletter';
import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';

// Create a safe action client
const actionClient = createSafeActionClient();

// Newsletter schema for validation
const newsletterSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

// Create a safe action for newsletter unsubscription
export const unsubscribeNewsletterAction = actionClient
  .schema(newsletterSchema)
  .action(async ({ parsedInput: { email } }) => {
    const session = await getSession();
    if (!session) {
      return {
        success: false,
        error: 'Unauthorized',
      };
    }
    
    try {
      const unsubscribed = await unsubscribe(email);

      if (!unsubscribed) {
        console.error('unsubscribe newsletter error:', email);
        return {
          success: false,
          error: 'Failed to unsubscribe from the newsletter',
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      console.error('unsubscribe newsletter error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Something went wrong',
      };
    }
  });