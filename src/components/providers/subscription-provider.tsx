'use client';

import { useSubscriptionStore } from '@/stores/subscription-store';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useEffect } from 'react';

/**
 * Subscription provider component
 * 
 * This component is responsible for initializing the subscription state
 * by fetching the current user's subscription information when the app loads.
 * It should be mounted high in the component tree, typically in the root layout.
 */
export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { fetchSubscription } = useSubscriptionStore();
  const currentUser = useCurrentUser();

  // Initialize subscription state
  useEffect(() => {
    fetchSubscription(currentUser);
  }, [currentUser, fetchSubscription]);

  return <>{children}</>;
} 