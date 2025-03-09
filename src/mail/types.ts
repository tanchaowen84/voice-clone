import type { Locale } from '@/i18n/routing';
import type { Messages } from '@/i18n/messages';

export interface EmailParams {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export type SendEmailHandler = (params: EmailParams) => Promise<void>;

/**
 * Mail provider, currently only Resend is supported
 */
export interface MailProvider {
  send: SendEmailHandler;
}

export type BaseMailProps = {
  locale: Locale;
  messages: Messages;
};
