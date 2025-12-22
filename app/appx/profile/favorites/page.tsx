"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft, Heart, Trash2, MapPin, Star, Clock, 
  Package, Briefcase, Building2, Filter, Search
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createAppClient } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface Favorite {
  id: string;
  item_type: "provider" | "service" | "product";
  item_id: string;
  item_slug: string;
  item_name: string;
  item_image_url: string | null;
  item_category: string;
  item_price: number | null;
  created_at: string;
}

type TabType = "all" | "providers" | "services" | "products";

const tabs: { id: TabType; label: string; icon: any }[] = [
  { id: "all", label: "All", icon: Heart },
  { id: "providers", label: "Providers", icon: Building2 },
  { id: "services", label: "Services", icon: Briefcase },
  { id: "products", label: "Products", icon: Package },
];

export default function FavoritesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const supabase = createAppClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/appx/login");
        return;
      }

      const { data, error } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFavorites(data || []);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      toast({
        title: "Error",
        description: "Failed to load favorites",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (favoriteId: string) => {
    try {
      const supabase = createAppClient();
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("id", favoriteId);

      if (error) throw error;

      setFavorites(prev => prev.filter(f => f.id !== favoriteId));
      toast({
        title: "Removed",
        description: "Item removed from favorites",
      });
    } catch (error) {
      console.error("Error removing favorite:", error);
      toast({
        title: "Error",
        description: "Failed to remove favorite",
        variant: "destructive",
      });
    }
  };

  const filteredFavorites = favorites.filter(fav => {
    const matchesTab = activeTab === "all" || fav.item_type === activeTab.slice(0, -1);
    const matchesSearch = fav.item_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getItemLink = (fav: Favorite) => {
    switch (fav.item_type) {
      case "provider":
        return `/appx/providers/${fav.item_slug}`;
      case "service":
        return `/appx/services/${fav.item_slug}`;
      case "product":
        return `/appx/products/${fav.item_slug}`;
      default:
        return "#";
    }
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case "provider":
        return Building2;
      case "service":
        return Briefcase;
      case "product":
        return Package;
      default:
        return Heart;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      spa: "bg-purple-100 text-purple-700",
      fitness: "bg-blue-100 text-blue-700",
      therapy: "bg-green-100 text-green-700",
      wellness: "bg-teal-100 text-teal-700",
      beauty: "bg-pink-100 text-pink-700",
      nutrition: "bg-orange-100 text-orange-700",
      yoga: "bg-indigo-100 text-indigo-700",
      meditation: "bg-cyan-100 text-cyan-700",
      skincare: "bg-rose-100 text-rose-700",
      supplements: "bg-emerald-100 text-emerald-700",
      aromatherapy: "bg-violet-100 text-violet-700",
    };
    return colors[category] || "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-teal"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-4 py-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={() => router.back()}
            className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">My Favorites</h1>
            <p className="text-sm text-gray-500">{favorites.length} saved items</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search favorites..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-teal"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const count = tab.id === "all" 
              ? favorites.length 
              : favorites.filter(f => f.item_type === tab.id.slice(0, -1)).length;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-brand-teal text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{tab.label}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.id ? "bg-white/20" : "bg-gray-200"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        {filteredFavorites.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-10 w-10 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-500 mb-6">
              {activeTab === "all" 
                ? "Start exploring and save your favorite items!"
                : `You haven't saved any ${activeTab} yet.`}
            </p>
            <Link href="/appx">
              <Button variant="teal">Explore Now</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filteredFavorites.map((fav) => {
              const ItemIcon = getItemIcon(fav.item_type);
              
              return (
                <Card key={fav.id} className="border-0 shadow-sm overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex">
                      {/* Image */}
                      <Link href={getItemLink(fav)} className="flex-shrink-0">
                        <div className="w-28 h-28 bg-gradient-to-br from-brand-navy/80 to-brand-teal/60 relative">
                          {fav.item_image_url ? (
                            <Image
                              src={fav.item_image_url}
                              alt={fav.item_name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <ItemIcon className="h-10 w-10 text-white/50" />
                            </div>
                          )}
                        </div>
                      </Link>

                      {/* Content */}
                      <div className="flex-1 p-3 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <Link href={getItemLink(fav)} className="flex-1">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${getCategoryColor(fav.item_category)}`}>
                                {fav.item_category}
                              </span>
                              <h4 className="text-sm font-semibold text-gray-900 mt-1 line-clamp-2">
                                {fav.item_name}
                              </h4>
                            </Link>
                            <button
                              onClick={() => removeFavorite(fav.id)}
                              className="h-8 w-8 rounded-full bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500 capitalize flex items-center gap-1">
                            <ItemIcon className="h-3 w-3" />
                            {fav.item_type}
                          </span>
                          {fav.item_price && (
                            <span className="text-sm font-bold text-brand-teal">
                              {fav.item_price} AED
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
