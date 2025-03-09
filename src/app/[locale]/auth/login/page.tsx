import { LoginForm } from '@/components/auth/login-form';
import { LocaleLink } from '@/i18n/navigation';
import { constructMetadata } from '@/lib/metadata';
import { getBaseUrl } from '@/lib/urls/get-base-url';
import { Routes } from '@/routes';
import { useTranslations } from 'next-intl';

export const metadata = constructMetadata({
  title: 'Login',
  description: 'Login to your account',
  canonicalUrl: `${getBaseUrl()}${Routes.Login}`,
});

const LoginPage = () => {
  const t = useTranslations('AuthPage.login');

  return (
    <div className="flex flex-col gap-4">
      <LoginForm />
      <div className="text-balance text-center text-xs text-muted-foreground">
        {t('byClickingContinue')}
        <LocaleLink
          href={Routes.TermsOfService}
          className="underline underline-offset-4 hover:text-primary"
        >
          {t('termsOfService')}
        </LocaleLink>{' '}
        {t('and')}{' '}
        <LocaleLink
          href={Routes.PrivacyPolicy}
          className="underline underline-offset-4 hover:text-primary"
        >
          {t('privacyPolicy')}
        </LocaleLink>
      </div>
    </div>
  );
};

export default LoginPage;
