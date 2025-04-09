import { websiteConfig } from '@/config';
import { routing } from '@/i18n/routing';

/**
 * Default mail configuration
 */
export const mailConfig = {
  defaultFromEmail: websiteConfig.mail.from || '',
  defaultLocale: routing.defaultLocale,
};