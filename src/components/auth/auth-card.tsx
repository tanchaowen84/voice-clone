"use client";

import { BottomButton } from "@/components/auth/bottom-button";
import { SocialLoginButton } from "@/components/auth/social-login-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { LocaleLink } from "@/i18n/navigation";

interface AuthCardProps {
  children: React.ReactNode;
  headerLabel: string;
  bottomButtonLabel: string;
  bottomButtonHref: string;
  showSocialLoginButton?: boolean;
  className?: string;
}

export const AuthCard = ({
  children,
  headerLabel,
  bottomButtonLabel,
  bottomButtonHref,
  showSocialLoginButton,
  className,
}: AuthCardProps) => {
  return (
    <Card className={cn("shadow-sm border border-border", className)}>
      <CardHeader className="items-center">
        <LocaleLink href="/" prefetch={false}>
          <Logo className="mb-2" />
        </LocaleLink>
        <CardDescription>{headerLabel}</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
      {showSocialLoginButton && (
        <CardFooter>
          <SocialLoginButton />
        </CardFooter>
      )}
      <CardFooter>
        <BottomButton label={bottomButtonLabel} href={bottomButtonHref} />
      </CardFooter>
    </Card>
  );
};
