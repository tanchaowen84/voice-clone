import { websiteConfig } from '@/config';
import { SendEmailHandler } from '@/mail/types';
import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY || 'test_api_key';

const resend = new Resend(apiKey);

/**
 * https://resend.com/docs/send-with-nextjs
 */
export const sendEmail: SendEmailHandler = async ({ to, subject, html }) => {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set, skipping email send');
    return false;
  }

  if (!websiteConfig.mail.from || !to || !subject || !html) {
    console.warn('Missing required fields for email send', { from: websiteConfig.mail.from, to, subject, html });
    return false;
  }

  const { data, error } = await resend.emails.send({
    from: websiteConfig.mail.from,
    to,
    subject,
    html,
  });

  if (error) {
    console.error('Error sending email', error);
    return false;
  }

  return true;
};
