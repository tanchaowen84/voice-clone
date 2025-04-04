import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { getTranslations } from 'next-intl/server';

interface NotificationsLayoutProps {
  children: React.ReactNode;
}

export default async function NotificationsLayout({
  children,
}: NotificationsLayoutProps) {
  const t = await getTranslations('Dashboard.sidebar.settings');

  const breadcrumbs = [
    {
      label: t('title'),
      isCurrentPage: false,
    },
    {
      label: t('items.notification.title'),
      isCurrentPage: true,
    },
  ];

  return (
    <>
      <DashboardHeader breadcrumbs={breadcrumbs} />

      <div className="px-4 lg:px-6 py-16">
        <div className="max-w-6xl mx-auto space-y-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t('items.notification.title')}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t('items.notification.description')}
            </p>
          </div>

          {children}
        </div>
      </div>
    </>
  );
}
