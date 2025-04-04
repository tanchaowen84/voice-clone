import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import BillingCard from '@/components/settings/billing/billing-card';
import { useTranslations } from 'next-intl';

export default function SettingsBillingPage() {
  const t = useTranslations();

  const breadcrumbs = [
    {
      label: t('Dashboard.sidebar.settings.title'),
      isCurrentPage: false,
    },
    {
      label: t('Dashboard.sidebar.settings.items.billing.title'),
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
              {t('Dashboard.sidebar.settings.items.billing.title')}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t('Dashboard.sidebar.settings.items.billing.description')}
            </p>
          </div>

          <BillingCard />
        </div>
      </div>
    </>
  );
}
  