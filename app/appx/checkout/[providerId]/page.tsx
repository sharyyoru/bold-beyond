"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  CreditCard,
  MapPin,
  Phone,
  User,
  Loader2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart, ProviderCart } from "@/contexts/cart-context";
import { createSupabaseClient } from "@/lib/supabase";

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const providerId = params.providerId as string;
  const { getProviderCart, clearProviderCart } = useCart();
  
  const [cart, setCart] = useState<ProviderCart | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  });

  useEffect(() => {
    const providerCart = getProviderCart(providerId);
    if (!providerCart || providerCart.items.length === 0) {
      router.push("/appx/cart");
      return;
    }
    setCart(providerCart);

    // Pre-fill from user profile
    const fetchProfile = async () => {
      const supabase = createSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        
        if (profile) {
          setFormData((prev) => ({
            ...prev,
            fullName: profile.full_name || "",
            email: user.email || "",
            phone: profile.phone || "",
            address: profile.address || profile.location || "",
          }));
        }
      }
    };
    fetchProfile();
  }, [providerId, getProviderCart, router]);

  const handleCheckout = async () => {
    if (step < 2) {
      setStep(step + 1);
      return;
    }

    // Process payment
    setLoading(true);
    try {
      const response = await fetch("/api/checkout/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerId,
          items: cart?.items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            price: item.salePrice || item.price,
            quantity: item.quantity,
          })),
          total: cart?.total,
          customer: formData,
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to create checkout session");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to process checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!cart) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0D9488]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-32">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => (step > 1 ? setStep(step - 1) : router.back())}
            className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <div>
            <h1 className="font-semibold text-gray-900">Checkout</h1>
            <p className="text-xs text-gray-500">{cart.providerName}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-4 pb-3 flex gap-2">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`flex-1 h-1 rounded-full ${
                s <= step ? "bg-[#0D9488]" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="px-4 py-4">
        {/* Step 1: Delivery Details */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Delivery Details
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <User className="h-4 w-4 inline mr-1" />
                Full Name *
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Phone className="h-4 w-4 inline mr-1" />
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                placeholder="+971 XX XXX XXXX"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MapPin className="h-4 w-4 inline mr-1" />
                Delivery Address *
              </label>
              <textarea
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                rows={3}
                placeholder="Building, Street, Area, City"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
                rows={2}
                placeholder="Any special instructions"
              />
            </div>
          </div>
        )}

        {/* Step 2: Review & Pay */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Review Order
            </h2>

            {/* Order Items */}
            <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
              {cart.items.map((item) => (
                <div key={item.productId} className="flex gap-3">
                  <div className="h-16 w-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {item.productImage ? (
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        width={64}
                        height={64}
                        className="object-cover h-full w-full"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-2xl">
                        🧴
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 line-clamp-1">
                      {item.productName}
                    </p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    <p className="font-bold text-[#0D9488]">
                      AED {((item.salePrice || item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery Info */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="font-medium text-gray-900 mb-2">Delivery To</h3>
              <p className="text-sm text-gray-600">{formData.fullName}</p>
              <p className="text-sm text-gray-600">{formData.phone}</p>
              <p className="text-sm text-gray-600">{formData.address}</p>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span>AED {cart.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span className="text-[#0D9488]">AED {cart.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-[#0D9488]/10 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-5 w-5 text-[#0D9488]" />
                <span className="font-medium text-gray-900">Secure Payment</span>
              </div>
              <p className="text-sm text-gray-600">
                You'll be redirected to Stripe for secure payment processing.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <Button
          onClick={handleCheckout}
          disabled={
            loading ||
            (step === 1 &&
              (!formData.fullName || !formData.phone || !formData.address))
          }
          className="w-full bg-[#0D9488] hover:bg-[#0B7B71] text-white py-6 rounded-xl text-lg font-semibold disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : step === 1 ? (
            "Continue to Review"
          ) : (
            <>
              <CreditCard className="h-5 w-5 mr-2" />
              Pay AED {cart.total.toFixed(2)}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
