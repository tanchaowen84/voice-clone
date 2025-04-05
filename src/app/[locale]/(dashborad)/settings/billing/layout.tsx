import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { getTranslations } from 'next-intl/server';

interface BillingLayoutProps {
  children: React.ReactNode;
}

export default async function BillingLayout({
  children,
}: BillingLayoutProps) {
  const t = await getTranslations('Dashboard.settings');

  const breadcrumbs = [
    {
      label: t('title'),
      isCurrentPage: false,
    },
    {
      label: t('billing.title'),
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
              {t('billing.title')}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t('billing.description')}
            </p>
          </div>

          {children}
        </div>
      </div>
    </>
  );
}
