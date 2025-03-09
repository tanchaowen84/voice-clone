import { VerifyEmail } from './VerifyEmail';
import { ForgotPassword } from './ForgotPassword';
import { SubscribeNewsletter } from './SubscribeNewsletter';

/**
 * list all the mail templates here
 */
export const mailTemplates = {
  forgotPassword: ForgotPassword,
  verifyEmail: VerifyEmail,
  subscribeNewsletter: SubscribeNewsletter,
} as const;
