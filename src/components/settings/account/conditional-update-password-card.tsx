'use client';

import { UpdatePasswordCard } from '@/components/settings/account/update-password-card';
import { authClient } from '@/lib/auth-client';
import { useEffect, useState } from 'react';

/**
 * Conditionally renders the UpdatePasswordCard component
 * only if the user has a credential provider (email/password login)
 */
export function ConditionalUpdatePasswordCard() {
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
          // Check if any account has a credential provider (provider === 'credentials')
          const hasCredentials = accounts.data.some(
            (account) => account.provider === 'credential'
          );
          setHasCredentialProvider(hasCredentials);
        }
      } catch (error) {
        console.error('Error checking credential provider:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkCredentialProvider();
  }, [session]);

  // Don't render anything while loading or if user doesn't have credential provider
  if (isLoading || !hasCredentialProvider) {
    return null;
  }

  return <UpdatePasswordCard />;
} 