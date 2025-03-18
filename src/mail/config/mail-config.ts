import { websiteConfig } from '@/config';
import { routing } from '@/i18n/routing';
import { MailConfig } from '@/mail/types';

/**
 * Default mail configuration
 */
export const mailConfig: MailConfig = {
  defaultFromEmail: websiteConfig.mail.from || 'noreply@example.com',
  defaultLocale: routing.defaultLocale,
};