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

interface SidebarUpgradeCardProps {
  user: Session['user'];
}

export function SidebarUpgradeCard({ user }: SidebarUpgradeCardProps) {
  const t = useTranslations('Dashboard.upgrade');

  // user is a member if they have a lifetime membership or an active/trialing subscription
  const isMember = user?.lifetimeMember ||
    (user?.subscriptionId && (user.subscriptionStatus === 'active' || user.subscriptionStatus === 'trialing'));

  // if user is a member, don't show the upgrade card
  if (isMember) {
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
