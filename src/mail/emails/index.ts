import { VerifyEmail } from './verify-email';
import { ForgotPassword } from './forgot-password';
import { SubscribeNewsletter } from './subscribe-newsletter';

/**
 * list all the mail templates here
 */
export const mailTemplates = {
  forgotPassword: ForgotPassword,
  verifyEmail: VerifyEmail,
  subscribeNewsletter: SubscribeNewsletter,
} as const;
