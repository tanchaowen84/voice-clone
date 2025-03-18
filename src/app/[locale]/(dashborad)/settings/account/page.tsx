import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { ConditionalUpdatePasswordCard } from '@/components/settings/account/conditional-update-password-card';
import { DeleteAccountCard } from '@/components/settings/account/delete-account-card';
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

      <div className="px-4 py-8">
        <div className="flex flex-col items-center space-y-6 w-full">
          <UpdateAvatarCard />
          <UpdateNameCard />
          <ConditionalUpdatePasswordCard />
          <DeleteAccountCard />
        </div>
      </div>
    </>
  );
}
