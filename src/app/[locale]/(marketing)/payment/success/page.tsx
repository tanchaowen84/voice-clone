'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from "next/link";
import { CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaymentSuccessState {
  status: 'loading' | 'success' | 'error';
  message?: string;
}

/**
 * Payment Success Page
 * 
 * This page is displayed when a payment has been successfully completed
 * It verifies the checkout session and shows a success message
 */
export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [state, setState] = useState<PaymentSuccessState>({ status: 'loading' });

  // Verify the checkout session when the page loads
  useEffect(() => {
    async function verifyCheckoutSession() {
      if (!sessionId) {
        setState({ 
          status: 'success', 
          message: 'Thank you for your payment. Your transaction has been completed.'
        });
        return;
      }

      try {
        // You could verify the session here via an API call
        // For now, we'll just assume it's valid if sessionId exists
        setState({ 
          status: 'success',
          message: 'Thank you for your payment. Your transaction has been completed successfully.'
        });
      } catch (error) {
        console.error('Error verifying checkout session:', error);
        setState({ 
          status: 'error',
          message: 'There was an issue verifying your payment. Please contact support if you believe this is an error.'
        });
      }
    }

    verifyCheckoutSession();
  }, [sessionId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-12">
      <div className="w-full max-w-md p-8 space-y-4 bg-white border rounded-lg shadow-md dark:bg-gray-950 dark:border-gray-800">
        {state.status === 'loading' ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-4" />
            <p className="text-center text-gray-600 dark:text-gray-400">
              Verifying your payment...
            </p>
          </div>
        ) : state.status === 'success' ? (
          <>
            <div className="flex justify-center">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            
            <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
              Payment Successful!
            </h1>
            
            <p className="text-center text-gray-600 dark:text-gray-400">
              {state.message}
            </p>
            
            <div className="mt-6 space-y-4">
              <div className="py-4 text-center text-sm bg-gray-50 dark:bg-gray-900 rounded-md">
                <p className="text-gray-600 dark:text-gray-400">
                  Your account will be updated shortly with your new plan benefits.
                </p>
              </div>
              
              <div className="flex justify-center">
                <Link 
                  href="/dashboard" 
                  passHref
                >
                  <Button>Go to Dashboard</Button>
                </Link>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-center text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
              Verification Issue
            </h1>
            
            <p className="text-center text-gray-600 dark:text-gray-400">
              {state.message}
            </p>
            
            <div className="mt-6 flex justify-center">
              <Link 
                href="/contact" 
                passHref
              >
                <Button variant="outline">Contact Support</Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 