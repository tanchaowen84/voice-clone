import { ResendProvider } from './provider/resend';
import { MailProvider, SendEmailResult, SendRawEmailParams, SendTemplateParams, EmailTemplate, EmailTemplates } from './types';
import { getMessagesForLocale } from '@/i18n/messages';
import { routing } from '@/i18n/routing';
import { render } from '@react-email/render';
import { Locale, Messages } from 'next-intl';

/**
 * Global mail provider instance
 */
let mailProvider: MailProvider | null = null;

/**
 * Initialize the mail provider
 * @returns initialized mail provider
 */
export const initializeMailProvider = (): MailProvider => {
  if (!mailProvider) {
    mailProvider = new ResendProvider();
  }
  return mailProvider;
};

/**
 * Get the mail provider
 * @returns current mail provider instance
 * @throws Error if provider is not initialized
 */
export const getMailProvider = (): MailProvider => {
  if (!mailProvider) {
    return initializeMailProvider();
  }
  return mailProvider;
};

/**
 * Send email using the configured mail provider
 * 
 * @param params Email parameters
 * @returns Success status
 */
export async function sendEmail(
  params: SendTemplateParams | SendRawEmailParams
) {
  const provider = getMailProvider();

  if ('template' in params) {
    // This is a template email
    const result = await provider.sendTemplate(params);
    return result.success;
  } else {
    // This is a raw email
    const result = await provider.sendRawEmail(params);
    return result.success;
  }
}

/**
 * Get rendered email for given template, context, and locale
 */
export async function getTemplate<T extends EmailTemplate>({
  template,
  context,
  locale = routing.defaultLocale,
}: {
  template: T;
  context: Record<string, any>;
  locale?: Locale;
}) {
  const mainTemplate = EmailTemplates[template];
  const messages = await getMessagesForLocale(locale);

  const email = mainTemplate({
    ...(context as any),
    locale,
    messages,
  });

  // Get the subject from the messages
  const subject =
    'subject' in messages.Mail[template as keyof Messages['Mail']]
      ? messages.Mail[template].subject
      : '';

  const html = await render(email);
  const text = await render(email, { plainText: true });

  return { html, text, subject };
}

// Export types for convenience
export type {
  MailProvider, SendEmailResult, SendRawEmailParams, SendTemplateParams, EmailTemplate
};

