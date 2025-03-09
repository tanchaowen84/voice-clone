import { ResetPasswordForm } from '@/components/auth/reset-password-form';
import { constructMetadata } from '@/lib/metadata';
import { getBaseUrl } from '@/lib/urls/get-base-url';

export const metadata = constructMetadata({
  title: 'Reset Password',
  description: 'Set a new password',
  canonicalUrl: `${getBaseUrl()}/auth/reset-password`,
});

const ResetPasswordPage = () => {
  return <ResetPasswordForm />;
};

export default ResetPasswordPage;
