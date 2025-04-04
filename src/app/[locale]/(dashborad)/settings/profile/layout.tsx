import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { NextPageProps } from '@/types/next-page-props';
import { getTranslations } from 'next-intl/server';
import { PropsWithChildren } from 'react';

interface ProfileLayoutProps extends PropsWithChildren, NextPageProps {}

export default async function ProfileLayout({
  children,
}: ProfileLayoutProps) {
  const t = await getTranslations('Dashboard.sidebar.settings');

  const breadcrumbs = [
    {
      label: t('title'),
      isCurrentPage: false,
    },
    {
      label: t('items.profile.title'),
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
              {t('items.profile.title')}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t('items.profile.description')}
            </p>
          </div>

          {children}
        </div>
      </div>
    </>
  );
}
