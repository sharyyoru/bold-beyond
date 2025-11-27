import Link from "next/link";
import { ArrowRight, Brain, Heart, Sparkles, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchSanity, queries } from "@/lib/sanity";

type Service = {
  _id: string;
  title: string;
  slug?: { current: string };
  description?: string;
  icon?: string;
  category?: string;
  benefits?: string[];
};

const iconMap: Record<string, any> = {
  brain: Brain,
  heart: Heart,
  sparkles: Sparkles,
  users: Users,
};

function getIcon(name?: string) {
  if (!name) return Brain;
  const key = name.toLowerCase();
  return iconMap[key] ?? Brain;
}

export const revalidate = 60;

export default async function ServicesPage() {
  const services = await fetchSanity<Service[]>(queries.allServices);
  const visibleServices = services.filter((service) => service.slug?.current);
  return (
    <div className="container py-12 space-y-8">
      <div className="max-w-2xl space-y-3">
        <p className="text-sm font-semibold tracking-wider text-brand-gold uppercase">
          Services
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
          Care designed around real life
        </h1>
        <p className="text-muted-foreground text-base">
          From first-time therapy to ongoing coaching, Bold & Beyond connects you
          with vetted experts and experiences across the full spectrum of wellbeing.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visibleServices.map((service) => {
          const Icon = getIcon(service.icon);
          const slug = service.slug?.current as string;

          return (
          <Card
            key={service._id}
            className="group h-full transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-gold/10 text-brand-gold">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">
                  {service.title}
                </CardTitle>
                {service.category && (
                  <CardDescription className="capitalize">
                    {service.category}
                  </CardDescription>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {service.description}
              </p>
              <Button variant="ghost" className="px-0 text-brand-gold" asChild>
                <Link href={`/services/${slug}`}>
                  Learn more
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
          <p className="font-medium">
            Not sure which service is right for you?
          </p>
          <p className="text-white/80">
            Answer a few questions and well recommend the best starting point.
          </p>
        </div>
        <Button variant="gold" asChild>
          <Link href="/signup">Start your assessment</Link>
        </Button>
      </div>
    </div>
  );
}
