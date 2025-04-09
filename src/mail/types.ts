import { Locale, Messages } from 'next-intl';
import { EmailTemplates } from './templates';

/**
 * Base email component props
 */
export interface BaseEmailProps {
  locale: Locale;
  messages: Messages;
}

/**
 * Common email sending parameters
 */
export interface SendEmailParams {
  to: string;
  subject: string;
  text?: string;
  html: string;
  from?: string;
}

/**
 * Result of sending an email
 */
export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: any;
}

/**
 * Email template types
 */
export type Template = keyof typeof EmailTemplates;

/**
 * Parameters for sending an email using a template
 */
export interface SendTemplateParams {
  to: string;
  template: Template;
  context: Record<string, any>;
  locale?: Locale;
}

/**
 * Parameters for sending a raw email
 */
export interface SendRawEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
  locale?: Locale;
}

/**
 * Mail provider configuration
 */
export interface MailConfig {
  defaultFromEmail: string;
  defaultLocale: Locale;
}

/**
 * Mail provider interface
 */
export interface MailProvider {
  /**
   * Send an email using a template
   */
  sendTemplate(params: SendTemplateParams): Promise<SendEmailResult>;

  /**
   * Send a raw email
   */
  sendRawEmail(params: SendRawEmailParams): Promise<SendEmailResult>;

  /**
   * Get the provider's name
   */
  getProviderName(): string;
}
