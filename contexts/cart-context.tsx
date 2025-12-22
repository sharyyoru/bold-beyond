"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CartItem {
  productId: string;
  productName: string;
  productSlug: string;
  productImage?: string;
  price: number;
  salePrice?: number;
  quantity: number;
  providerId: string;
  providerName: string;
  providerSlug: string;
}

export interface ProviderCart {
  providerId: string;
  providerName: string;
  providerSlug: string;
  items: CartItem[];
  total: number;
}

interface CartContextType {
  carts: Record<string, ProviderCart>; // keyed by providerId
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeFromCart: (providerId: string, productId: string) => void;
  updateQuantity: (providerId: string, productId: string, quantity: number) => void;
  clearProviderCart: (providerId: string) => void;
  clearAllCarts: () => void;
  getProviderCart: (providerId: string) => ProviderCart | null;
  getCartItemCount: (providerId?: string) => number;
  getTotalCartValue: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "boldandbeyond_carts";

export function CartProvider({ children }: { children: ReactNode }) {
  const [carts, setCarts] = useState<Record<string, ProviderCart>>({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Load carts from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setCarts(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading carts from storage:", error);
    }
    setIsInitialized(true);
  }, []);

  // Save carts to localStorage whenever they change
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(carts));
      } catch (error) {
        console.error("Error saving carts to storage:", error);
      }
    }
  }, [carts, isInitialized]);

  const calculateTotal = (items: CartItem[]): number => {
    return items.reduce((sum, item) => {
      const price = item.salePrice || item.price;
      return sum + price * item.quantity;
    }, 0);
  };

  const addToCart = (item: Omit<CartItem, "quantity">, quantity: number = 1) => {
    setCarts((prev) => {
      const providerId = item.providerId;
      const existingCart = prev[providerId];

      if (existingCart) {
        // Check if product already exists in cart
        const existingItemIndex = existingCart.items.findIndex(
          (i) => i.productId === item.productId
        );

        let updatedItems: CartItem[];
        if (existingItemIndex >= 0) {
          // Update quantity of existing item
          updatedItems = existingCart.items.map((i, index) =>
            index === existingItemIndex
              ? { ...i, quantity: i.quantity + quantity }
              : i
          );
        } else {
          // Add new item
          updatedItems = [...existingCart.items, { ...item, quantity }];
        }

        return {
          ...prev,
          [providerId]: {
            ...existingCart,
            items: updatedItems,
            total: calculateTotal(updatedItems),
          },
        };
      } else {
        // Create new cart for this provider
        const newItems = [{ ...item, quantity }];
        return {
          ...prev,
          [providerId]: {
            providerId: item.providerId,
            providerName: item.providerName,
            providerSlug: item.providerSlug,
            items: newItems,
            total: calculateTotal(newItems),
          },
        };
      }
    });
  };

  const removeFromCart = (providerId: string, productId: string) => {
    setCarts((prev) => {
      const cart = prev[providerId];
      if (!cart) return prev;

      const updatedItems = cart.items.filter((i) => i.productId !== productId);

      if (updatedItems.length === 0) {
        // Remove empty cart
        const { [providerId]: _, ...rest } = prev;
        return rest;
      }

      return {
        ...prev,
        [providerId]: {
          ...cart,
          items: updatedItems,
          total: calculateTotal(updatedItems),
        },
      };
    });
  };

  const updateQuantity = (providerId: string, productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(providerId, productId);
      return;
    }

    setCarts((prev) => {
      const cart = prev[providerId];
      if (!cart) return prev;

      const updatedItems = cart.items.map((i) =>
        i.productId === productId ? { ...i, quantity } : i
      );

      return {
        ...prev,
        [providerId]: {
          ...cart,
          items: updatedItems,
          total: calculateTotal(updatedItems),
        },
      };
    });
  };

  const clearProviderCart = (providerId: string) => {
    setCarts((prev) => {
      const { [providerId]: _, ...rest } = prev;
      return rest;
    });
  };

  const clearAllCarts = () => {
    setCarts({});
  };

  const getProviderCart = (providerId: string): ProviderCart | null => {
    return carts[providerId] || null;
  };

  const getCartItemCount = (providerId?: string): number => {
    if (providerId) {
      const cart = carts[providerId];
      return cart ? cart.items.reduce((sum, i) => sum + i.quantity, 0) : 0;
    }
    // Total across all carts
    return Object.values(carts).reduce(
      (sum, cart) => sum + cart.items.reduce((s, i) => s + i.quantity, 0),
      0
    );
  };

  const getTotalCartValue = (): number => {
    return Object.values(carts).reduce((sum, cart) => sum + cart.total, 0);
  };

  return (
    <CartContext.Provider
      value={{
        carts,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearProviderCart,
        clearAllCarts,
        getProviderCart,
        getCartItemCount,
        getTotalCartValue,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
