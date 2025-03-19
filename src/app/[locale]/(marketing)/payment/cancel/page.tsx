import Link from "next/link";
import { XCircle } from "lucide-react";

/**
 * Payment Cancel Page
 * 
 * This page is displayed when a payment has been cancelled
 * It shows a cancellation message and provides links to try again or get help
 */
export default function PaymentCancelPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-12">
      <div className="w-full max-w-md p-8 space-y-4 bg-white border rounded-lg shadow-md dark:bg-gray-950 dark:border-gray-800">
        <div className="flex justify-center">
          <XCircle className="w-16 h-16 text-red-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Payment Cancelled
        </h1>
        
        <p className="text-center text-gray-600 dark:text-gray-400">
          Your payment process was cancelled. No charges were made to your account.
        </p>
        
        <div className="mt-6 space-y-4">
          <div className="py-4 text-center text-sm bg-gray-50 dark:bg-gray-900 rounded-md">
            <p className="text-gray-600 dark:text-gray-400">
              If you encountered any issues during checkout, please contact our support team.
            </p>
          </div>
          
          <div className="flex justify-center space-x-4">
            <Link 
              href="/pricing" 
              className="inline-flex items-center justify-center px-6 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Try Again
            </Link>
            <Link 
              href="/contact" 
              className="inline-flex items-center justify-center px-6 py-2 font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Get Help
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 