"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { createSupabaseClient } from "@/lib/supabase";

export interface FavoriteItem {
  id: string;
  item_type: "provider" | "service" | "product";
  item_id: string;
  item_slug: string;
  item_name: string;
  item_image_url: string | null;
  item_category: string;
  item_price: number | null;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  isLoading: boolean;
  isFavorited: (itemType: string, itemId: string) => boolean;
  toggleFavorite: (item: Omit<FavoriteItem, "id">) => Promise<boolean>;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const supabase = createSupabaseClient();

  const fetchFavorites = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setFavorites([]);
        setUserId(null);
        setIsLoading(false);
        return;
      }

      setUserId(user.id);

      // Try to fetch favorites, but don't break if table doesn't exist
      try {
        const { data, error } = await supabase
          .from("favorites")
          .select("*")
          .eq("user_id", user.id);

        if (!error && data) {
          setFavorites(data);
        } else {
          setFavorites([]);
        }
      } catch {
        // Table might not exist yet
        setFavorites([]);
      }
    } catch (error) {
      console.error("Error in fetchFavorites:", error);
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        fetchFavorites();
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchFavorites]);

  const isFavorited = useCallback((itemType: string, itemId: string): boolean => {
    return favorites.some(f => f.item_type === itemType && f.item_id === itemId);
  }, [favorites]);

  const toggleFavorite = useCallback(async (item: Omit<FavoriteItem, "id">): Promise<boolean> => {
    if (!userId) return false;

    const existing = favorites.find(
      f => f.item_type === item.item_type && f.item_id === item.item_id
    );

    try {
      if (existing) {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("id", existing.id);

        if (error) throw error;

        setFavorites(prev => prev.filter(f => f.id !== existing.id));
        return false;
      } else {
        const { data, error } = await supabase
          .from("favorites")
          .insert({
            user_id: userId,
            ...item,
          })
          .select()
          .single();

        if (error) throw error;

        setFavorites(prev => [...prev, data]);
        return true;
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      return existing ? true : false;
    }
  }, [userId, favorites]);

  const value: FavoritesContextType = {
    favorites,
    isLoading,
    isFavorited,
    toggleFavorite,
    refreshFavorites: fetchFavorites,
  };

  return React.createElement(
    FavoritesContext.Provider,
    { value },
    children
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
