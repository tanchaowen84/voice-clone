'use client';

import { UpdatePasswordCard } from '@/components/settings/account/update-password-card';
import { ResetPasswordCard } from '@/components/settings/account/reset-password-card';
import { authClient } from '@/lib/auth-client';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

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
    return null;
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