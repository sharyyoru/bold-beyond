"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Search, Filter, ShoppingBag } from "lucide-react";
import { sanityClient, urlFor, queries } from "@/lib/sanity";

interface Product {
  _id: string;
  name: string;
  nameAr?: string;
  slug: { current: string };
  images?: any[];
  category: string;
  price: number;
  salePrice?: number;
  discountPercentage?: number;
  featured: boolean;
  provider?: {
    _id: string;
    name: string;
    slug: { current: string };
    logo?: any;
  };
}

const categories = [
  { id: "all", label: "All" },
  { id: "skincare", label: "Skincare" },
  { id: "supplements", label: "Supplements" },
  { id: "self-care", label: "Self-care tools" },
  { id: "aromatherapy", label: "Aromatherapy" },
  { id: "wellness", label: "Wellness" },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await sanityClient.fetch(queries.allProducts);
        setProducts(data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#7DD3D3] via-[#B8D4E8] to-[#E8D5F0]">
      {/* Header */}
      <div className="sticky top-0 z-50">
        <div className="bg-gradient-to-r from-[#0D9488] to-[#7DD3D3] px-4 py-4 pb-6">
          <div className="flex items-center gap-3 mb-4">
            <Link
              href="/appx"
              className="h-10 w-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </Link>
            <h1 className="text-lg font-bold text-white flex-1">
              Wellness Products
            </h1>
            <button className="h-10 w-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
              <ShoppingBag className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Promo Banner */}
          <div className="bg-white/20 backdrop-blur rounded-2xl p-4 text-center">
            <p className="text-white/80 text-sm">Shop our trending products</p>
            <h2 className="text-2xl font-bold text-white mb-1">Top Picks</h2>
            <div className="flex items-center justify-center gap-2">
              <span className="text-yellow-300 text-sm">⭐ 4.8/5 · 35.4k+ customers</span>
            </div>
            <div className="mt-2">
              <span className="inline-block bg-[#25D366] text-white text-xs font-bold px-3 py-1 rounded-full">
                🎁 20% off for first-timers
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Card */}
      <div className="bg-white rounded-t-[2rem] -mt-4 min-h-screen">
        <div className="px-4 py-5">
          {/* Title */}
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              Discover Wellness Products You'll Love
            </h2>
            <p className="text-sm text-gray-500">
              Shop smarter with exclusive Bold & Beyond coupons for skincare,
              aromatherapy, supplements, and more.
            </p>
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
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

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal"
            />
          </div>

          {/* Section Title */}
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900">Mind & Mood Boosters</h3>
            <p className="text-xs text-gray-500">
              Feeling blue or anxious? These products help reset your emotional balance.
            </p>
          </div>

          {/* Products List */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-100 rounded-2xl p-4 animate-pulse">
                  <div className="flex gap-4">
                    <div className="h-24 w-24 bg-gray-200 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No products found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredProducts.map((product) => (
                <Link
                  key={product._id}
                  href={`/appx/products/${product.slug.current}`}
                  className="block bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="flex">
                    {/* Product Image */}
                    <div className="relative h-32 w-28 bg-gray-100 flex-shrink-0">
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
                        {/* Prices */}
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
                        {/* Provider */}
                        {product.provider && (
                          <p className="text-xs text-gray-500">
                            {product.provider.name}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Discount Badge */}
                    {product.discountPercentage && (
                      <div className="flex flex-col items-center justify-center px-3 bg-[#E0F4F4] border-l border-[#0D9488]/20">
                        <span className="text-[#0D9488] font-bold text-sm">
                          Save {product.discountPercentage}%
                        </span>
                        <span className="text-[#0D9488] text-xs">Claim now</span>
                        <button className="mt-2 bg-[#0D9488] text-white text-xs font-medium px-4 py-1.5 rounded-full">
                          Redeem
                        </button>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
