import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { useTranslations } from 'next-intl';
  
export default function AITextPage() {
  const t = useTranslations();
  
  const breadcrumbs = [
    {
      label: t('Dashboard.sidebar.ai.title'),
      isCurrentPage: false,
    },
    {
      label: t('Dashboard.sidebar.ai.items.text.title'),
      isCurrentPage: true,
    },
  ];
  
  return (
    <>
      <DashboardHeader breadcrumbs={breadcrumbs} />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
        </div>
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
      </div>
    </>
  );
}
  