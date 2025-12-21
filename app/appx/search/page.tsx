"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Search,
  X,
  Star,
  Clock,
  MapPin,
  Filter,
  TrendingUp,
  Sparkles,
  ShoppingBag,
  Briefcase,
  Building2,
  ChevronRight,
  Heart,
} from "lucide-react";
import { sanityClient, urlFor } from "@/lib/sanity";
import { useFavorites } from "@/contexts/favorites-context";

// Types
interface SearchResult {
  _id: string;
  type: "service" | "product" | "provider";
  name: string;
  slug: string;
  image?: any;
  category?: string;
  price?: number;
  salePrice?: number;
  rating?: number;
  reviewCount?: number;
  location?: string;
  duration?: number;
}

// Categories for filters
const categories = [
  { id: "all", label: "All", icon: Sparkles },
  { id: "services", label: "Services", icon: Briefcase },
  { id: "products", label: "Products", icon: ShoppingBag },
  { id: "providers", label: "Providers", icon: Building2 },
];

// Price ranges
const priceRanges = [
  { id: "all", label: "Any Price" },
  { id: "0-50", label: "Under 50 AED" },
  { id: "50-100", label: "50-100 AED" },
  { id: "100-200", label: "100-200 AED" },
  { id: "200+", label: "200+ AED" },
];

// Top searches (can be dynamic later)
const topSearches = [
  "Massage",
  "Facial",
  "Yoga",
  "Meditation",
  "Hair Treatment",
  "Wellness",
  "Spa",
  "Fitness",
];

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isFavorited, toggleFavorite } = useFavorites();
  
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [activeCategory, setActiveCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const [results, setResults] = useState<SearchResult[]>([]);
  const [topRatedServices, setTopRatedServices] = useState<SearchResult[]>([]);
  const [topRatedProducts, setTopRatedProducts] = useState<SearchResult[]>([]);
  const [topRatedProviders, setTopRatedProviders] = useState<SearchResult[]>([]);

  // Fetch top rated items on mount
  useEffect(() => {
    async function fetchTopRated() {
      try {
        // Top rated services
        const services = await sanityClient.fetch(`
          *[_type == "service"] | order(rating desc) [0...6] {
            _id,
            "name": title,
            "slug": slug.current,
            image,
            category,
            "price": basePrice,
            rating,
            reviewCount,
            duration
          }
        `);
        setTopRatedServices(services.map((s: any) => ({ ...s, type: "service" })));

        // Top rated products
        const products = await sanityClient.fetch(`
          *[_type == "product"] | order(rating desc) [0...6] {
            _id,
            name,
            "slug": slug.current,
            "image": images[0],
            category,
            price,
            salePrice,
            rating,
            reviewCount
          }
        `);
        setTopRatedProducts(products.map((p: any) => ({ ...p, type: "product" })));

        // Top rated providers
        const providers = await sanityClient.fetch(`
          *[_type == "provider"] | order(rating desc) [0...6] {
            _id,
            name,
            "slug": slug.current,
            "image": logo,
            "category": category->name,
            rating,
            reviewCount,
            "location": location.area
          }
        `);
        setTopRatedProviders(providers.map((p: any) => ({ ...p, type: "provider" })));
      } catch (error) {
        console.error("Error fetching top rated:", error);
      }
    }
    fetchTopRated();
  }, []);

  // Search function
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const searchTerm = `*${searchQuery}*`;
      
      // Build category filter
      let typeFilter = "";
      if (activeCategory === "services") typeFilter = '_type == "service"';
      else if (activeCategory === "products") typeFilter = '_type == "product"';
      else if (activeCategory === "providers") typeFilter = '_type == "provider"';
      else typeFilter = '_type in ["service", "product", "provider"]';

      // Search services
      const servicesQuery = activeCategory === "all" || activeCategory === "services" ? `
        *[_type == "service" && (title match "${searchTerm}" || description match "${searchTerm}" || category match "${searchTerm}")] {
          _id,
          "type": "service",
          "name": title,
          "slug": slug.current,
          image,
          category,
          "price": basePrice,
          rating,
          reviewCount,
          duration
        }
      ` : null;

      // Search products
      const productsQuery = activeCategory === "all" || activeCategory === "products" ? `
        *[_type == "product" && (name match "${searchTerm}" || description match "${searchTerm}" || category match "${searchTerm}")] {
          _id,
          "type": "product",
          name,
          "slug": slug.current,
          "image": images[0],
          category,
          price,
          salePrice,
          rating,
          reviewCount
        }
      ` : null;

      // Search providers
      const providersQuery = activeCategory === "all" || activeCategory === "providers" ? `
        *[_type == "provider" && (name match "${searchTerm}" || description match "${searchTerm}")] {
          _id,
          "type": "provider",
          name,
          "slug": slug.current,
          "image": logo,
          "category": category->name,
          rating,
          reviewCount,
          "location": location.area
        }
      ` : null;

      const queries = [servicesQuery, productsQuery, providersQuery].filter(Boolean);
      const allResults = await Promise.all(queries.map(q => sanityClient.fetch(q!)));
      
      let combined = allResults.flat();

      // Apply price filter
      if (priceRange !== "all") {
        const [min, max] = priceRange.split("-").map(Number);
        combined = combined.filter((item: SearchResult) => {
          const itemPrice = item.salePrice || item.price || 0;
          if (priceRange === "200+") return itemPrice >= 200;
          return itemPrice >= min && itemPrice <= max;
        });
      }

      setResults(combined);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  }, [activeCategory, priceRange]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, performSearch]);

  const handleTopSearch = (term: string) => {
    setQuery(term);
  };

  const handleFavorite = async (item: SearchResult) => {
    await toggleFavorite({
      item_type: item.type,
      item_id: item._id,
      item_slug: item.slug,
      item_name: item.name,
      item_image_url: item.image ? urlFor(item.image).width(300).url() : null,
      item_category: item.category || "",
      item_price: item.salePrice || item.price || null,
    });
  };

  const getItemLink = (item: SearchResult) => {
    if (item.type === "service") return `/appx/services/${item.slug}`;
    if (item.type === "product") return `/appx/products/${item.slug}`;
    return `/appx/providers/${item.slug}`;
  };

  // Render result card
  const ResultCard = ({ item }: { item: SearchResult }) => (
    <Link href={getItemLink(item)} className="block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="relative h-32">
          {item.image ? (
            <Image
              src={urlFor(item.image).width(400).height(300).url()}
              alt={item.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <span className="text-3xl">
                {item.type === "service" ? "💆" : item.type === "product" ? "🧴" : "🏢"}
              </span>
            </div>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              handleFavorite(item);
            }}
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 flex items-center justify-center"
          >
            <Heart
              className={`h-4 w-4 ${
                isFavorited(item.type, item._id)
                  ? "fill-red-500 text-red-500"
                  : "text-gray-600"
              }`}
            />
          </button>
          <span className="absolute top-2 left-2 px-2 py-1 bg-white/90 rounded-full text-xs font-medium text-gray-700 capitalize">
            {item.type}
          </span>
        </div>
        <div className="p-3">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{item.name}</h3>
          <p className="text-xs text-gray-500 mb-2">{item.category}</p>
          <div className="flex items-center justify-between">
            {item.price && (
              <span className="text-[#0D9488] font-bold text-sm">
                {item.salePrice ? (
                  <>
                    <span className="text-gray-400 line-through text-xs mr-1">{item.price}</span>
                    {item.salePrice}
                  </>
                ) : (
                  item.price
                )} AED
              </span>
            )}
            {item.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="text-xs font-medium">{item.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );

  // Top Rated Section
  const TopRatedSection = ({ title, items, icon: Icon }: { title: string; items: SearchResult[]; icon: any }) => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Icon className="h-5 w-5 text-[#D4AF37]" />
          {title}
        </h2>
        <Link href="#" className="text-sm text-[#0D9488] font-medium flex items-center gap-1">
          See All <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {items.map((item) => (
          <div key={item._id} className="flex-shrink-0 w-44">
            <ResultCard item={item} />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search services, products, providers..."
              autoFocus
              className="w-full pl-12 pr-10 py-3 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`h-10 w-10 rounded-full flex items-center justify-center ${
              showFilters ? "bg-[#0D9488] text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            <Filter className="h-5 w-5" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? "bg-[#0D9488] text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              <cat.icon className="h-4 w-4" />
              {cat.label}
            </button>
          ))}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-3 p-4 bg-gray-50 rounded-xl">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Price Range</h4>
            <div className="flex flex-wrap gap-2">
              {priceRanges.map((range) => (
                <button
                  key={range.id}
                  onClick={() => setPriceRange(range.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    priceRange === range.id
                      ? "bg-[#D4AF37] text-white"
                      : "bg-white text-gray-700 border border-gray-200"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {/* Search Results */}
        {query ? (
          <div>
            <p className="text-sm text-gray-500 mb-4">
              {isSearching ? "Searching..." : `${results.length} results for "${query}"`}
            </p>
            {results.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {results.map((item) => (
                  <ResultCard key={`${item.type}-${item._id}`} item={item} />
                ))}
              </div>
            ) : !isSearching && (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-gray-500">No results found</p>
                <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Top Searches */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-[#D4AF37]" />
                Top Searches
              </h2>
              <div className="flex flex-wrap gap-2">
                {topSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleTopSearch(term)}
                    className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 border border-gray-200 hover:border-[#0D9488] hover:text-[#0D9488] transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Top Rated Sections */}
            {topRatedServices.length > 0 && (
              <TopRatedSection
                title="Top Rated Services"
                items={topRatedServices}
                icon={Briefcase}
              />
            )}
            {topRatedProducts.length > 0 && (
              <TopRatedSection
                title="Top Rated Products"
                items={topRatedProducts}
                icon={ShoppingBag}
              />
            )}
            {topRatedProviders.length > 0 && (
              <TopRatedSection
                title="Top Rated Providers"
                items={topRatedProviders}
                icon={Building2}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold"></div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
