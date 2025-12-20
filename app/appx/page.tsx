"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Menu,
  ArrowRight,
  Heart,
  Star,
  Brain,
  Sparkles,
  Users,
  Calendar,
  Gift,
  MessageCircle,
  Stethoscope,
  Dumbbell,
  Leaf,
  Activity,
  TrendingUp,
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

// Slide type interface
interface CarouselSlide {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  gradientFrom: string;
  gradientTo: string;
  duration: number;
  isActive: boolean;
  backgroundImage?: string | null;
}

// Default carousel slides (fallback when Sanity has no data)
const defaultSlides: CarouselSlide[] = [
  {
    title: "Bold+",
    subtitle: "Save 25% with an annual membership.",
    ctaText: "Switch now",
    ctaLink: "/appx/membership",
    gradientFrom: "brand-navy",
    gradientTo: "brand-teal",
    duration: 5,
    isActive: true,
    backgroundImage: null,
  },
  {
    title: "Wellness Week",
    subtitle: "Free consultations with top experts.",
    ctaText: "Explore",
    ctaLink: "/appx/wellness",
    gradientFrom: "brand-teal",
    gradientTo: "brand-gold",
    duration: 5,
    isActive: true,
    backgroundImage: null,
  },
  {
    title: "New: Group Sessions",
    subtitle: "Connect and grow together.",
    ctaText: "Join now",
    ctaLink: "/appx/groups",
    gradientFrom: "purple-600",
    gradientTo: "brand-navy",
    duration: 5,
    isActive: true,
    backgroundImage: null,
  },
];

// Animated Wellness Chart Component
function WellnessChart({ value, label, color, delay }: { value: number; label: string; color: string; delay: number }) {
  const [animatedValue, setAnimatedValue] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setAnimatedValue((prev) => {
          if (prev >= value) {
            clearInterval(interval);
            return value;
          }
          return prev + 2;
        });
      }, 20);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-14 w-14">
        <svg className="h-14 w-14 -rotate-90 transform">
          <circle cx="28" cy="28" r="24" stroke="#E5E7EB" strokeWidth="4" fill="none" />
          <circle
            cx="28" cy="28" r="24"
            stroke={color}
            strokeWidth="4"
            fill="none"
            strokeDasharray={150.8}
            strokeDashoffset={150.8 * (1 - animatedValue / 100)}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700">
          {animatedValue}%
        </span>
      </div>
      <span className="text-[10px] text-gray-500 mt-1 text-center">{label}</span>
    </div>
  );
}

// Mini Line Chart Component
function MiniLineChart({ data, color }: { data: number[]; color: string }) {
  const maxVal = Math.max(...data);
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 50;
    const y = 24 - (val / maxVal) * 20;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox="0 0 50 28" className="w-full h-7">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-pulse"
      />
    </svg>
  );
}

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
  const [sheetY, setSheetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragStartScroll, setDragStartScroll] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  const slides = defaultSlides.filter(s => s.isActive);
  
  // Header heights: uncollapsed +25% (280 -> 350), collapsed +20% (60 -> 72)
  const HEADER_EXPANDED = 350;
  const HEADER_COLLAPSED = 72;

  // Handle drag scrolling (app-like behavior)
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true);
    setDragStartY(e.clientY);
    setDragStartScroll(contentRef.current?.scrollTop || 0);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging || !contentRef.current) return;
    const deltaY = dragStartY - e.clientY;
    contentRef.current.scrollTop = dragStartScroll + deltaY;
  }, [isDragging, dragStartY, dragStartScroll]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  }, []);

  // Handle scroll to collapse header
  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const scrollTop = contentRef.current.scrollTop;
        setSheetY(scrollTop);
        setIsCollapsed(scrollTop > 60);
      }
    };

    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener("scroll", handleScroll, { passive: true });
      return () => contentElement.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Auto-rotate carousel with dynamic duration
  useEffect(() => {
    if (slides.length === 0) return;
    const currentDuration = (slides[currentSlide]?.duration || 5) * 1000;
    const interval = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, currentDuration);
    return () => clearTimeout(interval);
  }, [currentSlide, slides]);

  const headerHeight = isCollapsed ? HEADER_COLLAPSED : HEADER_EXPANDED;
  const currentSlideData = slides[currentSlide] || defaultSlides[0];

  // Generate gradient class
  const getGradientClass = (from: string, to: string) => {
    return `from-${from} to-${to}`;
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-brand-navy select-none">
      {/* Fixed Header Section */}
      <div
        ref={headerRef}
        className={`relative transition-all duration-300 ease-out bg-gradient-to-br from-${currentSlideData.gradientFrom} to-${currentSlideData.gradientTo}`}
        style={{ height: headerHeight, minHeight: headerHeight }}
      >
        {/* Search Bar - Always visible */}
        <div className={`absolute top-0 left-0 right-0 z-20 px-4 transition-all duration-300 ${isCollapsed ? 'py-3' : 'py-4'}`}>
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Discover anything"
                className="w-full pl-12 pr-4 py-3.5 bg-white rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold shadow-lg"
              />
            </div>
            <button className="h-12 w-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
              <Menu className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        {/* Carousel Content with Square Slider - Hidden when collapsed */}
        <div
          className={`absolute inset-0 pt-20 transition-opacity duration-300 ${
            isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="h-full flex items-center px-5 pb-10">
            {/* Text Content */}
            <div className="flex-1 pr-4">
              <h1 className="text-3xl font-display font-bold text-white mb-2">
                {currentSlideData.title}
              </h1>
              <p className="text-white/90 text-base mb-4">
                {currentSlideData.subtitle}
              </p>
              <Link 
                href={currentSlideData.ctaLink || "#"}
                className="inline-flex items-center gap-2 text-white font-medium hover:underline"
              >
                {currentSlideData.ctaText}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            
            {/* Square Promotional Slider Image */}
            <div className="w-36 h-36 rounded-2xl bg-white/10 backdrop-blur-sm overflow-hidden shadow-2xl flex-shrink-0">
              {currentSlideData.backgroundImage ? (
                <Image 
                  src={`/api/sanity/image/${currentSlideData.backgroundImage}`}
                  alt={currentSlideData.title}
                  width={144}
                  height={144}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center">
                  <div className="text-center text-white/60">
                    <Sparkles className="h-10 w-10 mx-auto mb-2" />
                    <span className="text-xs">Promo</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Carousel Dots */}
          <div className="absolute bottom-5 left-5 flex gap-2">
            {slides.map((_, i) => (
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

      {/* Draggable Sheet Content Container */}
      <div
        ref={sheetRef}
        className={`flex-1 bg-white rounded-t-[2rem] overflow-hidden relative z-10 transition-all duration-300 ${
          isCollapsed ? 'rounded-t-none' : ''
        }`}
        style={{ marginTop: isCollapsed ? 0 : -28 }}
      >
        {/* Drag Handle */}
        {!isCollapsed && (
          <div className="flex justify-center py-3">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
          </div>
        )}
        
        {/* Scrollable Content - No scrollbars, drag to scroll */}
        <div
          ref={contentRef}
          className="h-full overflow-y-auto overflow-x-hidden scrollbar-none cursor-grab active:cursor-grabbing"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <div className={`pb-8 ${isCollapsed ? 'pt-4' : 'pt-2'}`}>
            {/* Wellness Indicators + Service Grid Row */}
            <div className="px-4 mb-6">
              <div className="flex gap-4 items-start">
                {/* Animated Wellness Charts */}
                <div className="flex flex-col gap-3 flex-shrink-0">
                  <WellnessChart value={72} label="Mind" color="#0D9488" delay={0} />
                  <WellnessChart value={85} label="Body" color="#D4AF37" delay={200} />
                  <div className="bg-gray-50 rounded-xl p-2">
                    <MiniLineChart data={[30, 45, 35, 60, 50, 70, 65]} color="#8B5CF6" />
                    <span className="text-[9px] text-gray-500 block text-center mt-1">Weekly</span>
                  </div>
                </div>
                
                {/* Service Grid */}
                <div className="flex-1 grid grid-cols-4 gap-3">
                  {serviceCategories.map((service) => (
                    <Link
                      key={service.id}
                      href={`/appx/${service.id}`}
                      className="flex flex-col items-center gap-1.5"
                    >
                      <div className="relative">
                        <div className={`h-14 w-14 rounded-2xl ${service.color} flex items-center justify-center shadow-md`}>
                          <service.icon className="h-7 w-7 text-white" />
                        </div>
                        {service.badge && (
                          <span className="absolute -top-1 -right-1 bg-green-400 text-[9px] font-bold text-white px-1.5 py-0.5 rounded">
                            {service.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-medium text-gray-700 text-center">
                        {service.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions - Horizontal Drag Scroll */}
            <div className="px-4 mb-6">
              <div 
                className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 cursor-grab active:cursor-grabbing"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {quickActions.map((action, i) => (
                  <button
                    key={i}
                    className="flex-shrink-0 flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100 active:scale-95 transition-transform"
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
    </div>
  );
}
