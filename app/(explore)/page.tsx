import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
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
  LucideIcon,
  Zap,
  Target,
  Activity,
  Wind,
  Eye,
  Hand,
  Waves,
  HelpCircle,
  History,
  Compass
} from "lucide-react";

const HeroAnimation = dynamic(() => import("@/components/home/HeroAnimation"), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-lg aspect-square bg-white/10 rounded-3xl animate-pulse" />
  ),
});

const YogaAnimation = dynamic(() => import("@/components/home/YogaAnimation"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-48 bg-white/10 rounded-2xl animate-pulse" />
  ),
});

const ScrollReveal = dynamic(() => import("@/components/ui/ScrollReveal"), {
  ssr: false,
});

const SpinningLotusAnimation = dynamic(() => import("@/components/home/SpinningLotusAnimation"), {
  ssr: false,
});

const ScrollDownButton = dynamic(() => import("@/components/home/ScrollDownButton"), {
  ssr: false,
});

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchSanity, queries, urlFor } from "@/lib/sanity";
import { StateOfHuman, DecisionEngine, NetworkEffects } from "@/components/human-os";

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
  heroTagline: "Your Wellbeing Journey Starts Here",
  heroHeadline: "Bold Steps to a",
  heroHighlightedText: "Better You",
  heroDescription: "Connect with expert therapists, track your wellness, and unlock exclusive partner benefits. Your comprehensive mental health and wellness platform.",
  heroPrimaryCta: "Get Started Free",
  heroSecondaryCta: "Browse Experts",
  servicesTitle: "Comprehensive Wellbeing Services",
  servicesDescription: "From therapy to coaching, find the support you need for every aspect of your wellbeing.",
  featuredServices: [
    { title: "Psychotherapy", description: "Professional mental health support with licensed therapists", icon: "brain", href: "/services/psychotherapy", video: "/updated-assets/Psychotherapy.mp4" },
    { title: "Life Coaching", description: "Transform your goals into achievements with expert guidance", icon: "sparkles", href: "/services/life-coaching", video: "/updated-assets/Lifecoaching.mp4" },
    { title: "Couples Therapy", description: "Strengthen your relationships with specialized counseling", icon: "heart", href: "/services/couples-therapy", video: "/updated-assets/couplestherapy.mp4" },
    { title: "Group Sessions", description: "Connect and grow with supportive community workshops", icon: "users", href: "/services/group-sessions", video: "/updated-assets/groupsessions.mp4" },
  ],
  featuresTagline: "Why Choose Us",
  featuresTitle: "Everything You Need for Your Wellbeing Journey",
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
  ctaTitle: "Ready to Start Your Wellbeing Journey?",
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
  featuredServices?: Array<{ title: string; description: string; icon: string; href: string; video?: string }>;
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
      {/* Hero Section - Sky/Sand/Sea Theme with Glassmorphism */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Background with gradient */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-palette-sky via-palette-sea to-palette-sky" />
          <div className="absolute top-20 -left-32 w-96 h-96 bg-palette-sand/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 -right-32 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-palette-sea/20 rounded-full blur-3xl" />
          {/* Rotating Big Icon - Upper Right */}
          <div className="absolute -top-64 -right-64 w-[1000px] h-[1000px] overflow-hidden">
            <Image
              src="/new-assets/big-icon.png"
              alt=""
              width={1000}
              height={1000}
              className="opacity-[5%] animate-spin-slower"
            />
          </div>
        </div>
        
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-white mb-6 border border-white/30">
                <Sparkles className="mr-2 h-4 w-4" />
                {content.heroTagline}
              </span>
              <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                {content.heroHeadline}{" "}
                <span className="text-palette-sand">{content.heroHighlightedText}</span>
              </h1>
              <p className="mt-6 text-lg text-white/80 md:text-xl max-w-xl mx-auto lg:mx-0">
                {content.heroDescription}
              </p>
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
                <Button size="xl" className="bg-palette-sand text-gray-800 hover:bg-palette-sand/90 shadow-lg" asChild>
                  <Link href="/download">
                    {content.heroPrimaryCta}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="xl" className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30" asChild>
                  <Link href="/experts">{content.heroSecondaryCta}</Link>
                </Button>
              </div>
              
              {/* Human OS differentiators */}
              <div className="mt-12 grid grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                    <Target className="h-4 w-4 text-palette-sand" />
                    <span className="font-semibold text-white">94.3%</span>
                  </div>
                  <p className="text-xs text-white/60">Routing Accuracy</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                    <Zap className="h-4 w-4 text-palette-sand" />
                    <span className="font-semibold text-white">50+</span>
                  </div>
                  <p className="text-xs text-white/60">Wellbeing Modalities</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                    <Activity className="h-4 w-4 text-palette-sand" />
                    <span className="font-semibold text-white">AI-Powered</span>
                  </div>
                  <p className="text-xs text-white/60">Smart Matching</p>
                </div>
              </div>
            </div>
            
            {/* Hero Animation with branded elements */}
            <div className="hidden lg:flex justify-center relative">
              <HeroAnimation />
            </div>
          </div>
        </div>
        
        {/* Scroll Down Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
          <ScrollDownButton />
        </div>
      </section>

      {/* Services Section */}
      <section id="services-section" className="py-20 md:py-28 bg-gradient-to-b from-palette-sand/30 to-white">
        <div className="container">
          <ScrollReveal>
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="font-display text-3xl font-bold text-palette-sky md:text-4xl">
                {content.servicesTitle}
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                {content.servicesDescription}
              </p>
            </div>
          </ScrollReveal>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {content.featuredServices?.map((service, index) => {
              const IconComponent = iconMap[service.icon] || Brain;
              return (
                <ScrollReveal key={service.title} delay={index * 100} direction="up">
                  <Link href={service.href} className="group block h-full">
                    <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-palette-sky/20 bg-white/80 backdrop-blur-sm hover:border-palette-sea/40 overflow-hidden">
                    {/* Video Container */}
                    {service.video && (
                      <div className="relative w-full aspect-video overflow-hidden bg-gradient-to-br from-palette-sea/20 to-palette-sky/20">
                        <video
                          autoPlay
                          loop
                          muted
                          playsInline
                          preload="auto"
                          className="absolute inset-0 w-full h-full object-cover"
                        >
                          <source src={service.video} type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-transparent" />
                      </div>
                    )}
                    <CardHeader className="pt-4">
                      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-palette-sea/10 text-palette-sea group-hover:bg-palette-sea group-hover:text-white transition-colors">
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-lg text-palette-sky">{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-gray-600 text-sm">{service.description}</p>
                      <div className="mt-3 flex items-center text-palette-sea font-medium text-sm">
                        Learn more
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Card>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-br from-palette-sky via-palette-sea to-palette-sky py-20 md:py-28 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-palette-sand/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="container relative z-10">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <ScrollReveal direction="left">
              <div>
                <span className="text-palette-sand font-medium uppercase tracking-wider text-sm">
                  {content.featuresTagline}
                </span>
                <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl">
                  {content.featuresTitle}
                </h2>
                <p className="mt-4 text-white/80 text-lg">
                  {content.featuresDescription}
                </p>
                <ul className="mt-8 space-y-4">
                  {content.featuresList?.map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-palette-sand flex-shrink-0" />
                      <span className="text-white/90">{item.feature}</span>
                    </li>
                  ))}
                </ul>
                <Button size="lg" className="mt-8 bg-palette-sand text-gray-800 hover:bg-palette-sand/90" asChild>
                  <Link href="/about">
                    Learn More About Us
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right" delay={200}>
              <div className="relative">
                <div className="rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 p-6 flex flex-row gap-6 relative overflow-hidden">
                  {/* Geometric Tile Pattern Background */}
                  <div 
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                      backgroundImage: "url('/assets/b&b-pattern.svg')",
                      backgroundSize: "150px 150px",
                      backgroundPosition: "center",
                      backgroundRepeat: "repeat",
                    }}
                  />
                  {/* Yoga Animation - Full Height Left */}
                  <div className="flex-1 min-h-[320px] relative z-10">
                    <YogaAnimation />
                  </div>
                  {/* Stats - Vertical Stack Right */}
                  <div className="flex flex-col gap-3 w-32">
                    {content.stats?.map((stat, index) => {
                      const StatIcon = iconMap[stat.icon] || Calendar;
                      return (
                        <div key={index} className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-3 text-center hover:bg-white/20 transition-all flex-1">
                          <StatIcon className="h-5 w-5 mx-auto mb-1 text-palette-sand" />
                          <span className="text-lg font-bold">{stat.value}</span>
                          <p className="text-[10px] text-white/70 leading-tight">{stat.label}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Regulation Tools Section - NEW */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-white to-palette-sand/20 relative overflow-hidden">
        <div className="absolute top-20 -right-32 w-96 h-96 bg-palette-sea/10 rounded-full blur-3xl" />
        {/* Spinning Lotus Animation - Top Right */}
        <div className="absolute top-8 right-8 lg:right-16 hidden md:block">
          <SpinningLotusAnimation />
        </div>
        <div className="container relative z-10">
          <ScrollReveal>
            <div className="mx-auto max-w-3xl text-center mb-16">
              <span className="inline-flex items-center rounded-full bg-palette-sea/10 px-4 py-1.5 text-sm font-medium text-palette-sea mb-4">
                <Brain className="mr-2 h-4 w-4" />
                Human OS Technology
              </span>
              <h2 className="font-display text-3xl font-bold text-palette-sky md:text-4xl">
                Powerful Regulation Tools
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Access science-backed tools for nervous system regulation, emotional processing, and personal transformation - all integrated into your wellness journey.
              </p>
            </div>
          </ScrollReveal>
          
          {/* Quick Tools */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-palette-sky mb-6 text-center">Quick Regulation Tools</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Wind, name: "Box Breathing", duration: "3 min", description: "4-4-4-4 breathing pattern to calm your nervous system", color: "#5BB5B0" },
                { icon: Eye, name: "5-4-3-2-1 Grounding", duration: "2 min", description: "Sensory awareness to bring you back to the present", color: "#6B9BC3" },
                { icon: Hand, name: "EFT Tapping", duration: "5 min", description: "Meridian tapping to release emotional tension", color: "#8B7355" },
                { icon: Waves, name: "Vagal Reset", duration: "1 min", description: "Quick vagus nerve stimulation for instant calm", color: "#E8A87C" },
              ].map((tool, i) => (
                <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/50 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${tool.color}20` }}>
                    <tool.icon className="h-6 w-6" style={{ color: tool.color }} />
                  </div>
                  <h4 className="font-semibold text-palette-sky">{tool.name}</h4>
                  <p className="text-xs text-palette-sea mb-2">{tool.duration}</p>
                  <p className="text-sm text-gray-600">{tool.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Deep Transformation Tools */}
          <div>
            <h3 className="text-xl font-semibold text-palette-sky mb-6 text-center">Deep Transformation Tools</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: Target, name: "Set Outcomes", steps: 14, description: "14-step process to clarify and align your goals with your values", color: "#1B365D" },
                { icon: Heart, name: "Elicit Values", steps: 3, description: "Discover what truly matters to you in any life area", color: "#8B7355" },
                { icon: HelpCircle, name: "Driving Question", steps: 6, description: "Uncover and transform your core life question", color: "#6B9BC3" },
                { icon: Compass, name: "The Want", steps: 6, description: "Ecology check - explore all dimensions of your desires", color: "#E8A87C" },
                { icon: History, name: "Personal History", steps: 23, description: "Deep exploration of patterns and their origins", color: "#1B365D" },
              ].map((tool, i) => (
                <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/50 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 flex gap-4">
                  <div className="h-14 w-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${tool.color}15` }}>
                    <tool.icon className="h-7 w-7" style={{ color: tool.color }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-palette-sky">{tool.name}</h4>
                      <span className="text-xs bg-palette-sand/50 px-2 py-0.5 rounded-full text-gray-600">{tool.steps} steps</span>
                    </div>
                    <p className="text-sm text-gray-600">{tool.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" className="bg-palette-sea text-white hover:bg-palette-sea-dark" asChild>
              <Link href="/download">
                Try Human OS Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-palette-sand/20 to-white">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="font-display text-3xl font-bold text-palette-sky md:text-4xl">
              {content.testimonialsTitle}
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              {content.testimonialsDescription}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {content.featuredTestimonials?.map((testimonial, i) => (
              <Card key={testimonial._id || i} className="relative bg-white/80 backdrop-blur-sm border border-white/50 shadow-sm hover:shadow-lg transition-all">
                <CardContent className="pt-8">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star
                        key={j}
                        className="h-5 w-5 fill-palette-sand text-palette-sand"
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 italic">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                  <div className="mt-6 border-t border-palette-sand/30 pt-4">
                    <p className="font-semibold text-palette-sky">{testimonial.clientName}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Human OS - Decision Engine (Redesigned with dark background) */}
      <DecisionEngine variant="hero" showModalities />

      {/* CTA Section */}
      <section className="bg-palette-sand py-20 md:py-28 relative overflow-hidden">
        {/* Background orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-palette-sky/10 rounded-full blur-3xl" />
        {/* Rotating Big Icon Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Image
            src="/new-assets/big-icon.png"
            alt=""
            width={800}
            height={800}
            className="opacity-10 animate-spin-slower"
          />
        </div>
        
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold text-brand-navy md:text-4xl">
              {content.ctaTitle}
            </h2>
            <p className="mt-4 text-lg text-brand-navy/70">
              {content.ctaDescription}
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="xl" className="bg-brand-gold text-white hover:bg-brand-gold/90 shadow-lg" asChild>
                <Link href="/download">
                  {content.ctaPrimaryButton}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="xl" className="bg-white/80 backdrop-blur-sm text-brand-navy border-brand-navy/20 hover:bg-white" asChild>
                <Link href="/contact">{content.ctaSecondaryButton}</Link>
              </Button>
            </div>
            
            {/* Additional CTAs for Human OS */}
            <div className="mt-8 pt-8 border-t border-brand-navy/20">
              <p className="text-sm text-brand-navy/70 mb-4">
                For enterprise solutions and corporate wellness programs:
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="bg-brand-navy text-white hover:bg-brand-navy/90 shadow-lg border-2 border-brand-navy" asChild>
                  <Link href="/partners">Corporate Partnerships</Link>
                </Button>
                <Button size="lg" className="bg-white text-palette-sky hover:bg-white/90 shadow-lg border-2 border-white" asChild>
                  <Link href="/human-os">Learn About Human OS</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
