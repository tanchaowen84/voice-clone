import { VerifyEmail } from './verify-email';
import { ForgotPassword } from './forgot-password';
import { SubscribeNewsletter } from './subscribe-newsletter';

/**
 * list all the email templates here
 */
export const EmailTemplates = {
  forgotPassword: ForgotPassword,
  verifyEmail: VerifyEmail,
  subscribeNewsletter: SubscribeNewsletter,
} as const;
