'use server';

import { auth } from '@/lib/auth';
import { unsubscribe } from '@/newsletter';
import { createSafeActionClient } from 'next-safe-action';
import { headers } from 'next/headers';
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
    const authSession = await auth.api.getSession({
      headers: await headers(),
    });
    if (!authSession) {
      return {
        success: false,
        error: 'Unauthorized',
      };
    }
    
    try {
      const unsubscribed = await unsubscribe(email);

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