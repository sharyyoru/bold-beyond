import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, 
  Brain, 
  Heart, 
  Sparkles, 
  Users, 
  Calendar, 
  Star,
  CheckCircle2,
  Gift,
  LucideIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchSanity, queries, urlFor } from "@/lib/sanity";

// Icon mapping for dynamic icons from Sanity
const iconMap: Record<string, LucideIcon> = {
  brain: Brain,
  sparkles: Sparkles,
  heart: Heart,
  users: Users,
  calendar: Calendar,
  star: Star,
  gift: Gift,
};

// Default content (fallback when Sanity has no data)
const defaultContent = {
  heroTagline: "Your Wellness Journey Starts Here",
  heroHeadline: "Bold Steps to a",
  heroHighlightedText: "Better You",
  heroDescription: "Connect with expert therapists, track your wellness, and unlock exclusive partner benefits. Your comprehensive mental health and wellness platform.",
  heroPrimaryCta: "Get Started Free",
  heroSecondaryCta: "Browse Experts",
  servicesTitle: "Comprehensive Wellness Services",
  servicesDescription: "From therapy to coaching, find the support you need for every aspect of your wellbeing.",
  featuredServices: [
    { title: "Psychotherapy", description: "Professional mental health support with licensed therapists", icon: "brain", href: "/services/psychotherapy" },
    { title: "Life Coaching", description: "Transform your goals into achievements with expert guidance", icon: "sparkles", href: "/services/life-coaching" },
    { title: "Couples Therapy", description: "Strengthen your relationships with specialized counseling", icon: "heart", href: "/services/couples-therapy" },
    { title: "Group Sessions", description: "Connect and grow with supportive community workshops", icon: "users", href: "/services/group-sessions" },
  ],
  featuresTagline: "Why Choose Us",
  featuresTitle: "Everything You Need for Your Wellness Journey",
  featuresDescription: "Bold & Beyond combines expert care with smart technology to deliver a personalized wellness experience.",
  featuresList: [
    { feature: "Personalized wellness assessments" },
    { feature: "Verified expert therapists" },
    { feature: "Flexible online & in-person sessions" },
    { feature: "Exclusive partner perks & discounts" },
    { feature: "Progress tracking & insights" },
    { feature: "24/7 booking availability" },
  ],
  stats: [
    { value: "500+", label: "Sessions Weekly", icon: "calendar" },
    { value: "50+", label: "Expert Therapists", icon: "users" },
    { value: "4.9", label: "Average Rating", icon: "star" },
    { value: "30+", label: "Partner Venues", icon: "gift" },
  ],
  testimonialsTitle: "What Our Members Say",
  testimonialsDescription: "Join thousands who have transformed their lives with Bold & Beyond",
  featuredTestimonials: [
    { _id: "default-1", clientName: "Sarah M.", content: "Bold & Beyond helped me find the perfect therapist. The booking process was seamless!", rating: 5 },
    { _id: "default-2", clientName: "Ahmed K.", content: "The wellness tracking feature keeps me accountable. I've never felt better!", rating: 5 },
    { _id: "default-3", clientName: "Maria L.", content: "Partner perks are amazing. I save so much on gym memberships and healthy restaurants.", rating: 5 },
  ],
  ctaTitle: "Ready to Start Your Wellness Journey?",
  ctaDescription: "Join Bold & Beyond today and take the first step towards a healthier, happier you.",
  ctaPrimaryButton: "Create Free Account",
  ctaSecondaryButton: "Contact Sales",
};

interface HomepageData {
  heroTagline?: string;
  heroHeadline?: string;
  heroHighlightedText?: string;
  heroDescription?: string;
  heroPrimaryCta?: string;
  heroSecondaryCta?: string;
  heroImage?: { asset: { _ref: string } };
  servicesTitle?: string;
  servicesDescription?: string;
  featuredServices?: Array<{ title: string; description: string; icon: string; href: string }>;
  featuresTagline?: string;
  featuresTitle?: string;
  featuresDescription?: string;
  featuresList?: Array<{ feature: string }>;
  featuresImage?: { asset: { _ref: string } };
  stats?: Array<{ value: string; label: string; icon: string }>;
  testimonialsTitle?: string;
  testimonialsDescription?: string;
  featuredTestimonials?: Array<{ _id?: string; clientName: string; clientPhoto?: { asset: { _ref: string } }; content: string; rating: number }>;
  ctaTitle?: string;
  ctaDescription?: string;
  ctaPrimaryButton?: string;
  ctaSecondaryButton?: string;
}

export default async function HomePage() {
  // Fetch homepage data from Sanity
  const data = await fetchSanity<HomepageData | null>(queries.homepage);
  
  // Merge with defaults (Sanity data takes precedence)
  const content = { ...defaultContent, ...data };
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-cream via-white to-brand-cream py-20 md:py-32">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full bg-brand-gold/10 px-4 py-1.5 text-sm font-medium text-brand-gold mb-6">
              <Sparkles className="mr-2 h-4 w-4" />
              {content.heroTagline}
            </span>
            <h1 className="font-display text-4xl font-bold tracking-tight text-brand-navy sm:text-5xl md:text-6xl">
              {content.heroHeadline}{" "}
              <span className="text-brand-gold">{content.heroHighlightedText}</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              {content.heroDescription}
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button variant="gold" size="xl" asChild>
                <Link href="/signup">
                  {content.heroPrimaryCta}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link href="/experts">{content.heroSecondaryCta}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="font-display text-3xl font-bold text-brand-navy md:text-4xl">
              {content.servicesTitle}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {content.servicesDescription}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {content.featuredServices?.map((service) => {
              const IconComponent = iconMap[service.icon] || Brain;
              return (
                <Link key={service.title} href={service.href} className="group">
                  <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 border-transparent hover:border-brand-gold/20">
                    <CardHeader>
                      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-brand-gold/10 text-brand-gold group-hover:bg-brand-gold group-hover:text-white transition-colors">
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{service.description}</p>
                      <div className="mt-4 flex items-center text-brand-gold font-medium">
                        Learn more
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-brand-navy py-20 md:py-28 text-white">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <span className="text-brand-gold font-medium uppercase tracking-wider text-sm">
                {content.featuresTagline}
              </span>
              <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl">
                {content.featuresTitle}
              </h2>
              <p className="mt-4 text-gray-300 text-lg">
                {content.featuresDescription}
              </p>
              <ul className="mt-8 space-y-4">
                {content.featuresList?.map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-brand-gold flex-shrink-0" />
                    <span className="text-gray-200">{item.feature}</span>
                  </li>
                ))}
              </ul>
              <Button variant="gold" size="lg" className="mt-8" asChild>
                <Link href="/about">
                  Learn More About Us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-brand-gold/20 to-brand-gold/5 p-8 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                  {content.stats?.map((stat, index) => {
                    const StatIcon = iconMap[stat.icon] || Calendar;
                    return (
                      <div key={index} className="rounded-xl bg-white/10 backdrop-blur p-4 text-center">
                        <StatIcon className="h-8 w-8 mx-auto mb-2 text-brand-gold" />
                        <span className="text-2xl font-bold">{stat.value}</span>
                        <p className="text-sm text-gray-300">{stat.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="font-display text-3xl font-bold text-brand-navy md:text-4xl">
              {content.testimonialsTitle}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {content.testimonialsDescription}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {content.featuredTestimonials?.map((testimonial, i) => (
              <Card key={testimonial._id || i} className="relative">
                <CardContent className="pt-8">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star
                        key={j}
                        className="h-5 w-5 fill-brand-gold text-brand-gold"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                  <div className="mt-6 border-t pt-4">
                    <p className="font-semibold">{testimonial.clientName}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brand-cream py-20 md:py-28">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold text-brand-navy md:text-4xl">
              {content.ctaTitle}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {content.ctaDescription}
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button variant="gold" size="xl" asChild>
                <Link href="/signup">
                  {content.ctaPrimaryButton}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link href="/contact">{content.ctaSecondaryButton}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
