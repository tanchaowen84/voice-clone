'use client';

import { ResetPasswordCard } from '@/components/settings/account/reset-password-card';
import { UpdatePasswordCard } from '@/components/settings/account/update-password-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { authClient } from '@/lib/auth-client';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

interface ConditionalUpdatePasswordCardProps {
  className?: string;
}

/**
 * Conditionally renders either:
 * - UpdatePasswordCard: if the user has a credential provider (email/password login)
 * - ResetPasswordCard: if the user only has social login providers and has an email
 * - Nothing: if the user has no credential provider and no email
 */
export function ConditionalUpdatePasswordCard({ className }: ConditionalUpdatePasswordCardProps) {
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
    return <PasswordSkeletonCard className={className} />;
  }

  // If user has credential provider, show UpdatePasswordCard
  if (hasCredentialProvider) {
    return <UpdatePasswordCard className={className} />;
  }

  // If user doesn't have credential provider but has an email, show ResetPasswordCard
  // The forgot password flow requires an email address
  if (session?.user?.email) {
    return <ResetPasswordCard className={className} />;
  }

  // If user has no credential provider and no email, don't show anything
  return null;
}

function PasswordSkeletonCard({ className }: { className?: string }) {
  const t = useTranslations('Dashboard.sidebar.settings.items.account');
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>
          {t('password.title')}
        </CardTitle>
        <CardDescription>
          {t('password.description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
      </CardContent>
    </Card>
  );
}