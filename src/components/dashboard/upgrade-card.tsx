import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LocaleLink } from "@/i18n/navigation";
import { Routes } from "@/routes";
import { Session } from "@/lib/auth";
import { SparklesIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePayment } from '@/hooks/use-payment';

interface UpgradeCardProps {
  user: Session['user'];
}

export function UpgradeCard({ user }: UpgradeCardProps) {
  const t = useTranslations('Dashboard.upgrade');
  const { isLoading, isLifetimeMember, hasActiveSubscription } = usePayment();

  // Don't show the upgrade card if the user has a lifetime membership or an active subscription
  const isMember = isLifetimeMember || hasActiveSubscription;
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
