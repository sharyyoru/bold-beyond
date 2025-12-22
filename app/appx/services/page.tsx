"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Search, Star, Clock, Filter, Heart, ChevronRight, Loader2 } from "lucide-react";
import { sanityClient, urlFor, queries } from "@/lib/sanity";

interface Service {
  _id: string;
  title: string;
  slug: { current: string };
  description: string;
  category: string;
  basePrice: number;
  duration: number;
  image?: any;
  rating?: number;
  reviewCount?: number;
  serviceType?: string;
  provider?: {
    _id: string;
    name: string;
    slug: { current: string };
    logo?: any;
  };
}

const categories = [
  { id: "all", label: "All" },
  { id: "therapy", label: "Therapy" },
  { id: "coaching", label: "Coaching" },
  { id: "wellness", label: "Wellness" },
  { id: "groups", label: "Groups" },
  { id: "clinics", label: "Clinics" },
  { id: "fitness", label: "Fitness" },
  { id: "meditation", label: "Meditation" },
  { id: "spa", label: "Spa" },
];

function ServicesContent() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category");
  
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(categoryFromUrl || "all");

  useEffect(() => {
    // Update category when URL changes
    if (categoryFromUrl) {
      setActiveCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  useEffect(() => {
    async function fetchServices() {
      try {
        const data = await sanityClient.fetch(queries.allServices);
        setServices(data || []);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || service.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/appx" className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-gray-900">All Services</h1>
            <p className="text-xs text-gray-500">{filteredServices.length} services available</p>
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
              placeholder="Search anything..."
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

      {/* Featured Services Section */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            🔥 Featured Services
          </h2>
          <button className="text-sm text-[#0D9488] font-medium flex items-center gap-1">
            <Filter className="h-4 w-4" />
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
                <div className="flex gap-4">
                  <div className="h-24 w-24 bg-gray-200 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No services found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredServices.map((service) => (
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
                        <span className="text-xs text-gray-600">{service.rating}</span>
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

                {/* Provider Info */}
                {service.provider && (
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                    <div className="h-6 w-6 rounded-full bg-gray-200 overflow-hidden">
                      {service.provider.logo && (
                        <Image
                          src={urlFor(service.provider.logo).width(50).height(50).url()}
                          alt={service.provider.name}
                          width={24}
                          height={24}
                          className="object-cover"
                        />
                      )}
                    </div>
                    <span className="text-xs text-gray-500">{service.provider.name}</span>
                    <ChevronRight className="h-3 w-3 text-gray-400 ml-auto" />
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0D9488]" />
      </div>
    }>
      <ServicesContent />
    </Suspense>
  );
}
