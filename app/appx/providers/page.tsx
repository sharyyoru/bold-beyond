"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Search, Star, MapPin, Filter, Clock } from "lucide-react";
import { sanityClient, urlFor, queries } from "@/lib/sanity";

interface Provider {
  _id: string;
  name: string;
  nameAr?: string;
  slug: { current: string };
  logo?: any;
  coverImage?: any;
  category: string;
  shortDescription?: string;
  location?: {
    address?: string;
    area?: string;
    city?: string;
    distance?: string;
  };
  rating?: number;
  reviewCount?: number;
  averageSessionDuration?: string;
  priceRange?: {
    min?: number;
    max?: number;
  };
  discountText?: string;
  featured: boolean;
}

const categories = [
  { id: "all", label: "All" },
  { id: "holistic-wellness", label: "Holistic Wellness" },
  { id: "meditation", label: "Meditation" },
  { id: "spa-beauty", label: "Spa & Beauty" },
  { id: "fitness-yoga", label: "Fitness & Yoga" },
  { id: "therapy", label: "Therapy" },
  { id: "coaching", label: "Coaching" },
];

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    async function fetchProviders() {
      try {
        const data = await sanityClient.fetch(queries.allProviders);
        setProviders(data || []);
      } catch (error) {
        console.error("Error fetching providers:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProviders();
  }, []);

  const filteredProviders = providers.filter((provider) => {
    const matchesSearch = provider.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || provider.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryLabel = (category: string) => {
    return categories.find((c) => c.id === category)?.label || category;
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link
            href="/appx"
            className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-gray-900">
              Wellness Providers
            </h1>
            <p className="text-xs text-gray-500">
              {filteredProviders.length} providers available
            </p>
          </div>
          <button className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
            <Filter className="h-5 w-5 text-gray-700" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search providers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto px-4 pb-3 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? "bg-[#0D9488] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Providers List */}
      <div className="px-4 py-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden animate-pulse"
              >
                <div className="h-40 bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProviders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No providers found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProviders.map((provider) => (
              <Link
                key={provider._id}
                href={`/appx/providers/${provider.slug.current}`}
                className="block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Cover Image */}
                <div className="relative h-40">
                  {provider.coverImage ? (
                    <Image
                      src={urlFor(provider.coverImage).width(600).height(300).url()}
                      alt={provider.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-[#0D9488] to-[#7DD3D3]" />
                  )}

                  {/* Logo */}
                  <div className="absolute bottom-0 left-4 translate-y-1/2">
                    <div className="h-16 w-16 rounded-2xl bg-white shadow-lg overflow-hidden border-2 border-white">
                      {provider.logo ? (
                        <Image
                          src={urlFor(provider.logo).width(100).height(100).url()}
                          alt={provider.name}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                          <span className="text-2xl">🧘</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Rating Badge */}
                  {provider.rating && (
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold">
                        {provider.rating}
                      </span>
                      {provider.reviewCount && (
                        <span className="text-xs text-gray-500">
                          ({provider.reviewCount})
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 pt-10">
                  <h3 className="font-bold text-gray-900 text-lg mb-1">
                    {provider.name}
                  </h3>

                  {/* Category & Location */}
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                      {getCategoryLabel(provider.category)}
                    </span>
                    {provider.location?.area && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {provider.location.area}
                        {provider.location.distance && ` (${provider.location.distance})`}
                      </span>
                    )}
                  </div>

                  {/* Session & Price Info */}
                  <div className="flex items-center gap-4 text-sm mb-3">
                    {provider.averageSessionDuration && (
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{provider.averageSessionDuration}</span>
                      </div>
                    )}
                    {provider.priceRange?.min && (
                      <div className="text-gray-600">
                        <span className="text-gray-400">Service Prices: </span>
                        <span className="font-semibold text-[#0D9488]">
                          ${provider.priceRange.min}
                          {provider.priceRange.max && ` - $${provider.priceRange.max}`}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Discount Banner */}
                  {provider.discountText && (
                    <div className="bg-gradient-to-r from-[#0D9488]/10 to-[#7DD3D3]/10 rounded-xl px-3 py-2">
                      <p className="text-sm text-[#0D9488] font-medium">
                        🎁 {provider.discountText}
                      </p>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
