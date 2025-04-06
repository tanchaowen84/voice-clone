'use client';

import BillingCard from '@/components/settings/billing/billing-card';
import { useEffect } from 'react';
import { useSubscription } from '@/hooks/use-subscription';
import { useSearchParams } from 'next/navigation';

export default function BillingPage() {
  // TODO: we need better way to refresh session and subscription data
  // const { refetch } = useSubscription();
  // const searchParams = useSearchParams();

  // useEffect(() => {
  //   // Check for query parameters that might indicate a payment was just completed
  //   const hasStripeSession = Boolean(searchParams.get('session_id'));
    
  //   // If there's a session_id in the URL, trigger a subscription refresh
  //   // This could happen after a redirect from a completed payment
  //   if (hasStripeSession) {
  //     console.log('BillingPage hasStripeSession', hasStripeSession);
  //     // Refresh subscription data from the database
  //     refetch();
  //   }
  // }, [searchParams, refetch]);
  
  return (
    <BillingCard />
  );
}
