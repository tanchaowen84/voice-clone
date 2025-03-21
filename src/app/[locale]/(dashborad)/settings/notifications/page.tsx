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

      <div className="px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t('Dashboard.sidebar.settings.items.notification.title')}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t('Dashboard.sidebar.settings.items.notification.description')}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <NewsletterFormCard />
          </div>
        </div>
      </div>
    </>
  );
}
