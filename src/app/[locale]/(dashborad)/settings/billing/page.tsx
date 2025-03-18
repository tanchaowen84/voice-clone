"use client";

import { useTranslations } from 'next-intl';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import BillingCard from '@/components/settings/billing/billing-card';

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

      <div className="px-4 py-8">
        <BillingCard />
      </div>
    </>
  );
}
  