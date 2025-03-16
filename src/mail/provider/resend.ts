import { websiteConfig } from '@/config';
import { SendEmailHandler } from '@/mail/types';
import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY || 'test_api_key';

const resend = new Resend(apiKey);

export const sendEmail: SendEmailHandler = async ({ to, subject, html }) => {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set, skipping email send');
    return;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: websiteConfig.mail.from,
      to,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    console.error('Error sending email', await response.json());
    throw new Error('Error sending email');
  }
};
