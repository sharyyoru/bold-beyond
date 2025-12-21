"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { toggleFavorite, checkIsFavorited, FavoriteItem } from "@/lib/favorites";
import { useToast } from "@/components/ui/use-toast";

interface FavoriteButtonProps {
  item: FavoriteItem;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function FavoriteButton({ item, className = "", size = "md" }: FavoriteButtonProps) {
  const { toast } = useToast();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkFavoriteStatus();
  }, [item.item_id]);

  const checkFavoriteStatus = async () => {
    const favorited = await checkIsFavorited(item.item_type, item.item_id);
    setIsFavorited(favorited);
  };

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsLoading(true);
    const result = await toggleFavorite(item);
    
    if (result.success) {
      setIsFavorited(result.isFavorited);
      toast({
        title: result.isFavorited ? "Added to favorites" : "Removed from favorites",
        description: result.isFavorited 
          ? `${item.item_name} has been saved to your favorites.`
          : `${item.item_name} has been removed from your favorites.`,
      });
    } else {
      toast({
        title: "Please log in",
        description: "You need to be logged in to save favorites.",
        variant: "destructive",
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
