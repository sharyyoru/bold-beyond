import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MapPin, Percent } from "lucide-react";
import { fetchSanity, queries } from "@/lib/sanity";

type Partner = {
  name: string;
  location?: {
    address?: string;
    area?: string;
    city?: string;
  };
  discountText?: string;
};

interface PartnerPageProps {
  params: { slug: string };
}

export const revalidate = 60;

export default async function PartnerDetailPage({ params }: PartnerPageProps) {
  const partner = await fetchSanity<Partner | null>(queries.partnerBySlug, {
    slug: params.slug,
  });

  if (!partner) {
    notFound();
  }

  const area = partner.location?.area || partner.location?.city;

  return (
    <div className="container py-12 max-w-3xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{partner.name}</CardTitle>
          <CardDescription>Bold & Beyond partner venue</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          {area && (
            <p className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {area}
            </p>
          )}
          {partner.discountText && (
            <p className="flex items-center gap-1 text-brand-gold font-medium">
              <Percent className="h-4 w-4" />
              {partner.discountText}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
