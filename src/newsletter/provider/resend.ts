import { SubscribeNewsletterHandler, UnsubscribeNewsletterHandler } from '@/newsletter/types';
import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY || 'test_api_key';
const audienceId = process.env.RESEND_AUDIENCE_ID || 'test_audience_id';

const resend = new Resend(apiKey);

export const subscribeNewsletter: SubscribeNewsletterHandler = async ({ email }) => {
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_AUDIENCE_ID) {
    console.warn('RESEND_API_KEY or RESEND_AUDIENCE_ID not set, skipping subscribe newsletter');
    return false;
  }

  const result = await resend.contacts.create({
    email,
    audienceId,
    unsubscribed: false,
  });
  const subscribed = !result.error;

  if (!subscribed) {
    console.error('Error subscribing newsletter', result.error);
    return false;
  } else {
    console.log('Subscribed newsletter', email);
    return true;
  }
};

export const unsubscribeNewsletter: UnsubscribeNewsletterHandler = async ({ email }) => {
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_AUDIENCE_ID) {
    console.warn('RESEND_API_KEY or RESEND_AUDIENCE_ID not set, skipping unsubscribe newsletter');
    return false;
  }

  const result = await resend.contacts.update({
    email,
    audienceId,
    unsubscribed: true,
  });
  const unsubscribed = !result.error;

  if (!unsubscribed) {
    console.error('Error unsubscribing newsletter', result.error);
    return false;
  } else {
    console.log('Unsubscribed newsletter', email);
    return true;
  }
};