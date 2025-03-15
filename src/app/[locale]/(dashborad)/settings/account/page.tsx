import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { UpdateAvatarCard } from '@/components/settings/account/update-avatar-card';
import { UpdateNameCard } from '@/components/settings/account/update-name-card';
import { UpdatePasswordCard } from '@/components/settings/account/update-password-card';
import { DeleteAccountCard } from '@/components/settings/account/delete-account-card';
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
      
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 max-w-6xl">
          <div className="space-y-6">
            <UpdateAvatarCard />
            <UpdateNameCard />
            <UpdatePasswordCard />
            <DeleteAccountCard />
          </div>
        </div>
      </div>
    </>
  );
}
