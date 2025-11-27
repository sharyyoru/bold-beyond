import Link from "next/link";
import { fetchSanity, queries, urlFor } from "@/lib/sanity";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  nameAr?: string;
  slug: { current: string };
  images?: any[];
  category?: string;
  price: number;
  salePrice?: number;
  featured?: boolean;
}

const categoryLabels: Record<string, string> = {
  wellness: "Wellness",
  "self-care": "Self-Care",
  books: "Books",
  supplements: "Supplements",
  equipment: "Equipment",
  "gift-cards": "Gift Cards",
};

export default async function ProductsPage() {
  const products = await fetchSanity<Product[]>(queries.allProducts);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-navy to-brand-navy/90 text-white py-16">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Wellness Products
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Curated products to support your mental wellness journey, from
            self-care essentials to recommended reading.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container">
          {products.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <Link
                  key={product._id}
                  href={`/products/${product.slug.current}`}
                >
                  <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 overflow-hidden group">
                    <div className="aspect-square bg-muted relative overflow-hidden">
                      {product.images && product.images[0] ? (
                        <img
                          src={urlFor(product.images[0]).width(400).height(400).url()}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="h-12 w-12 text-muted-foreground/50" />
                        </div>
                      )}
                      {product.salePrice && (
                        <Badge className="absolute top-3 right-3 bg-red-500">
                          Sale
                        </Badge>
                      )}
                      {product.featured && !product.salePrice && (
                        <Badge className="absolute top-3 right-3 bg-brand-gold">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      {product.category && (
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                          {categoryLabels[product.category] || product.category}
                        </p>
                      )}
                      <h3 className="font-medium line-clamp-2 mb-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        {product.salePrice ? (
                          <>
                            <span className="font-semibold text-brand-gold">
                              {product.salePrice} AED
                            </span>
                            <span className="text-sm text-muted-foreground line-through">
                              {product.price} AED
                            </span>
                          </>
                        ) : (
                          <span className="font-semibold text-brand-gold">
                            {product.price} AED
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingBag className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">
                No products available yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
