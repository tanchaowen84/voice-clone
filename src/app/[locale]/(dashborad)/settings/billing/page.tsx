'use client';

import BillingCard from '@/components/settings/billing/billing-card';
import { usePayment } from '@/hooks/use-payment';
import { useLocaleRouter } from '@/i18n/navigation';
import { authClient } from '@/lib/auth-client';
import { Routes } from '@/routes';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function BillingPage() {
  // const { data: session, refetch: refetchSession } = authClient.useSession();
  // const { refetch: refetchPayment } = usePayment();
  // const searchParams = useSearchParams();
  // const localeRouter = useLocaleRouter();

  // console.log('billing page, session', session);
  
  // // Force refresh payment data when returning from Stripe checkout
  // useEffect(() => {
  //   // Check if we're returning from Stripe checkout
  //   const sessionId = searchParams.get('session_id');
    
  //   if (sessionId) {
  //     console.log('Returned from Stripe checkout, force refresh session and payment');
  //     refetchSession();
  //     refetchPayment();
      
  //     // Clean up URL by removing query parameters
  //     localeRouter.replace(Routes.SettingsBilling);
  //   }
  // }, [searchParams, refetchSession, refetchPayment, localeRouter]);

  return (
    <BillingCard />
  );
}
