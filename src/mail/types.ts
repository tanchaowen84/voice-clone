import { Locale, Messages } from 'next-intl';
import { EmailTemplates } from './emails';

export interface BaseEmailProps {
  locale: Locale;
  messages: Messages;
}

export interface SendEmailProps {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export type Template = keyof typeof EmailTemplates;

export type SendEmailHandler = (params: SendEmailProps) => Promise<boolean>;

/**
 * Email provider, currently only Resend is supported
 */
export interface EmailProvider {
  send: SendEmailHandler;
}
