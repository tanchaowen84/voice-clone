'use client';

import {
  ACTIVE_STATUSES,
  GRACE_PERIOD_STATUSES,
  type SubscriptionState,
  type SubscriptionStatus,
} from '@/types/subscriptions';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

// Helper function to check if subscription is active
function isSubscriptionActive(
  status: SubscriptionState,
  endDate: string
): boolean {
  const now = new Date();
  const periodEnd = new Date(endDate);

  if (ACTIVE_STATUSES.includes(status as 'active' | 'trialing')) {
    return true;
  }

  if (
    GRACE_PERIOD_STATUSES.includes(
      status as 'canceled' | 'past_due' | 'unpaid' | 'paused'
    ) &&
    periodEnd > now
  ) {
    return true;
  }

  return false;
}

// Helper function to check if subscription is in grace period
function isInGracePeriod(status: SubscriptionState, endDate: string): boolean {
  const now = new Date();
  const periodEnd = new Date(endDate);
  return (
    GRACE_PERIOD_STATUSES.includes(
      status as 'canceled' | 'past_due' | 'unpaid' | 'paused'
    ) && periodEnd > now
  );
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<SubscriptionStatus>({
    isSubscribed: false,
    status: null,
    willEndOn: null,
    isInGracePeriod: false,
    daysLeft: null,
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: customerData } = await supabase
        .from('customers')
        .select(
          `
          subscriptions (
            status,
            current_period_end,
            canceled_at
          )
        `
        )
        .eq('user_id', user.id)
        .single();

      const sub = customerData?.subscriptions?.[0];
      if (!sub) {
        setLoading(false);
        return;
      }

      const now = new Date();
      const endDate = new Date(sub.current_period_end);
      const daysLeft = Math.ceil(
        (endDate.getTime() - now.getTime()) / (1000 * 3600 * 24)
      );

      setSubscription({
        isSubscribed: isSubscriptionActive(sub.status, sub.current_period_end),
        status: sub.status,
        willEndOn: endDate,
        isInGracePeriod: isInGracePeriod(sub.status, sub.current_period_end),
        daysLeft: daysLeft,
      });
    } catch (error) {
      console.error('Error checking subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  return { ...subscription, loading, refresh: checkSubscription };
}
