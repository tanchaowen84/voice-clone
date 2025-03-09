import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';
import { getBaseUrl } from '@/lib/urls/get-base-url';
import { constructMetadata } from '@/lib/metadata';
import { Routes } from '@/routes';

export const metadata = constructMetadata({
  title: 'Forgot Password',
  description: 'Forgot your password? Reset it.',
  canonicalUrl: `${getBaseUrl()}${Routes.ForgotPassword}`,
});

const ForgotPasswordPage = () => {
  return <ForgotPasswordForm />;
};

export default ForgotPasswordPage;
