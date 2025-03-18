'use server';

import { websiteConfig } from '@/config';
import { send } from '@/mail';
import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';

// Create a safe action client
const actionClient = createSafeActionClient();

/**
 * TODO: When using Zod for validation, how can I localize error messages?
 * https://next-intl.dev/docs/environments/actions-metadata-route-handlers#server-actions
 */
// Contact form schema for validation
const contactFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Name must be at least 3 characters' })
    .max(30, { message: 'Name must not exceed 30 characters' }),
  email: z
    .string()
    .email({ message: 'Please enter a valid email address' }),
  message: z
    .string()
    .min(10, { message: 'Message must be at least 10 characters' })
    .max(500, { message: 'Message must not exceed 500 characters' }),
});

// Create a safe action for contact form submission
export const contactAction = actionClient
  .schema(contactFormSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { name, email, message } = parsedInput;

      if (!websiteConfig.mail.to) {
        console.error('The mail receiver is not set');
        throw new Error('The mail receiver is not set');
      }

      // Send email using the mail service
      // Customize the email template for your needs
      const result = await send({
        to: websiteConfig.mail.to,
        subject: `Contact Form: Message from ${name}`,
        text: '',
        html: `
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <br />
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br />')}</p>
        `,
      });

      if (!result) {
        console.error('Failed to send the contact form message');
        return {
          success: false,
          error: 'Failed to send your message',
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      console.error('Contact form submission error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    }
  });
