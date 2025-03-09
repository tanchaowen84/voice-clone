import { AuthCard } from '@/components/auth/auth-card';
import { Routes } from '@/routes';
import { TriangleAlertIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

export const ErrorCard = () => {
  const t = useTranslations('AuthPage.error');

  return (
    <AuthCard
      headerLabel={t('title')}
      bottomButtonHref={`${Routes.Login}`}
      bottomButtonLabel={t('backToLogin')}
      className="border-none"
    >
      <div className="w-full flex justify-center items-center py-4 gap-2">
        <TriangleAlertIcon className="text-destructive size-4" />
        <p className="font-medium text-destructive">{t('tryAgain')}</p>
      </div>
    </AuthCard>
  );
};
