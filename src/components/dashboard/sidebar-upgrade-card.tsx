import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SparklesIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export function SidebarUpgradeCard() {
  const t = useTranslations('Dashboard.sidebar.upgrade');
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
          {t('button')}
        </Button>
      </CardContent>
    </Card>
  )
}
