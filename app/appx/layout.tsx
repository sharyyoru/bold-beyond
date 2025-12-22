"use client";

import { FavoritesProvider } from "@/contexts/favorites-context";
import { CartProvider } from "@/contexts/cart-context";

export default function AppXLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FavoritesProvider>
      <CartProvider>
        <div data-app="true" className="min-h-screen bg-gray-100 overflow-hidden">
          {children}
        </div>
      </CartProvider>
    </FavoritesProvider>
  );
}
