"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { XCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function BookingCancelContent() {
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("appointment_id");

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="h-10 w-10 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Cancelled</h1>
        <p className="text-gray-600 mb-6">
          Your payment was not completed and the booking has been cancelled.
        </p>

        <div className="bg-gray-50 rounded-2xl p-6 mb-6">
          <p className="text-sm text-gray-600">
            No charges have been made to your card. You can try booking again whenever you're ready.
          </p>
        </div>

        <div className="space-y-3">
          <Link href="/appx">
            <Button className="w-full bg-brand-gold hover:bg-brand-gold/90">
              Back to Home
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function BookingCancelPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    }>
      <BookingCancelContent />
    </Suspense>
  );
}
