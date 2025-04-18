import { ChartAreaInteractive } from '@/components/dashboard/chart-area-interactive';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DataTable } from '@/components/dashboard/data-table';
import { SectionCards } from '@/components/dashboard/section-cards';
import { useTranslations } from 'next-intl';

import data from './data.json';

/**
 * Dashboard page
 *
 * NOTICE: This is a demo page for the dashboard, no real data is used,
 * we will show real data in the future
 */
export default function DashboardPage() {
  const t = useTranslations();

  const breadcrumbs = [
    {
      label: t('Dashboard.dashboard.title'),
      isCurrentPage: true,
    },
  ];

  return (
    <>
      <DashboardHeader breadcrumbs={breadcrumbs} />

      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards />
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div>
            <DataTable data={data} />
          </div>
        </div>
      </div>
    </>
  );
}
