'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { useLocaleRouter } from '@/i18n/navigation';
import { authClient } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface ResetPasswordCardProps {
  className?: string;
}

/**
 * Reset Password Card
 * 
 * This component guides users who signed up with social providers
 * to set up a password through the forgot password flow.
 * 
 * How it works:
 * 1. When a user signs in with a social provider, they don't have a password set up
 * 2. This card provides a way for them to set up a password using the forgot password flow
 * 3. The user clicks the button and is redirected to the forgot password page
 * 4. They enter their email (which is already associated with their account)
 * 5. They receive a password reset email
 * 6. After setting a password, they can now login with either:
 *    - Their social provider (as before)
 *    - Their email and the new password
 * 
 * This effectively adds a credential provider to their account, enabling email/password login.
 */
export function ResetPasswordCard({ className }: ResetPasswordCardProps) {
  const router = useLocaleRouter();
  const t = useTranslations('Dashboard.sidebar.settings.items.account');
  const { data: session } = authClient.useSession();

  const handleSetupPassword = () => {
    // Pre-fill the email if available to make it easier for the user
    if (session?.user?.email) {
      router.push(`/auth/forgot-password?email=${encodeURIComponent(session.user.email)}`);
    } else {
      router.push('/auth/forgot-password');
    }
  };

  return (
    <Card className={cn("w-full max-w-lg md:max-w-xl overflow-hidden pt-6 pb-0 flex flex-col", className)}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {t('setupPassword.title')}
        </CardTitle>
        <CardDescription>
          {t('setupPassword.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 flex-1">
        <p className="text-sm text-muted-foreground">
          {t('setupPassword.info')}
        </p>
      </CardContent>
      <CardFooter className="mt-auto px-6 py-4 flex justify-end items-center bg-muted rounded-none">
        <Button onClick={handleSetupPassword} className="cursor-pointer">
          {t('setupPassword.button')}
        </Button>
      </CardFooter>
    </Card>
  );
} 