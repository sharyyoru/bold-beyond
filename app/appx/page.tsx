"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Search,
  Menu,
  ArrowRight,
  Heart,
  Star,
  Clock,
  MapPin,
  Brain,
  Sparkles,
  Users,
  Calendar,
  Gift,
  MessageCircle,
  Stethoscope,
  Dumbbell,
  Leaf,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Service categories like Careem
const serviceCategories = [
  { id: "therapy", label: "Therapy", icon: Brain, color: "bg-brand-navy" },
  { id: "coaching", label: "Coaching", icon: Sparkles, color: "bg-brand-gold" },
  { id: "wellness", label: "Wellness", icon: Leaf, color: "bg-green-500", badge: "New" },
  { id: "groups", label: "Groups", icon: Users, color: "bg-purple-500" },
  { id: "clinics", label: "Clinics", icon: Stethoscope, color: "bg-brand-teal" },
  { id: "fitness", label: "Fitness", icon: Dumbbell, color: "bg-orange-500" },
  { id: "perks", label: "Perks", icon: Gift, color: "bg-pink-500" },
  { id: "support", label: "Support", icon: MessageCircle, color: "bg-blue-500" },
];

// Carousel slides
const carouselSlides = [
  {
    id: 1,
    title: "Bold+",
    subtitle: "Save 25% with an annual membership.",
    cta: "Switch now",
    bgGradient: "from-brand-navy via-brand-navy to-brand-teal",
  },
  {
    id: 2,
    title: "Wellness Week",
    subtitle: "Free consultations with top experts.",
    cta: "Explore",
    bgGradient: "from-brand-teal via-brand-teal to-brand-gold",
  },
  {
    id: 3,
    title: "New: Group Sessions",
    subtitle: "Connect and grow together.",
    cta: "Join now",
    bgGradient: "from-purple-600 via-purple-700 to-brand-navy",
  },
];

// Quick action cards
const quickActions = [
  { label: "Add birthdate", sublabel: "Enjoy surprises", icon: Calendar },
  { label: "Personalise", sublabel: "Add preferences", icon: Sparkles },
  { label: "Verify", sublabel: "Get perks", icon: Star },
];

// Featured services
const featuredServices = [
  {
    id: "1",
    title: "Unlock your full potential",
    category: "COACHING",
    price: 80,
    expertName: "Dr. Aisha Al Mansoori",
    rating: 4.9,
  },
  {
    id: "2",
    title: "Stress & Anxiety Management",
    category: "THERAPY",
    price: 120,
    expertName: "Dr. Sarah Ahmed",
    rating: 4.8,
  },
];

// Featured experts
const featuredExperts = [
  {
    id: "1",
    name: "Dr. Omar Al-Mansoori",
    title: "Life Strategist",
    specialty: "Career Development",
    rating: 4.9,
  },
  {
    id: "2",
    name: "Dr. Salma Al Hosani",
    title: "Certified Coach",
    specialty: "Stress Management",
    rating: 4.8,
  },
];

export default function AppXPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Handle scroll to collapse header
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const scrollTop = contentRef.current.scrollTop;
        setScrollY(scrollTop);
        setIsCollapsed(scrollTop > 50);
      }
    };

    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener("scroll", handleScroll);
      return () => contentElement.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const headerHeight = isCollapsed ? 60 : 280;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-brand-navy">
      {/* Fixed Header Section */}
      <div
        ref={headerRef}
        className={`relative transition-all duration-300 ease-out bg-gradient-to-b ${carouselSlides[currentSlide].bgGradient}`}
        style={{ height: headerHeight, minHeight: headerHeight }}
      >
        {/* Search Bar - Always visible */}
        <div className={`absolute top-0 left-0 right-0 z-20 px-4 transition-all duration-300 ${isCollapsed ? 'py-2' : 'py-3'}`}>
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Discover anything"
                className="w-full pl-12 pr-4 py-3 bg-white rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold shadow-lg"
              />
            </div>
            <button className="h-11 w-11 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
              <Menu className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        {/* Carousel Content - Hidden when collapsed */}
        <div
          className={`absolute inset-0 pt-20 px-6 transition-opacity duration-300 ${
            isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="h-full flex flex-col justify-center pb-8">
            <h1 className="text-3xl font-display font-bold text-white mb-1">
              {carouselSlides[currentSlide].title}
            </h1>
            <p className="text-white/90 text-lg mb-4">
              {carouselSlides[currentSlide].subtitle}
            </p>
            <button className="flex items-center gap-2 text-white font-medium">
              {carouselSlides[currentSlide].cta}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Carousel Dots */}
          <div className="absolute bottom-4 left-6 flex gap-2">
            {carouselSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-2 transition-all duration-300 rounded-full ${
                  i === currentSlide ? "w-6 bg-white" : "w-2 bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Scrollable Content Container */}
      <div
        ref={contentRef}
        className="flex-1 bg-white rounded-t-3xl -mt-6 overflow-y-auto relative z-10"
        style={{ marginTop: isCollapsed ? 0 : -24 }}
      >
        <div className="pt-6 pb-8">
          {/* Service Grid - Careem Style */}
          <div className="px-4 mb-6">
            <div className="grid grid-cols-4 gap-4">
              {serviceCategories.map((service) => (
                <Link
                  key={service.id}
                  href={`/appx/${service.id}`}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="relative">
                    <div className={`h-16 w-16 rounded-2xl ${service.color} flex items-center justify-center shadow-md`}>
                      <service.icon className="h-8 w-8 text-white" />
                    </div>
                    {service.badge && (
                      <span className="absolute -top-1 -right-1 bg-green-400 text-[10px] font-bold text-white px-1.5 py-0.5 rounded">
                        {service.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-medium text-gray-700 text-center">
                    {service.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Actions - Horizontal Scroll */}
          <div className="px-4 mb-6">
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {quickActions.map((action, i) => (
                <button
                  key={i}
                  className="flex-shrink-0 flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100"
                >
                  <div className="h-10 w-10 rounded-full bg-brand-gold/10 flex items-center justify-center">
                    <action.icon className="h-5 w-5 text-brand-gold" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">{action.label}</p>
                    <p className="text-xs text-gray-500">{action.sublabel}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Promo Banner */}
          <div className="px-4 mb-6">
            <div className="bg-gradient-to-r from-brand-teal to-brand-teal-light rounded-2xl p-5 text-white">
              <p className="text-sm opacity-90">Book your first session</p>
              <h3 className="text-xl font-bold mb-2">AED 50 OFF</h3>
              <p className="text-xs opacity-80 mb-3">Use code: BOLDSTART</p>
              <Button size="sm" className="bg-white text-brand-teal hover:bg-gray-100 rounded-full">
                Book Now
              </Button>
            </div>
          </div>

          {/* Featured Services */}
          <div className="mb-6">
            <div className="flex items-center justify-between px-4 mb-3">
              <h3 className="font-semibold text-gray-900">Popular Services</h3>
              <Link href="/appx/services" className="text-sm text-brand-teal font-medium">
                See All
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 px-4 scrollbar-hide">
              {featuredServices.map((service) => (
                <Link
                  key={service.id}
                  href={`/appx/services/${service.id}`}
                  className="flex-shrink-0 w-48"
                >
                  <Card className="overflow-hidden border-0 shadow-md">
                    <div className="h-28 bg-gradient-to-br from-brand-navy/80 to-brand-teal/60 relative">
                      <span className="absolute top-2 left-2 text-[10px] font-bold bg-white/90 px-2 py-1 rounded-full">
                        {service.category}
                      </span>
                      <button className="absolute top-2 right-2 h-8 w-8 bg-white/80 rounded-full flex items-center justify-center">
                        <Heart className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>
                    <CardContent className="p-3">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
                        {service.title}
                      </h4>
                      <p className="text-sm font-bold text-brand-gold mb-1">
                        {service.price} AED
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="truncate">{service.expertName}</span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {service.rating}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Featured Experts */}
          <div className="mb-6">
            <div className="flex items-center justify-between px-4 mb-3">
              <h3 className="font-semibold text-gray-900">Top Experts</h3>
              <Link href="/appx/experts" className="text-sm text-brand-teal font-medium">
                See All
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 px-4 scrollbar-hide">
              {featuredExperts.map((expert) => (
                <Link
                  key={expert.id}
                  href={`/appx/experts/${expert.id}`}
                  className="flex-shrink-0 w-40"
                >
                  <Card className="overflow-hidden border-0 shadow-md">
                    <div className="h-32 bg-gradient-to-br from-gray-200 to-gray-300 relative">
                      <button className="absolute top-2 right-2 h-8 w-8 bg-white/80 rounded-full flex items-center justify-center">
                        <Heart className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>
                    <CardContent className="p-3">
                      <h4 className="text-sm font-semibold text-gray-900 truncate">
                        {expert.name}
                      </h4>
                      <p className="text-xs text-gray-500 mb-1">{expert.title}</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-gray-600">{expert.rating}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Wellness Score Card */}
          <div className="px-4 mb-6">
            <Card className="border-0 shadow-md overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-5 text-white">
                  <h3 className="font-semibold mb-1">Your Wellness Journey</h3>
                  <p className="text-sm opacity-90 mb-3">
                    Take a quick assessment to get personalized recommendations
                  </p>
                  <Button size="sm" className="bg-white text-purple-600 hover:bg-gray-100 rounded-full">
                    Start Assessment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Discover Section */}
          <div className="px-4">
            <h3 className="font-semibold text-gray-900 mb-3">
              Discover the hottest spots in town 🌴
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Card className="overflow-hidden border-0 shadow-md">
                <div className="h-24 bg-gradient-to-br from-brand-teal to-brand-teal-light relative">
                  <div className="absolute inset-0 p-3 flex flex-col justify-end">
                    <p className="text-white font-semibold text-sm">Partner Perks</p>
                    <p className="text-white/80 text-xs">Save on wellness</p>
                  </div>
                </div>
              </Card>
              <Card className="overflow-hidden border-0 shadow-md">
                <div className="h-24 bg-gradient-to-br from-brand-gold to-yellow-400 relative">
                  <div className="absolute inset-0 p-3 flex flex-col justify-end">
                    <p className="text-white font-semibold text-sm">Group Sessions</p>
                    <p className="text-white/80 text-xs">Join the community</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
