'use client';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePayment } from '@/hooks/use-payment';
import { LocaleLink } from "@/i18n/navigation";
import { Routes } from "@/routes";
import { SparklesIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export function UpgradeCard() {
  const t = useTranslations('Dashboard.upgrade');
  const { isLoading, currentPlan, subscription } = usePayment();

  // Don't show the upgrade card if the user has a lifetime membership or a subscription
  const isMember = currentPlan?.isLifetime || !!subscription;

  if (isLoading || isMember) {
    return null;
  }

  return (
    <Card className="shadow-none">
      <CardHeader className="gap-2">
        <CardTitle className="flex items-center gap-2">
          <SparklesIcon className="size-4" />
          {t('title')}
        </CardTitle>
        <CardDescription>
          {t('description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          className="cursor-pointer w-full shadow-none"
          size="sm"
        >
          <LocaleLink href={Routes.SettingsBilling}>
            {t('button')}
          </LocaleLink>
        </Button>
      </CardContent>
    </Card>
  )
}
