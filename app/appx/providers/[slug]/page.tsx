"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Star,
  MapPin,
  Heart,
  Share2,
  Clock,
  Phone,
  MessageCircle,
  Globe,
  Instagram,
  ChevronRight,
  Search,
  Filter,
} from "lucide-react";
import { sanityClient, urlFor, queries } from "@/lib/sanity";
import { Button } from "@/components/ui/button";

interface Provider {
  _id: string;
  name: string;
  nameAr?: string;
  slug: { current: string };
  logo?: any;
  coverImage?: any;
  gallery?: any[];
  category: string;
  shortDescription?: string;
  shortDescriptionAr?: string;
  description?: any[];
  location?: {
    address?: string;
    area?: string;
    city?: string;
    distance?: string;
    mapUrl?: string;
  };
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
    instagram?: string;
    whatsapp?: string;
  };
  averageSessionDuration?: string;
  priceRange?: {
    min?: number;
    max?: number;
  };
  rating?: number;
  reviewCount?: number;
  discountText?: string;
  amenities?: string[];
  openingHours?: Array<{
    days: string;
    hours: string;
  }>;
  services?: Array<{
    _id: string;
    title: string;
    slug: { current: string };
    description?: string;
    category: string;
    basePrice?: number;
    duration?: number;
    image?: any;
    rating?: number;
    serviceType?: string;
  }>;
  products?: Array<{
    _id: string;
    name: string;
    slug: { current: string };
    images?: any[];
    price: number;
    salePrice?: number;
    discountPercentage?: number;
    category: string;
  }>;
}

const serviceCategories = [
  { id: "all", label: "All" },
  { id: "meditation", label: "Meditation" },
  { id: "therapy", label: "Therapy" },
  { id: "yoga", label: "Yoga" },
  { id: "wellness", label: "Wellness" },
];

export default function ProviderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<"services" | "products">("services");
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchProvider() {
      if (!params.slug) return;
      try {
        const data = await sanityClient.fetch(queries.providerBySlug, {
          slug: params.slug,
        });
        setProvider(data);
      } catch (error) {
        console.error("Error fetching provider:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProvider();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7]">
        <div className="animate-pulse">
          <div className="h-56 bg-gray-200" />
          <div className="p-4 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-20 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Provider not found</p>
          <Link href="/appx/providers" className="text-[#0D9488] font-medium">
            Back to Providers
          </Link>
        </div>
      </div>
    );
  }

  const filteredServices = provider.services?.filter((service) => {
    const matchesSearch = service.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || service.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-6">
      {/* Hero Section */}
      <div className="relative">
        {/* Cover Image */}
        <div className="h-56 relative">
          {provider.coverImage ? (
            <Image
              src={urlFor(provider.coverImage).width(800).height(400).url()}
              alt={provider.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-[#1B365D] to-[#0D9488]" />
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* Header Buttons */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="h-10 w-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center"
            >
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="h-10 w-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center"
              >
                <Heart
                  className={`h-5 w-5 ${
                    isFavorite ? "fill-red-500 text-red-500" : "text-gray-700"
                  }`}
                />
              </button>
              <button className="h-10 w-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center">
                <Share2 className="h-5 w-5 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Logo */}
          <div className="absolute -bottom-8 left-4">
            <div className="h-20 w-20 rounded-2xl bg-white shadow-lg overflow-hidden border-4 border-white">
              {provider.logo ? (
                <Image
                  src={urlFor(provider.logo).width(150).height(150).url()}
                  alt={provider.name}
                  width={80}
                  height={80}
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                  <span className="text-3xl">🧘</span>
                </div>
              )}
            </div>
          </div>

          {/* Rating Badge */}
          {provider.rating && (
            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-gray-900">{provider.rating}</span>
              {provider.reviewCount && (
                <span className="text-sm text-gray-500">
                  ({provider.reviewCount} ratings)
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-12">
        {/* Provider Name & Category */}
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{provider.name}</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span className="bg-gray-100 px-2 py-0.5 rounded">
            {provider.category.replace("-", " ")}
          </span>
          {provider.location?.area && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {provider.location.area}
              {provider.location.distance && ` (${provider.location.distance})`}
            </span>
          )}
        </div>

        {/* Session & Price Row */}
        <div className="flex items-center gap-6 py-3 border-y border-gray-100 mb-4">
          {provider.averageSessionDuration && (
            <div>
              <p className="text-xs text-gray-400">Average Session</p>
              <p className="font-semibold text-gray-900">
                {provider.averageSessionDuration}
              </p>
            </div>
          )}
          {provider.priceRange?.min && (
            <div>
              <p className="text-xs text-gray-400">Service Prices</p>
              <p className="font-semibold text-[#0D9488]">
                ${provider.priceRange.min}
                {provider.priceRange.max && ` - $${provider.priceRange.max}`}
              </p>
            </div>
          )}
        </div>

        {/* Discount Banner */}
        {provider.discountText && (
          <div className="bg-gradient-to-r from-[#0D9488]/10 to-[#7DD3D3]/10 rounded-xl px-4 py-3 mb-4">
            <p className="text-sm text-[#0D9488] font-medium">
              🎁 {provider.discountText}
            </p>
          </div>
        )}

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search anything..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide mb-2">
          {serviceCategories.map((cat) => (
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
          <button className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
            <Filter className="h-4 w-4 text-gray-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200 mb-4">
          <button
            onClick={() => setActiveTab("services")}
            className={`pb-3 text-sm font-semibold transition-colors ${
              activeTab === "services"
                ? "text-[#0D9488] border-b-2 border-[#0D9488]"
                : "text-gray-500"
            }`}
          >
            🔥 Featured Services
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`pb-3 text-sm font-semibold transition-colors ${
              activeTab === "products"
                ? "text-[#0D9488] border-b-2 border-[#0D9488]"
                : "text-gray-500"
            }`}
          >
            Products
          </button>
        </div>

        {/* Services List */}
        {activeTab === "services" && (
          <div className="space-y-3">
            {filteredServices && filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <Link
                  key={service._id}
                  href={`/appx/services/${service.slug.current}`}
                  className="block bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-4">
                    {/* Service Image */}
                    <div className="relative h-24 w-24 rounded-xl overflow-hidden bg-gradient-to-br from-[#0D9488] to-[#7DD3D3] flex-shrink-0">
                      {service.image ? (
                        <Image
                          src={urlFor(service.image).width(200).height(200).url()}
                          alt={service.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <span className="text-white text-2xl">🧘</span>
                        </div>
                      )}
                      {/* Category Badge */}
                      <span className="absolute top-2 left-2 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                        {service.category}
                      </span>
                    </div>

                    {/* Service Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 line-clamp-1 mb-1">
                        {service.title}
                      </h3>
                      <p className="text-xs text-gray-500 mb-2">
                        {service.serviceType || service.category}
                      </p>

                      <div className="flex items-center gap-3 text-sm">
                        <span className="font-bold text-[#0D9488]">
                          {service.basePrice} AED
                        </span>
                        {service.duration && (
                          <span className="text-gray-400 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {service.duration}min
                          </span>
                        )}
                      </div>

                      {/* Rating */}
                      {service.rating && (
                        <div className="flex items-center gap-1 mt-2">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-gray-600">
                            {service.rating}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center self-start"
                    >
                      <Heart className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No services available</p>
              </div>
            )}
          </div>
        )}

        {/* Products List */}
        {activeTab === "products" && (
          <div className="space-y-3">
            {provider.products && provider.products.length > 0 ? (
              provider.products.map((product) => (
                <Link
                  key={product._id}
                  href={`/appx/products/${product.slug.current}`}
                  className="block bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="flex">
                    {/* Product Image */}
                    <div className="relative h-28 w-24 bg-gray-100 flex-shrink-0">
                      {product.images && product.images[0] ? (
                        <Image
                          src={urlFor(product.images[0]).width(200).height(200).url()}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <span className="text-3xl">🧴</span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 p-3 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm mb-1">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-1">
                          {product.salePrice ? (
                            <>
                              <span className="text-gray-400 line-through text-xs">
                                AED {product.price}
                              </span>
                              <span className="text-gray-500">→</span>
                              <span className="font-bold text-[#0D9488]">
                                AED {product.salePrice}
                              </span>
                            </>
                          ) : (
                            <span className="font-bold text-gray-900">
                              AED {product.price}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Discount Badge */}
                    {product.discountPercentage && (
                      <div className="flex flex-col items-center justify-center px-3 bg-[#E0F4F4] border-l border-[#0D9488]/20">
                        <span className="text-[#0D9488] font-bold text-sm">
                          Save {product.discountPercentage}%
                        </span>
                        <button className="mt-2 bg-[#0D9488] text-white text-xs font-medium px-4 py-1.5 rounded-full">
                          Redeem
                        </button>
                      </div>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No products available</p>
              </div>
            )}
          </div>
        )}

        {/* Shop by Category */}
        {provider.services && provider.services.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-900">Shop by Category</h2>
              <button className="text-sm text-[#0D9488] font-medium">
                See All
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative h-32 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0D9488] to-[#7DD3D3]" />
                <div className="absolute inset-0 flex items-end p-3">
                  <span className="text-white font-semibold">
                    Massage Therapies
                  </span>
                </div>
              </div>
              <div className="relative h-32 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-400" />
                <div className="absolute inset-0 flex items-end p-3">
                  <span className="text-white font-semibold">Beauty Products</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contact Section */}
        {provider.contact && (
          <div className="mt-6 bg-white rounded-2xl p-4 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-3">Contact</h2>
            <div className="flex flex-wrap gap-2">
              {provider.contact.phone && (
                <a
                  href={`tel:${provider.contact.phone}`}
                  className="flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2 text-sm text-gray-700"
                >
                  <Phone className="h-4 w-4" />
                  Call
                </a>
              )}
              {provider.contact.whatsapp && (
                <a
                  href={`https://wa.me/${provider.contact.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-[#25D366] rounded-xl px-4 py-2 text-sm text-white"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              )}
              {provider.contact.website && (
                <a
                  href={provider.contact.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2 text-sm text-gray-700"
                >
                  <Globe className="h-4 w-4" />
                  Website
                </a>
              )}
              {provider.contact.instagram && (
                <a
                  href={`https://instagram.com/${provider.contact.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl px-4 py-2 text-sm text-white"
                >
                  <Instagram className="h-4 w-4" />
                  Instagram
                </a>
              )}
            </div>
          </div>
        )}

        {/* Opening Hours */}
        {provider.openingHours && provider.openingHours.length > 0 && (
          <div className="mt-4 bg-white rounded-2xl p-4 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-3">Opening Hours</h2>
            <div className="space-y-2">
              {provider.openingHours.map((schedule, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-500">{schedule.days}</span>
                  <span className="font-medium text-gray-900">
                    {schedule.hours}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Location */}
        {provider.location?.address && (
          <div className="mt-4 bg-white rounded-2xl p-4 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-3">Location</h2>
            <p className="text-sm text-gray-600 mb-3">{provider.location.address}</p>
            {provider.location.mapUrl && (
              <a
                href={provider.location.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-[#0D9488] font-medium"
              >
                <MapPin className="h-4 w-4" />
                View on Google Maps
                <ChevronRight className="h-4 w-4" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
