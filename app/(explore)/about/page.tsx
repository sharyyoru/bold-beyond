import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="container py-12 space-y-10">
      <div className="max-w-3xl space-y-4">
        <p className="text-sm font-semibold tracking-wider text-brand-gold uppercase">
          About
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
          Bold care for bodies, minds, and everything beyond
        </h1>
        <p className="text-muted-foreground text-base">
          Bold & Beyond was created in Dubai to make world-class mental health
          and wellbeing support genuinely accessible, culturally aware, and easy
          to fit into real life.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="space-y-2 p-6">
            <p className="text-sm font-medium text-brand-gold">For individuals</p>
            <p className="text-sm text-muted-foreground">
              Seamless access to therapy, coaching, and partner perks in one
              mobile-first experience.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2 p-6">
            <p className="text-sm font-medium text-brand-gold">For therapists</p>
            <p className="text-sm text-muted-foreground">
              A clinic-grade platform for managing schedules, patients, and
              payments with less admin.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2 p-6">
            <p className="text-sm font-medium text-brand-gold">For partners</p>
            <p className="text-sm text-muted-foreground">
              Curated collaborations with gyms, cafes, and wellness spaces that
              reward healthy habits.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="flex flex-col items-start justify-between gap-4 p-6 md:flex-row md:items-center">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-brand-gold">
              Building something for the region
            </p>
            <p className="text-sm text-muted-foreground max-w-xl">
              We are building Bold & Beyond with clinicians, researchers, and
              community partners across MENA. If youd like to collaborate or
              bring Bold & Beyond to your organisation, wed love to hear from you.
            </p>
          </div>
          <Button variant="gold" asChild>
            <Link href="/contact">Talk to the team</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
