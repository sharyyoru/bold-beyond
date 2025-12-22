"use client";

import Link from "next/link";
import { XCircle, Home, RefreshCcw, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrderFailedPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
      {/* Failure Animation */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="h-24 w-24 rounded-full bg-red-100 flex items-center justify-center mb-6">
          <XCircle className="h-12 w-12 text-red-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          Payment Failed
        </h1>

        <p className="text-gray-600 text-center mb-8 max-w-sm">
          We couldn't process your payment. Please try again or use a different payment method.
        </p>

        <div className="bg-white rounded-2xl p-6 shadow-sm w-full max-w-sm mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Common reasons:</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">•</span>
              Insufficient funds in your account
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">•</span>
              Card declined by your bank
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">•</span>
              Incorrect card details entered
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">•</span>
              Payment session expired
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-sm">
          <Button
            asChild
            className="w-full bg-[#0D9488] hover:bg-[#0B7B71] text-white py-6 rounded-xl"
          >
            <Link href="/appx/cart">
              <RefreshCcw className="h-5 w-5 mr-2" />
              Try Again
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full py-6 rounded-xl border-gray-200"
          >
            <Link href="/appx">
              <Home className="h-5 w-5 mr-2" />
              Return to Home
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            className="w-full py-6 rounded-xl text-gray-500"
          >
            <Link href="/appx/wellness-chat">
              <HelpCircle className="h-5 w-5 mr-2" />
              Need Help?
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
