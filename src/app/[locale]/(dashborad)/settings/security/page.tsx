import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { ConditionalUpdatePasswordCard } from '@/components/settings/security/conditional-update-password-card';
import { DeleteAccountCard } from '@/components/settings/security/delete-account-card';
import { useTranslations } from 'next-intl';

export default function SettingsSecurityPage() {
  const t = useTranslations();

  const breadcrumbs = [
    {
      label: t('Dashboard.sidebar.settings.title'),
      isCurrentPage: false,
    },
    {
      label: t('Dashboard.sidebar.settings.items.security.title'),
      isCurrentPage: true,
    },
  ];

  return (
    <>
      <DashboardHeader breadcrumbs={breadcrumbs} />

      <div className="px-4 lg:px-6 py-16">
        <div className="max-w-5xl mx-auto space-y-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t('Dashboard.sidebar.settings.items.security.title')}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t('Dashboard.sidebar.settings.items.security.description')}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <ConditionalUpdatePasswordCard />
            <DeleteAccountCard />
          </div>
        </div>
      </div>
    </>
  );
}
