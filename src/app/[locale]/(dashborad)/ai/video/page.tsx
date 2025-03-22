import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { useTranslations } from 'next-intl';
  
export default function AIVideoPage() {
  const t = useTranslations('Dashboard.sidebar.ai');
  
  const breadcrumbs = [
    {
      label: t('title'),
      isCurrentPage: false,
    },
    {
      label: t('items.video.title'),
      isCurrentPage: true,
    },
  ];
  
  return (
    <>
      <DashboardHeader breadcrumbs={breadcrumbs} />

      <div className="px-4 lg:px-6 py-16">
        <div className="max-w-5xl mx-auto space-y-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t('items.video.title')}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t('items.video.description')}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
  