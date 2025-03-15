import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { UpdateAvatarCard } from '@/components/settings/account/update-avatar-card';
import { UpdateNameCard } from '@/components/settings/account/update-name-card';
import { UpdatePasswordCard } from '@/components/settings/account/update-password-card';
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
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <UpdateAvatarCard />
        <UpdateNameCard />
        <UpdatePasswordCard />
      </div>
    </>
  );
}
