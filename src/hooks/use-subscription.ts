import { useEffect } from 'react';
import { useSubscriptionStore } from '@/stores/subscription-store';
import { useCurrentUser } from '@/hooks/use-current-user';

/**
 * Subscription refresh interval in milliseconds (5 minutes)
 */
const SUBSCRIPTION_REFRESH_INTERVAL = 5 * 60 * 1000;

/**
 * Custom hook for accessing subscription data
 * Automatically fetches subscription data when needed
 * and provides the current subscription state
 */
export const useSubscription = () => {
  const {
    subscription,
    currentPlanId,
    isLifetimeMember,
    isFreePlan,
    hasActiveSubscription,
    isLoading,
    error,
    lastFetched,
    fetchSubscription
  } = useSubscriptionStore();
  
  // Get the current user
  const currentUser = useCurrentUser();

  // Fetch subscription data when the user changes or if it's never been fetched
  useEffect(() => {
    // If there's no subscription data or it's been a while since the last fetch
    const shouldFetch = 
      (!lastFetched) || // Never been fetched
      (Date.now() - lastFetched > SUBSCRIPTION_REFRESH_INTERVAL); // Refresh interval exceeded
    
    if (shouldFetch) {
      fetchSubscription(currentUser);
    }
  }, [currentUser, lastFetched, fetchSubscription]);

  return {
    subscription,
    currentPlanId,
    isLifetimeMember,
    isFreePlan,
    hasActiveSubscription,
    isLoading,
    error,
    refetch: () => fetchSubscription(currentUser),
  };
}; 