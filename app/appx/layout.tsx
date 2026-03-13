"use client";

import { FavoritesProvider } from "@/contexts/favorites-context";
import { CartProvider } from "@/contexts/cart-context";
import { LoadingProvider } from "@/components/providers/LoadingProvider";

export default function AppXLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LoadingProvider>
      <FavoritesProvider>
        <CartProvider>
          <div data-app="true" className="min-h-screen bg-gray-100 overflow-hidden">
            {children}
          </div>
        </CartProvider>
      </FavoritesProvider>
    </LoadingProvider>
  );
}
