import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { fetchSanity, queries, urlFor } from "@/lib/sanity";

type Expert = {
  name: string;
  title?: string;
  photo?: any;
  specializations?: string[];
};

interface ExpertPageProps {
  params: { slug: string };
}

export const revalidate = 60;

export default async function ExpertDetailPage({ params }: ExpertPageProps) {
  const expert = await fetchSanity<Expert | null>(queries.expertBySlug, {
    slug: params.slug,
  });

  if (!expert) {
    notFound();
  }

  const initials = expert.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  const imageUrl =
    expert.photo && urlFor(expert.photo).width(160).height(160).url();

  return (
    <div className="container py-12 max-w-3xl space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-12 w-12">
            {imageUrl && <AvatarImage src={imageUrl} alt={expert.name} />}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl font-semibold">{expert.name}</CardTitle>
            {expert.title && <CardDescription>{expert.title}</CardDescription>}
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          {expert.specializations && expert.specializations.length > 0 && (
            <div>
              <p className="font-medium text-foreground">Focus areas</p>
              <p>{expert.specializations.join(", ")}</p>
            </div>
          )}
          <Button variant="gold" asChild>
            <Link href="/signup">Book with this expert</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
