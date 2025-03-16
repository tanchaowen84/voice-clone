import { CheckSubscribeStatusHandler, SubscribeNewsletterHandler, UnsubscribeNewsletterHandler } from '@/newsletter/types';
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

export const checkSubscribeStatus: CheckSubscribeStatusHandler = async ({ email }) => {
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_AUDIENCE_ID) {
    console.warn('RESEND_API_KEY or RESEND_AUDIENCE_ID not set, skipping check subscribe status');
    return false;
  }

  try {
    // First, list all contacts to find the one with the matching email
    const listResult = await resend.contacts.list({ audienceId });
    
    if (listResult.error) {
      console.error('Error listing contacts:', listResult.error);
      return false;
    }
    
    // Check if the contact with the given email exists in the list
    // We need to check if data exists and is an array
    if (listResult.data && Array.isArray(listResult.data)) {
      // Now we can safely use array methods
      return listResult.data.some(contact => 
        contact.email === email && contact.unsubscribed === false
      );
    }
    
    return false;
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return false;
  }
};
