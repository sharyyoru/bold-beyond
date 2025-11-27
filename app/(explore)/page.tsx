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
  Gift
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const services = [
  {
    title: "Psychotherapy",
    description: "Professional mental health support with licensed therapists",
    icon: Brain,
    href: "/services/psychotherapy",
  },
  {
    title: "Life Coaching",
    description: "Transform your goals into achievements with expert guidance",
    icon: Sparkles,
    href: "/services/life-coaching",
  },
  {
    title: "Couples Therapy",
    description: "Strengthen your relationships with specialized counseling",
    icon: Heart,
    href: "/services/couples-therapy",
  },
  {
    title: "Group Sessions",
    description: "Connect and grow with supportive community workshops",
    icon: Users,
    href: "/services/group-sessions",
  },
];

const features = [
  "Personalized wellness assessments",
  "Verified expert therapists",
  "Flexible online & in-person sessions",
  "Exclusive partner perks & discounts",
  "Progress tracking & insights",
  "24/7 booking availability",
];

const testimonials = [
  {
    quote: "Bold & Beyond helped me find the perfect therapist. The booking process was seamless!",
    author: "Sarah M.",
    role: "Dubai",
    rating: 5,
  },
  {
    quote: "The wellness tracking feature keeps me accountable. I've never felt better!",
    author: "Ahmed K.",
    role: "Abu Dhabi",
    rating: 5,
  },
  {
    quote: "Partner perks are amazing. I save so much on gym memberships and healthy restaurants.",
    author: "Maria L.",
    role: "Dubai",
    rating: 5,
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-cream via-white to-brand-cream py-20 md:py-32">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full bg-brand-gold/10 px-4 py-1.5 text-sm font-medium text-brand-gold mb-6">
              <Sparkles className="mr-2 h-4 w-4" />
              Your Wellness Journey Starts Here
            </span>
            <h1 className="font-display text-4xl font-bold tracking-tight text-brand-navy sm:text-5xl md:text-6xl">
              Bold Steps to a{" "}
              <span className="text-brand-gold">Better You</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              Connect with expert therapists, track your wellness, and unlock
              exclusive partner benefits. Your comprehensive mental health and
              wellness platform.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button variant="gold" size="xl" asChild>
                <Link href="/signup">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link href="/experts">Browse Experts</Link>
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
              Comprehensive Wellness Services
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From therapy to coaching, find the support you need for every
              aspect of your wellbeing.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <Link key={service.title} href={service.href} className="group">
                <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 border-transparent hover:border-brand-gold/20">
                  <CardHeader>
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-brand-gold/10 text-brand-gold group-hover:bg-brand-gold group-hover:text-white transition-colors">
                      <service.icon className="h-6 w-6" />
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
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-brand-navy py-20 md:py-28 text-white">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <span className="text-brand-gold font-medium uppercase tracking-wider text-sm">
                Why Choose Us
              </span>
              <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl">
                Everything You Need for Your Wellness Journey
              </h2>
              <p className="mt-4 text-gray-300 text-lg">
                Bold & Beyond combines expert care with smart technology to
                deliver a personalized wellness experience.
              </p>
              <ul className="mt-8 space-y-4">
                {features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-brand-gold flex-shrink-0" />
                    <span className="text-gray-200">{feature}</span>
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
                  <div className="rounded-xl bg-white/10 backdrop-blur p-4 text-center">
                    <Calendar className="h-8 w-8 mx-auto mb-2 text-brand-gold" />
                    <span className="text-2xl font-bold">500+</span>
                    <p className="text-sm text-gray-300">Sessions Weekly</p>
                  </div>
                  <div className="rounded-xl bg-white/10 backdrop-blur p-4 text-center">
                    <Users className="h-8 w-8 mx-auto mb-2 text-brand-gold" />
                    <span className="text-2xl font-bold">50+</span>
                    <p className="text-sm text-gray-300">Expert Therapists</p>
                  </div>
                  <div className="rounded-xl bg-white/10 backdrop-blur p-4 text-center">
                    <Star className="h-8 w-8 mx-auto mb-2 text-brand-gold" />
                    <span className="text-2xl font-bold">4.9</span>
                    <p className="text-sm text-gray-300">Average Rating</p>
                  </div>
                  <div className="rounded-xl bg-white/10 backdrop-blur p-4 text-center">
                    <Gift className="h-8 w-8 mx-auto mb-2 text-brand-gold" />
                    <span className="text-2xl font-bold">30+</span>
                    <p className="text-sm text-gray-300">Partner Venues</p>
                  </div>
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
              What Our Members Say
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join thousands who have transformed their lives with Bold & Beyond
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, i) => (
              <Card key={i} className="relative">
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
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="mt-6 border-t pt-4">
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
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
              Ready to Start Your Wellness Journey?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join Bold & Beyond today and take the first step towards a
              healthier, happier you.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button variant="gold" size="xl" asChild>
                <Link href="/signup">
                  Create Free Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
