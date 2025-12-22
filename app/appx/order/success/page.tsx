"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Check, Package, Home, ShoppingBag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import { createAppClient } from "@/lib/supabase";

interface Order {
  id: string;
  order_number: string;
  total: number;
  status: string;
  items: any[];
  created_at: string;
}

function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearAllCarts } = useCart();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Clear the cart after successful order
    clearAllCarts();

    // Fetch order details by session_id
    const fetchOrder = async () => {
      if (!sessionId) {
        setLoading(false);
        return;
      }

      try {
        const supabase = createAppClient();
        const { data, error } = await supabase
          .from("provider_orders")
          .select("*")
          .eq("stripe_session_id", sessionId)
          .maybeSingle();

        if (error) {
          console.log("Order fetch info:", error.message);
          // Don't throw - just show success without order details
        }
        
        if (data) {
          setOrder(data);
        }
      } catch (error) {
        // Silently handle - page will still show success message
        console.log("Order fetch skipped:", error);
      } finally {
        setLoading(false);
      }
    };

    // Small delay to allow webhook to process
    setTimeout(fetchOrder, 1500);
  }, [sessionId, clearAllCarts]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-[#0D9488] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
      {/* Success Animation */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center mb-6 animate-bounce">
          <Check className="h-12 w-12 text-green-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          Order Placed Successfully!
        </h1>

        <p className="text-gray-600 text-center mb-6">
          Thank you for your order. We'll notify you when it's on its way.
        </p>

        {order && (
          <div className="bg-white rounded-2xl p-6 shadow-sm w-full max-w-sm mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-[#0D9488]/10 flex items-center justify-center">
                <Package className="h-6 w-6 text-[#0D9488]" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  Order #{order.order_number}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Items</span>
                <span>{order.items?.length || 0} products</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total Paid</span>
                <span className="text-[#0D9488]">AED {order.total}</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-green-50 rounded-xl">
              <p className="text-sm text-green-700 flex items-center gap-2">
                <Check className="h-4 w-4" />
                Payment confirmed
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 w-full max-w-sm">
          <a href="/appx/activities" className="w-full">
            <button className="w-full flex items-center justify-center gap-2 bg-[#0D9488] hover:bg-[#0B7B71] text-white py-4 rounded-xl font-medium transition-colors">
              <ShoppingBag className="h-5 w-5" />
              View My Orders
            </button>
          </a>

          <a href="/appx" className="w-full">
            <button className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 py-4 rounded-xl font-medium border border-gray-200 transition-colors">
              <Home className="h-5 w-5" />
              Continue Shopping
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#0D9488]" />
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
