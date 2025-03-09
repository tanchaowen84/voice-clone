import { RegisterForm } from '@/components/auth/register-form';
import { constructMetadata } from '@/lib/metadata';
import { getBaseUrl } from '@/lib/urls/get-base-url';
import { Routes } from '@/routes';

export const metadata = constructMetadata({
  title: 'Register',
  description: 'Create an account to get started',
  canonicalUrl: `${getBaseUrl()}${Routes.Register}`,
});

const RegisterPage = () => {
  return <RegisterForm />;
};

export default RegisterPage;
