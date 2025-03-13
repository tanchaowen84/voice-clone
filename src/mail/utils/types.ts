import { Locale, Messages } from 'next-intl';
import { EmailTemplates } from '../emails';

export type Template = keyof typeof EmailTemplates;

export type BaseEmailProps = {
  locale: Locale;
  messages: Messages;
};

export interface SendEmailProps {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export type SendEmailHandler = (params: SendEmailProps) => Promise<void>;

/**
 * Email provider, currently only Resend is supported
 */
export interface EmailProvider {
  send: SendEmailHandler;
}
