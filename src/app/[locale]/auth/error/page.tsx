import { ErrorCard } from '@/components/auth/error-card';
import { getBaseUrl } from '@/lib/urls/get-base-url';
import { constructMetadata } from '@/lib/metadata';
import { Routes } from '@/routes';

export const metadata = constructMetadata({
  title: 'Auth Error',
  description: 'Auth Error',  
  canonicalUrl: `${getBaseUrl()}${Routes.AuthError}`,
});

const AuthErrorPage = () => {
  return <ErrorCard />;
};

export default AuthErrorPage;
