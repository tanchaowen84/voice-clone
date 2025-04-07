import { useEffect } from 'react';
import { usePaymentStore } from '@/stores/payment-store';
import { authClient } from '@/lib/auth-client';

/**
 * Hook for accessing and managing payment state
 * 
 * This hook provides access to the payment state and methods to manage it.
 * It also automatically fetches payment information when the user changes.
 */
export function usePayment() {
  const { 
    currentPlanId,
    isLifetimeMember,
    isFreePlan,
    hasActiveSubscription,
    subscription, 
    isLoading, 
    error,
    lastFetched, 
    fetchPayment 
  } = usePaymentStore();
  
  const { data: session } = authClient.useSession();

  useEffect(() => {
    // If we have a user and we haven't fetched payment info in the last 5 minutes
    const currentUser = session?.user;
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;

    if (currentUser && (!lastFetched || lastFetched < fiveMinutesAgo)) {
      fetchPayment(currentUser);
    }
  }, [session, lastFetched, fetchPayment]);

  return {
    currentPlanId,
    isLifetimeMember,
    isFreePlan,
    hasActiveSubscription,
    subscription,
    isLoading,
    error,
    refetch: () => {
      const currentUser = session?.user;
      fetchPayment(currentUser);
    }
  };
} 