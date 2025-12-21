"use client";

import { FavoritesProvider } from "@/contexts/favorites-context";

export default function AppXLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FavoritesProvider>
      <div data-app="true" className="min-h-screen bg-gray-100 overflow-hidden">
        {children}
      </div>
    </FavoritesProvider>
  );
}
