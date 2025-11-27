import Link from "next/link";
import { MapPin, Percent, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchSanity, queries } from "@/lib/sanity";

type Partner = {
  _id: string;
  name: string;
  slug?: { current: string };
  category?: string;
  shortDescription?: string;
  location?: {
    area?: string;
    city?: string;
  };
  discountText?: string;
};

export const revalidate = 60;

export default async function PartnersPage() {
  const partners = await fetchSanity<Partner[]>(queries.allPartners);
  const visible = partners.filter((p) => p.slug?.current);
  return (
    <div className="container py-12 space-y-8">
      <div className="max-w-2xl space-y-3">
        <p className="text-sm font-semibold tracking-wider text-brand-gold uppercase">
          Partners
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
          Perks that support your whole lifestyle
        </h1>
        <p className="text-muted-foreground text-base">
          Beyond sessions, unlock exclusive benefits with gyms, restaurants, and
          wellness spaces across the region.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((partner) => {
          const slug = partner.slug!.current;
          const area = partner.location?.area || partner.location?.city;
          const discount = partner.discountText;

          return (
          <Card
            key={partner._id}
            className="group h-full transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                {partner.name}
              </CardTitle>
              {partner.category && (
                <CardDescription>{partner.category}</CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{area}</span>
              </div>
              {discount && (
                <div className="flex items-center gap-1 font-medium text-brand-gold">
                  <Percent className="h-4 w-4" />
                  <span>{discount}</span>
                </div>
              )}
              <Button variant="ghost" className="px-0 text-brand-gold" asChild>
                <Link href={`/partners/${slug}`}>
                  View details
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-brand-navy px-6 py-5 text-sm text-white">
        <div>
          <p className="font-medium">Run a wellness venue or brand?</p>
          <p className="text-white/80">
            Partner with Bold & Beyond to reach engaged members and corporate clients.
          </p>
        </div>
        <Button variant="outline" className="border-brand-gold text-brand-gold" asChild>
          <Link href="/contact">Become a partner</Link>
        </Button>
      </div>
    </div>
  );
}
