import { websiteConfig } from '@/config';
import { SendEmailHandler } from '@/mail/utils/types';
import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail: SendEmailHandler = async ({ to, subject, html }) => {
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
