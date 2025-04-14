import { CheckSubscribeStatusParams, NewsletterProvider, SubscribeNewsletterParams, UnsubscribeNewsletterParams } from '@/newsletter/types';
import { Resend } from 'resend';

/**
 * Implementation of the NewsletterProvider interface using Resend
 */
export class ResendNewsletterProvider implements NewsletterProvider {
  private resend: Resend;
  private audienceId: string;

  constructor() {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY environment variable is not set.');
    }
    if (!process.env.RESEND_AUDIENCE_ID) {
      throw new Error('RESEND_AUDIENCE_ID environment variable is not set.');
    }

    this.resend = new Resend(process.env.RESEND_API_KEY);
    this.audienceId = process.env.RESEND_AUDIENCE_ID;
  }

  /**
   * Get the provider name
   * @returns Provider name
   */
  public getProviderName(): string {
    return 'Resend';
  }

  /**
   * Subscribe a user to the newsletter
   * @param email The email address to subscribe
   * @returns True if the subscription was successful, false otherwise
   */
  async subscribe({ email }: SubscribeNewsletterParams): Promise<boolean> {
    try {
      // First, list all contacts to find the one with the matching email
      const listResult = await this.resend.contacts.list({ audienceId: this.audienceId });
      if (listResult.error) {
        console.error('Error listing contacts:', listResult.error);
        return false;
      }

      // console.log('subscribe list result:', listResult);
      // Check if the contact with the given email exists in the list
      let contact = null;
      if (listResult.data?.data && Array.isArray(listResult.data.data)) {
        contact = listResult.data.data.find(c => c.email === email);
      }

      // console.log('subscribe params:', { email, contact });
      // If the contact does not exist, create a new one
      if (!contact) {
        console.log('Creating new contact', email);
        const createResult = await this.resend.contacts.create({
          email,
          audienceId: this.audienceId,
          unsubscribed: false,
        });

        // console.log('subscribe create result:', createResult);
        if (createResult.error) {
          console.error('Error creating contact', createResult.error);
          return false;
        } else {
          console.log('Created new contact', email);
          return true;
        }
      }

      // If the contact already exists, update it
      // NOTICE: we can not just create a new contact if this email already exists,
      // because Resend will response 201, but user is not subscribed
      // NOTICE: we can not update it with email if the contact not found, it will return 404,
      // statusCode: 404, name: not_found, message: Contact not found
      const updateResult = await this.resend.contacts.update({
        email,
        audienceId: this.audienceId,
        unsubscribed: false,
      });
      // console.log('subscribe update result:', updateResult);

      // NOTICE: we can not request too many times, because of the rate limit of Resend
      // statusCode: 429, name: rate_limit_exceeded, message: Too many requests, you can only make 2 requests per second.
      if (updateResult.error) {
        console.error('Error updating contact', updateResult.error);
        return false;
      }

      console.log('Subscribed newsletter', email);
      return true;
    } catch (error) {
      console.error('Error subscribing newsletter', error);
      return false;
    }
  }

  /**
   * Unsubscribe a user from the newsletter
   * @param email The email address to unsubscribe
   * @returns True if the unsubscription was successful, false otherwise
   */
  async unsubscribe({ email }: UnsubscribeNewsletterParams): Promise<boolean> {
    try {
      // console.log('Unsubscribing newsletter', email);
      const result = await this.resend.contacts.update({
        email,
        audienceId: this.audienceId,
        unsubscribed: true,
      });

      // console.log('Unsubscribe result:', result);
      if (result.error) {
        console.error('Error unsubscribing newsletter', result.error);
        return false;
      }

      console.log('Unsubscribed newsletter', email);
      return true;
    } catch (error) {
      console.error('Error unsubscribing newsletter', error);
      return false;
    }
  }

  /**
   * Check if a user is subscribed to the newsletter
   * @param email The email address to check
   * @returns True if the user is subscribed, false otherwise
   */
  async checkSubscribeStatus({ email }: CheckSubscribeStatusParams): Promise<boolean> {
    try {
      // First, list all contacts to find the one with the matching email
      const listResult = await this.resend.contacts.list({ audienceId: this.audienceId });

      if (listResult.error) {
        console.error('Error listing contacts:', listResult.error);
        return false;
      }

      // console.log('check newsletter params:', { email, listResult });
      // Check if the contact with the given email exists in the list
      if (listResult.data?.data && Array.isArray(listResult.data.data)) {
        return listResult.data.data.some(contact =>
          contact.email === email && contact.unsubscribed === false
        );
      }

      // console.log('check newsletter status:', { email, subscribed: false });
      return false;
    } catch (error) {
      console.error('Error checking subscription status:', error);
      return false;
    }
  }
}
