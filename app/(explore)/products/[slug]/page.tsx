import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchSanity, queries, urlFor } from "@/lib/sanity";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Check, ShoppingCart } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  nameAr?: string;
  slug: { current: string };
  description?: string;
  descriptionAr?: string;
  images?: any[];
  category?: string;
  price: number;
  salePrice?: number;
  sku?: string;
  stock?: number;
  features?: string[];
  relatedServices?: Array<{ _id: string; title: string; slug: { current: string } }>;
}

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await fetchSanity<Product | null>(queries.productBySlug, {
    slug: params.slug,
  });

  if (!product) {
    notFound();
  }

  const isInStock = (product.stock ?? 0) > 0;
  const finalPrice = product.salePrice || product.price;
  const discount = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/products">
            <ChevronLeft className="mr-2 h-4 w-4" />
            All Products
          </Link>
        </Button>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-2xl overflow-hidden">
              {product.images && product.images[0] ? (
                <img
                  src={urlFor(product.images[0]).width(800).height(800).url()}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingCart className="h-16 w-16 text-muted-foreground/50" />
                </div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(1, 5).map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square bg-muted rounded-lg overflow-hidden"
                  >
                    <img
                      src={urlFor(image).width(200).height(200).url()}
                      alt={`${product.name} - ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              {product.category && (
                <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">
                  {product.category}
                </p>
              )}
              <h1 className="text-3xl font-display font-bold">{product.name}</h1>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-brand-gold">
                {finalPrice} AED
              </span>
              {product.salePrice && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    {product.price} AED
                  </span>
                  <Badge variant="destructive">{discount}% OFF</Badge>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {isInStock ? (
                <>
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">In Stock</span>
                </>
              ) : (
                <span className="text-sm text-red-600">Out of Stock</span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-muted-foreground">{product.description}</p>
            )}

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-brand-gold" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Add to Cart */}
            <div className="flex gap-4 pt-4">
              <Button
                variant="gold"
                size="lg"
                className="flex-1"
                disabled={!isInStock}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {isInStock ? "Add to Cart" : "Out of Stock"}
              </Button>
            </div>

            {product.sku && (
              <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
            )}

            {/* Related Services */}
            {product.relatedServices && product.relatedServices.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Related Services</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.relatedServices.map((service) => (
                      <Link
                        key={service._id}
                        href={`/services/${service.slug.current}`}
                        className="text-sm text-brand-gold hover:underline"
                      >
                        {service.title}
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
