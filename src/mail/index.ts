import { ResendProvider } from './provider/resend';
import { MailProvider, SendEmailResult, SendRawEmailParams, SendTemplateParams, EmailTemplate } from './types';

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
 * Send an email using a template
 * @param params Parameters for sending the templated email
 * @returns Send result
 */
export const sendTemplate = async (params: SendTemplateParams):
  Promise<SendEmailResult> => {
  const provider = getMailProvider();
  return provider.sendTemplate(params);
};

/**
 * Send a raw email
 * @param params Parameters for sending the raw email
 * @returns Send result
 */
export const sendRawEmail = async (params: SendRawEmailParams):
  Promise<SendEmailResult> => {
  const provider = getMailProvider();
  return provider.sendRawEmail(params);
};

// Export from mail.ts
export { getTemplate, sendEmail } from './mail';

// Export email templates
export { EmailTemplates } from './templates';

// Export types for convenience
export type {
  MailProvider, SendEmailResult, SendRawEmailParams, SendTemplateParams, EmailTemplate as Template
};

