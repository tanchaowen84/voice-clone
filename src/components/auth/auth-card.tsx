'use client';

import { BottomLink } from '@/components/auth/bottom-link';
import { Logo } from '@/components/layout/logo';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { LocaleLink } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

interface AuthCardProps {
  children: React.ReactNode;
  headerLabel: string;
  bottomButtonLabel: string;
  bottomButtonHref: string;
  className?: string;
}

export const AuthCard = ({
  children,
  headerLabel,
  bottomButtonLabel,
  bottomButtonHref,
  className,
}: AuthCardProps) => {
  return (
    <Card className={cn('shadow-xs border border-border', className)}>
      <CardHeader className="flex flex-col items-center">
        <LocaleLink href="/" prefetch={false}>
          <Logo className="mb-2" />
        </LocaleLink>
        <CardDescription>{headerLabel}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>
        <BottomLink label={bottomButtonLabel} href={bottomButtonHref} />
      </CardFooter>
    </Card>
  );
};
