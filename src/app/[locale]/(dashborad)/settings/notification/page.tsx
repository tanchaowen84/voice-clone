import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { NewsletterFormCard } from '@/components/settings/notification/newsletter-form-card';
import { useTranslations } from 'next-intl';

export default function SettingsNotificationPage() {
  const t = useTranslations();

  const breadcrumbs = [
    {
      label: t('Dashboard.sidebar.settings.title'),
      isCurrentPage: false,
    },
    {
      label: t('Dashboard.sidebar.settings.items.notification.title'),
      isCurrentPage: true,
    },
  ];

  return (
    <>
      <DashboardHeader breadcrumbs={breadcrumbs} />

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 max-w-6xl">
          <div className="space-y-6">
            <NewsletterFormCard />
          </div>
        </div>
      </div>
    </>
  );
}
