"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { useFavorites, FavoriteItem } from "@/contexts/favorites-context";
import { useToast } from "@/components/ui/use-toast";

interface FavoriteButtonProps {
  item: Omit<FavoriteItem, "id">;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function FavoriteButton({ item, className = "", size = "md" }: FavoriteButtonProps) {
  const { toast } = useToast();
  const { isFavorited: checkFavorited, toggleFavorite } = useFavorites();
  const [isLoading, setIsLoading] = useState(false);

  const isFavorited = checkFavorited(item.item_type, item.item_id);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsLoading(true);
    try {
      await toggleFavorite(item);
      // Silent success - no toast needed for favorites
    } catch (error) {
      toast({
        title: "Please log in",
        description: "Sign in to save favorites.",
        variant: "destructive",
        duration: 2000,
      });
    }
    setIsLoading(false);
  };

  const sizeClasses = {
    sm: "h-7 w-7",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center transition-all ${
        isFavorited 
          ? "bg-red-500 hover:bg-red-600" 
          : "bg-white/80 hover:bg-white"
      } ${isLoading ? "opacity-50" : ""} ${className}`}
    >
      <Heart 
        className={`${iconSizes[size]} ${
          isFavorited ? "text-white fill-white" : "text-gray-400"
        }`} 
      />
    </button>
  );
}
