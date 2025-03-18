import { CheckSubscribeStatusParams, NewsletterProvider, SubscribeNewsletterParams, UnsubscribeNewsletterParams } from '@/newsletter/types';
import { Resend } from 'resend';

/**
 * Implementation of the NewsletterProvider interface using Resend
 */
export class ResendNewsletterProvider implements NewsletterProvider {
  private resend: Resend;
  private audienceId: string;

  constructor(apiKey: string, audienceId: string) {
    this.resend = new Resend(apiKey);
    this.audienceId = audienceId;
  }

  getProviderName(): string {
    return 'Resend';
  }

  async subscribe({ email }: SubscribeNewsletterParams): Promise<boolean> {
    try {
      // First, list all contacts to find the one with the matching email
      const listResult = await this.resend.contacts.list({ audienceId: this.audienceId });
      if (listResult.error) {
        console.error('Error listing contacts:', listResult.error);
        return false;
      }

      // Check if the contact with the given email exists in the list
      let contact = null;
      if (listResult.data && Array.isArray(listResult.data)) {
        contact = listResult.data.find(c => c.email === email);
      }

      // If the contact does not exist, create a new one
      if (!contact) {
        const createResult = await this.resend.contacts.create({
          email,
          audienceId: this.audienceId,
          unsubscribed: false,
        });

        if (createResult.error) {
          console.error('Error creating contact', createResult.error);
          return false;
        }        
      }

      // If the contact already exists, update it
      // NOTICE: we can not just create a new contact if this email already exists,
      // because Resend will response 201, but user is not subscribed
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

  async unsubscribe({ email }: UnsubscribeNewsletterParams): Promise<boolean> {
    try {
      const result = await this.resend.contacts.update({
        email,
        audienceId: this.audienceId,
        unsubscribed: true,
      });

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

  async checkSubscribeStatus({ email }: CheckSubscribeStatusParams): Promise<boolean> {
    try {
      // First, list all contacts to find the one with the matching email
      const listResult = await this.resend.contacts.list({ audienceId: this.audienceId });

      if (listResult.error) {
        console.error('Error listing contacts:', listResult.error);
        return false;
      }

      // Check if the contact with the given email exists in the list
      if (listResult.data && Array.isArray(listResult.data)) {
        return listResult.data.some(contact =>
          contact.email === email && contact.unsubscribed === false
        );
      }

      return false;
    } catch (error) {
      console.error('Error checking subscription status:', error);
      return false;
    }
  }
}
