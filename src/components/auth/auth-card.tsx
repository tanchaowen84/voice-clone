"use client";

import { BottomButton } from "@/components/auth/bottom-button";
import { SocialLoginButton } from "@/components/auth/social-login-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Logo } from "../logo";

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
    <Card className={cn("shadow-none sm:w-[400px] max-w-[400px]", className)}>
      <CardHeader className="items-center">
        <Link href="/" prefetch={false}>
          <Logo className="mb-2" />
        </Link>
        <CardDescription>{headerLabel}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
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
