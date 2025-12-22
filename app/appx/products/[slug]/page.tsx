"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Star,
  Heart,
  Share2,
  Minus,
  Plus,
  ShoppingBag,
  Check,
  ChevronRight,
  Truck,
  Shield,
  RefreshCw,
} from "lucide-react";
import { sanityClient, urlFor, queries } from "@/lib/sanity";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/contexts/favorites-context";
import { useCart } from "@/contexts/cart-context";
import { urlFor as sanityUrlFor } from "@/lib/sanity";

interface Product {
  _id: string;
  name: string;
  nameAr?: string;
  slug: { current: string };
  description?: string;
  descriptionAr?: string;
  images?: any[];
  category: string;
  price: number;
  salePrice?: number;
  discountPercentage?: number;
  sku?: string;
  stock?: number;
  features?: string[];
  provider?: {
    _id: string;
    name: string;
    nameAr?: string;
    slug: { current: string };
    logo?: any;
    location?: {
      address?: string;
      area?: string;
    };
    contact?: {
      phone?: string;
      whatsapp?: string;
    };
  };
  relatedServices?: Array<{
    _id: string;
    title: string;
    slug: { current: string };
  }>;
  relatedProducts?: Array<{
    _id: string;
    name: string;
    slug: { current: string };
    images?: any[];
    price: number;
    salePrice?: number;
  }>;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isFavorited, toggleFavorite } = useFavorites();
  const { addToCart, getCartItemCount } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showAddedToCart, setShowAddedToCart] = useState(false);
  
  // Check if product is favorited using context
  const isFavorite = product ? isFavorited('product', product._id) : false;
  
  const handleToggleFavorite = async () => {
    if (!product) return;
    
    await toggleFavorite({
      item_type: 'product',
      item_id: product._id,
      item_slug: product.slug.current,
      item_name: product.name,
      item_image_url: product.images?.[0] ? urlFor(product.images[0]).width(300).url() : null,
      item_category: product.category,
      item_price: product.salePrice || product.price || null,
    });
  };

  useEffect(() => {
    async function fetchProduct() {
      if (!params.slug) return;
      try {
        const data = await sanityClient.fetch(queries.productBySlug, {
          slug: params.slug,
        });
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [params.slug]);

  const handleAddToCart = () => {
    if (!product || !product.provider) return;
    
    addToCart({
      productId: product._id,
      productName: product.name,
      productSlug: product.slug.current,
      productImage: product.images?.[0] ? urlFor(product.images[0]).width(200).url() : undefined,
      price: product.price,
      salePrice: product.salePrice,
      providerId: product.provider._id,
      providerName: product.provider.name,
      providerSlug: product.provider.slug.current,
    }, quantity);
    
    setShowAddedToCart(true);
    setTimeout(() => setShowAddedToCart(false), 2000);
  };

  const goToCart = () => {
    router.push("/appx/cart");
  };

  const currentPrice = product?.salePrice || product?.price || 0;
  const totalPrice = currentPrice * quantity;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7]">
        <div className="animate-pulse">
          <div className="h-80 bg-gray-200" />
          <div className="p-4 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-20 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Product not found</p>
          <Link href="/appx/products" className="text-[#0D9488] font-medium">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-24">
      {/* Image Gallery */}
      <div className="relative">
        <div className="h-80 bg-gray-100">
          {product.images && product.images[selectedImage] ? (
            <Image
              src={urlFor(product.images[selectedImage]).width(800).height(600).url()}
              alt={product.name}
              fill
              className="object-contain"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <span className="text-6xl">🧴</span>
            </div>
          )}
        </div>

        {/* Header Buttons */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="h-10 w-10 rounded-full bg-white shadow-md flex items-center justify-center"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleToggleFavorite}
              className="h-10 w-10 rounded-full bg-white shadow-md flex items-center justify-center"
            >
              <Heart
                className={`h-5 w-5 ${
                  isFavorite ? "fill-red-500 text-red-500" : "text-gray-700"
                }`}
              />
            </button>
            <button className="h-10 w-10 rounded-full bg-white shadow-md flex items-center justify-center">
              <Share2 className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Discount Badge */}
        {product.discountPercentage && (
          <div className="absolute bottom-4 left-4">
            <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
              -{product.discountPercentage}% OFF
            </span>
          </div>
        )}

        {/* Image Thumbnails */}
        {product.images && product.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {product.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`h-12 w-12 rounded-lg overflow-hidden border-2 ${
                  selectedImage === index
                    ? "border-[#0D9488]"
                    : "border-transparent"
                }`}
              >
                <Image
                  src={urlFor(img).width(100).height(100).url()}
                  alt={`${product.name} ${index + 1}`}
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 py-5">
        {/* Category */}
        <span className="inline-block bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full mb-2">
          {product.category}
        </span>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>

        {/* Price */}
        <div className="flex items-center gap-3 mb-4">
          {product.salePrice ? (
            <>
              <span className="text-2xl font-bold text-[#0D9488]">
                AED {product.salePrice}
              </span>
              <span className="text-lg text-gray-400 line-through">
                AED {product.price}
              </span>
            </>
          ) : (
            <span className="text-2xl font-bold text-gray-900">
              AED {product.price}
            </span>
          )}
        </div>

        {/* Provider */}
        {product.provider && (
          <Link
            href={`/appx/providers/${product.provider.slug.current}`}
            className="block bg-white rounded-2xl p-4 shadow-sm mb-4"
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gray-100 overflow-hidden">
                {product.provider.logo ? (
                  <Image
                    src={urlFor(product.provider.logo).width(100).height(100).url()}
                    alt={product.provider.name}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-[#0D9488] to-[#7DD3D3]" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  {product.provider.name}
                </h3>
                <p className="text-sm text-gray-500">View provider profile</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </Link>
        )}

        {/* Description */}
        {product.description && (
          <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
            <h2 className="font-semibold text-gray-900 mb-2">Description</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              {product.description}
            </p>
          </div>
        )}

        {/* Features */}
        {product.features && product.features.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
            <h2 className="font-semibold text-gray-900 mb-3">Features</h2>
            <div className="space-y-2">
              {product.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-[#0D9488]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="h-3 w-3 text-[#0D9488]" />
                  </div>
                  <span className="text-sm text-gray-600">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Delivery Info */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="h-10 w-10 rounded-full bg-[#0D9488]/10 flex items-center justify-center mx-auto mb-2">
                <Truck className="h-5 w-5 text-[#0D9488]" />
              </div>
              <p className="text-xs text-gray-600">Free Delivery</p>
            </div>
            <div className="text-center">
              <div className="h-10 w-10 rounded-full bg-[#0D9488]/10 flex items-center justify-center mx-auto mb-2">
                <Shield className="h-5 w-5 text-[#0D9488]" />
              </div>
              <p className="text-xs text-gray-600">Authentic</p>
            </div>
            <div className="text-center">
              <div className="h-10 w-10 rounded-full bg-[#0D9488]/10 flex items-center justify-center mx-auto mb-2">
                <RefreshCw className="h-5 w-5 text-[#0D9488]" />
              </div>
              <p className="text-xs text-gray-600">Easy Returns</p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {product.relatedProducts && product.relatedProducts.length > 0 && (
          <div className="mb-4">
            <h2 className="font-semibold text-gray-900 mb-3">
              You might also like
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {product.relatedProducts.map((related) => (
                <Link
                  key={related._id}
                  href={`/appx/products/${related.slug.current}`}
                  className="flex-shrink-0 w-36 bg-white rounded-xl overflow-hidden shadow-sm"
                >
                  <div className="h-28 bg-gray-100 relative">
                    {related.images && related.images[0] ? (
                      <Image
                        src={urlFor(related.images[0]).width(200).height(200).url()}
                        alt={related.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <span className="text-2xl">🧴</span>
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-medium text-gray-900 line-clamp-2">
                      {related.name}
                    </p>
                    <p className="text-sm font-bold text-[#0D9488]">
                      AED {related.salePrice || related.price}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Stock Status */}
        {product.stock !== undefined && (
          <p
            className={`text-sm ${
              product.stock > 0 ? "text-green-600" : "text-red-500"
            }`}
          >
            {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}
          </p>
        )}
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <div className="flex items-center gap-4">
          {/* Quantity Selector */}
          <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-3 py-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-sm"
            >
              <Minus className="h-4 w-4 text-gray-600" />
            </button>
            <span className="font-semibold text-gray-900 w-6 text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-sm"
            >
              <Plus className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="flex-1 bg-[#0D9488] hover:bg-[#0B7B71] text-white py-6 rounded-xl text-lg font-semibold disabled:opacity-50"
          >
            <ShoppingBag className="h-5 w-5 mr-2" />
            Add to Cart - AED {totalPrice}
          </Button>
        </div>
      </div>

      {/* Added to Cart Toast */}
      {showAddedToCart && (
        <div className="fixed top-20 left-4 right-4 z-50 animate-in slide-in-from-top">
          <div className="bg-white rounded-2xl shadow-lg p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Added to cart!</p>
              <p className="text-sm text-gray-500">{quantity}x {product.name}</p>
            </div>
            <button
              onClick={goToCart}
              className="bg-[#0D9488] text-white px-4 py-2 rounded-xl text-sm font-medium"
            >
              View Cart
            </button>
          </div>
        </div>
      )}

      {/* Cart Badge */}
      {getCartItemCount() > 0 && (
        <button
          onClick={goToCart}
          className="fixed top-4 right-4 z-50 h-12 w-12 rounded-full bg-[#0D9488] text-white flex items-center justify-center shadow-lg"
        >
          <ShoppingBag className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs flex items-center justify-center">
            {getCartItemCount()}
          </span>
        </button>
      )}
    </div>
  );
}
