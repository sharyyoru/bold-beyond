"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ChevronRight,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart, ProviderCart } from "@/contexts/cart-context";

export default function CartPage() {
  const router = useRouter();
  const {
    carts,
    removeFromCart,
    updateQuantity,
    clearProviderCart,
    getCartItemCount,
    getTotalCartValue,
  } = useCart();

  const [expandedProvider, setExpandedProvider] = useState<string | null>(null);

  const providerCarts = Object.values(carts);
  const totalItems = getCartItemCount();
  const totalValue = getTotalCartValue();

  const handleCheckout = (providerId: string) => {
    router.push(`/appx/checkout/${providerId}`);
  };

  if (providerCarts.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDFBF7]">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-white border-b border-gray-100">
          <div className="px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center"
            >
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </button>
            <h1 className="font-semibold text-gray-900">My Cart</h1>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
            <ShoppingBag className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-500 text-center mb-6">
            Browse our products and add items to your cart
          </p>
          <Button
            onClick={() => router.push("/appx")}
            className="bg-[#0D9488] hover:bg-[#0B7B71] text-white px-8"
          >
            Start Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-32">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center"
            >
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </button>
            <div>
              <h1 className="font-semibold text-gray-900">My Cart</h1>
              <p className="text-xs text-gray-500">
                {totalItems} item{totalItems !== 1 ? "s" : ""} from{" "}
                {providerCarts.length} provider{providerCarts.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Provider Carts */}
      <div className="px-4 py-4 space-y-4">
        {providerCarts.map((cart) => (
          <div
            key={cart.providerId}
            className="bg-white rounded-2xl shadow-sm overflow-hidden"
          >
            {/* Provider Header */}
            <div
              className="p-4 border-b border-gray-100 flex items-center justify-between cursor-pointer"
              onClick={() =>
                setExpandedProvider(
                  expandedProvider === cart.providerId ? null : cart.providerId
                )
              }
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#0D9488] to-[#7DD3D3] flex items-center justify-center text-white font-bold">
                  {cart.providerName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {cart.providerName}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {cart.items.length} item{cart.items.length !== 1 ? "s" : ""} •
                    AED {cart.total.toFixed(2)}
                  </p>
                </div>
              </div>
              <ChevronRight
                className={`h-5 w-5 text-gray-400 transition-transform ${
                  expandedProvider === cart.providerId ? "rotate-90" : ""
                }`}
              />
            </div>

            {/* Cart Items */}
            <div
              className={`overflow-hidden transition-all ${
                expandedProvider === cart.providerId || providerCarts.length === 1
                  ? "max-h-[1000px]"
                  : "max-h-0"
              }`}
            >
              <div className="p-4 space-y-3">
                {cart.items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex gap-3 p-3 bg-gray-50 rounded-xl"
                  >
                    {/* Product Image */}
                    <div className="h-20 w-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                      {item.productImage ? (
                        <Image
                          src={item.productImage}
                          alt={item.productName}
                          width={80}
                          height={80}
                          className="object-cover h-full w-full"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <span className="text-2xl">🧴</span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/appx/products/${item.productSlug}`}
                        className="font-medium text-gray-900 line-clamp-2 hover:text-[#0D9488]"
                      >
                        {item.productName}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        {item.salePrice ? (
                          <>
                            <span className="font-bold text-[#0D9488]">
                              AED {item.salePrice}
                            </span>
                            <span className="text-xs text-gray-400 line-through">
                              AED {item.price}
                            </span>
                          </>
                        ) : (
                          <span className="font-bold text-gray-900">
                            AED {item.price}
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(
                                cart.providerId,
                                item.productId,
                                item.quantity - 1
                              )
                            }
                            className="h-7 w-7 rounded-full bg-white border border-gray-200 flex items-center justify-center"
                          >
                            <Minus className="h-3 w-3 text-gray-600" />
                          </button>
                          <span className="font-medium text-gray-900 w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                cart.providerId,
                                item.productId,
                                item.quantity + 1
                              )
                            }
                            className="h-7 w-7 rounded-full bg-white border border-gray-200 flex items-center justify-center"
                          >
                            <Plus className="h-3 w-3 text-gray-600" />
                          </button>
                        </div>
                        <button
                          onClick={() =>
                            removeFromCart(cart.providerId, item.productId)
                          }
                          className="h-7 w-7 rounded-full bg-red-50 flex items-center justify-center"
                        >
                          <Trash2 className="h-3 w-3 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Provider Subtotal & Checkout */}
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-bold text-gray-900">
                      AED {cart.total.toFixed(2)}
                    </span>
                  </div>
                  <Button
                    onClick={() => handleCheckout(cart.providerId)}
                    className="w-full bg-[#0D9488] hover:bg-[#0B7B71] text-white"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Checkout from {cart.providerName}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Summary */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-gray-500">Total ({totalItems} items)</p>
            <p className="text-xl font-bold text-gray-900">
              AED {totalValue.toFixed(2)}
            </p>
          </div>
          <p className="text-xs text-gray-400">
            Checkout per provider
          </p>
        </div>
      </div>
    </div>
  );
}
