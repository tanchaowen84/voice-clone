import type {
  CheckSubscribeStatusParams,
  NewsletterProvider,
  SubscribeNewsletterParams,
  UnsubscribeNewsletterParams,
} from '@/newsletter/types';
import { Resend } from 'resend';

/**
 * Implementation of the NewsletterProvider interface using Resend
 *
 * docs:
 * https://mksaas.com/docs/newsletter
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
      // Check if the contact exists
      const getResult = await this.resend.contacts.get({
        email,
        audienceId: this.audienceId,
      });

      // If contact doesn't exist, create a new one
      if (getResult.error) {
        console.log('Creating new contact', email);
        const createResult = await this.resend.contacts.create({
          email,
          audienceId: this.audienceId,
          unsubscribed: false,
        });

        if (createResult.error) {
          console.error('Error creating contact', createResult.error);
          return false;
        }
        console.log('Created new contact', email);
        return true;
      }

      // If the contact exists, update it
      const updateResult = await this.resend.contacts.update({
        email,
        audienceId: this.audienceId,
        unsubscribed: false,
      });

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
  async checkSubscribeStatus({
    email,
  }: CheckSubscribeStatusParams): Promise<boolean> {
    try {
      const result = await this.resend.contacts.get({
        email,
        audienceId: this.audienceId,
      });

      if (result.error) {
        console.error('Error getting contact:', result.error);
        return false;
      }

      const status = !result.data?.unsubscribed;
      console.log('Check subscribe status:', { email, status });
      return status;
    } catch (error) {
      console.error('Error checking subscribe status:', error);
      return false;
    }
  }
}
