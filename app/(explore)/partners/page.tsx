import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, Users, Shield, TrendingUp, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  BrandedHero,
  DubaiVision2030,
  OrganizationalHealthMap
} from "@/components/human-os";
import { CORPORATE_LICENSING_MESSAGING } from "@/lib/human-os/health-map";

export const metadata: Metadata = {
  title: "Corporate Partners | Bold & Beyond",
  description: "Human Capital Optimization for forward-thinking organizations. Anonymized health maps and workforce resilience tools.",
};

export default function PartnersPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <BrandedHero variant="corporate" />

      {/* Value Proposition */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              Why Partner With Human OS?
            </h2>
            <p className="text-lg text-muted-foreground">
              We help organizations build resilient workforces through data-driven 
              wellness insights—without compromising employee privacy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: "Privacy-First",
                description: "All data anonymized from cohorts of 20+ employees. Individual data never exposed.",
              },
              {
                icon: TrendingUp,
                title: "Predictive Insights",
                description: "AI-powered early warning for burnout risk and declining wellness trends.",
              },
              {
                icon: Users,
                title: "Vendor Neutral",
                description: "Access to 500+ wellness providers through one intelligent routing layer.",
              },
              {
                icon: Building2,
                title: "Vision 2030 Aligned",
                description: "Supporting Dubai's goals for workforce resilience and national wellbeing.",
              },
            ].map((item) => (
              <Card key={item.title} className="h-full">
                <CardContent className="p-6">
                  <div className="inline-flex p-3 rounded-lg bg-brand-gold/10 text-brand-gold mb-4">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-brand-navy mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Health Map Demo */}
      <OrganizationalHealthMap variant="feature" />

      {/* Dubai Vision 2030 */}
      <DubaiVision2030 variant="full" showPartnership />

      {/* CTA Section */}
      <section className="py-16 bg-brand-cream">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              Ready to Optimize Your Human Capital?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join 127+ organizations already using Human OS to build resilient, 
              high-performing workforces.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="gold" size="lg" asChild className="group">
                <Link href="/contact">
                  Schedule a Demo
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
