import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { fetchSanity, queries } from "@/lib/sanity";

type Service = {
  title: string;
  description?: string;
};

interface ServicePageProps {
  params: { slug: string };
}

export const revalidate = 60;

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const service = await fetchSanity<Service | null>(queries.serviceBySlug, {
    slug: params.slug,
  });

  if (!service) {
    notFound();
  }

  return (
    <div className="container py-12 max-w-3xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{service.title}</CardTitle>
          <CardDescription>Bold & Beyond service overview</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          {service.description && <p>{service.description}</p>}
          <Button variant="gold" asChild>
            <Link href="/signup">Get started</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
