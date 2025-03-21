import { ChartAreaInteractive } from '@/components/chart-area-interactive';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DataTable } from '@/components/data-table';
import { SectionCards } from '@/components/section-cards';
import { useTranslations } from 'next-intl';

import data from "../../dashboardv4/data.json";

export default function DashboardPage() {
  const t = useTranslations();

  const breadcrumbs = [
    {
      label: t('Dashboard.sidebar.dashboard.title'),
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
