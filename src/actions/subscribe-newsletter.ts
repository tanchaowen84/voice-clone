'use server';

import { sendEmail } from '@/mail';
import { subscribe } from '@/newsletter';
import { getLocale } from 'next-intl/server';
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
    // Do not check if the user is authenticated here
    try {
      const subscribed = await subscribe(email);

      if (!subscribed) {
        console.error('subscribe newsletter error:', email);
        return {
          success: false,
          error: 'Failed to subscribe to the newsletter',
        };
      }

      // Send a welcome email to the user
      const locale = await getLocale();
      await sendEmail({
        to: email,
        template: 'subscribeNewsletter',
        context: {
          email,
        },
        locale,
      });

      return {
        success: true,
      };
    } catch (error) {
      console.error('subscribe newsletter error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Something went wrong',
      };
    }
  });
