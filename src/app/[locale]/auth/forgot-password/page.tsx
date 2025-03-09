import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';
import { siteConfig } from '@/config/site';
import { constructMetadata } from '@/lib/metadata';
import { Routes } from '@/routes';

export const metadata = constructMetadata({
  title: 'Forgot Password',
  description: 'Forgot your password? Reset it.',
  canonicalUrl: `${siteConfig.url}${Routes.ForgotPassword}`,
});

const ForgotPasswordPage = () => {
  return <ForgotPasswordForm />;
};

export default ForgotPasswordPage;
