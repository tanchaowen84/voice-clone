'use client';

import { ResetPasswordCard } from '@/components/settings/security/reset-password-card';
import { UpdatePasswordCard } from '@/components/settings/security/update-password-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { authClient } from '@/lib/auth-client';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * PasswordCardWrapper renders either:
 * - UpdatePasswordCard: if the user has a credential provider (email/password login)
 * - ResetPasswordCard: if the user only has social login providers and has an email
 * - PasswordSkeletonCard: when this component is still loading
 * - Nothing: if the user has no credential provider and no email
 */
export function PasswordCardWrapper() {
  const { data: session } = authClient.useSession();
  const [hasCredentialProvider, setHasCredentialProvider] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkCredentialProvider = async () => {
      if (!session?.user) {
        setIsLoading(false);
        return;
      }

      try {
        // Get the user's linked accounts
        const accounts = await authClient.listAccounts();
        // console.log('accounts', accounts);

        // Check if the response is successful and contains accounts data
        if ('data' in accounts && Array.isArray(accounts.data)) {
          // Check if any account has a credential provider (provider === 'credential')
          const hasCredential = accounts.data.some(
            (account) => account.provider === 'credential'
          );
          setHasCredentialProvider(hasCredential);
        }
      } catch (error) {
        console.error('Error checking credential provider:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkCredentialProvider();
  }, [session]);

  // Don't render anything while loading
  if (isLoading) {
    return <PasswordSkeletonCard />;
  }

  // If user has credential provider, show UpdatePasswordCard
  if (hasCredentialProvider) {
    return <UpdatePasswordCard />;
  }

  // If user doesn't have credential provider but has an email, show ResetPasswordCard
  // The forgot password flow requires an email address
  if (session?.user?.email) {
    return <ResetPasswordCard />;
  }

  // If user has no credential provider and no email, don't show anything
  return null;
}

function PasswordSkeletonCard() {
  const t = useTranslations('Dashboard.sidebar.settings.items.security.updatePassword');
  return (
    <Card className={cn("w-full max-w-lg md:max-w-xl overflow-hidden pt-6 pb-6 flex flex-col")}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {t('title')}
        </CardTitle>
        <CardDescription>
          {t('description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-1">
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-5 w-3/4" />
      </CardContent>
    </Card>
  );
}