'use server';

import { websiteConfig } from '@/config/website';
import { sendEmail } from '@/mail';
import { getLocale } from 'next-intl/server';
import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';

// Create a safe action client
const actionClient = createSafeActionClient();

/**
 * DOC: When using Zod for validation, how can I localize error messages?
 * https://next-intl.dev/docs/environments/actions-metadata-route-handlers#server-actions
 */
// Contact form schema for validation
const contactFormSchema = z.object({
  name: z.string()
    .min(3, { message: 'Name must be at least 3 characters' })
    .max(30, { message: 'Name must not exceed 30 characters' }),
  email: z.string()
    .email({ message: 'Please enter a valid email address' }),
  message: z.string()
    .min(10, { message: 'Message must be at least 10 characters' })
    .max(500, { message: 'Message must not exceed 500 characters' }),
});

// Create a safe action for contact form submission
export const sendMessageAction = actionClient
  .schema(contactFormSchema)
  .action(async ({ parsedInput }) => {
    // Do not check if the user is authenticated here
    try {
      const { name, email, message } = parsedInput;

      if (!websiteConfig.mail.to) {
        console.error('The mail receiver is not set');
        throw new Error('The mail receiver is not set');
      }

      const locale = await getLocale();

      // Send message as an email to admin
      const result = await sendEmail({
        to: websiteConfig.mail.to,
        template: 'contactMessage',
        context: {
          name,
          email,
          message,
        },
        locale,
      });

      if (!result) {
        console.error('send message error');
        return {
          success: false,
          error: 'Failed to send the message',
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      console.error('send message error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Something went wrong',
      };
    }
  });
