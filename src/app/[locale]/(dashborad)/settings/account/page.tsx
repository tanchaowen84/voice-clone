import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { UpdateAvatarCard } from '@/components/settings/account/update-avatar-card';
import { UpdateNameCard } from '@/components/settings/account/update-name-card';
import { useTranslations } from 'next-intl';

export default function SettingsAccountPage() {
  const t = useTranslations();

  const breadcrumbs = [
    {
      label: t('Dashboard.sidebar.settings.title'),
      isCurrentPage: false,
    },
    {
      label: t('Dashboard.sidebar.settings.items.account.title'),
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
              {t('Dashboard.sidebar.settings.items.account.title')}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t('Dashboard.sidebar.settings.items.account.description')}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <UpdateAvatarCard />
            <UpdateNameCard />
          </div>
        </div>
      </div>
    </>
  );
}
