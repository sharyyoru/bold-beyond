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
  Moon,
  Sun,
  Zap,
  Smile,
  Coffee,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Sand/Water/Air color palette for welcoming feel
const colors = {
  sand: {
    light: "#F5E6D3",
    medium: "#E8D5C4",
    dark: "#D4B896",
  },
  water: {
    light: "#E0F4F4",
    medium: "#7DD3D3",
    dark: "#0D9488",
  },
  air: {
    light: "#F0F7FF",
    medium: "#B8D4E8",
    dark: "#6B9BC3",
  },
  warmth: {
    gold: "#D4AF37",
    coral: "#F4A261",
    rose: "#E9967A",
  },
};

// Service categories with welcoming colors
const serviceCategories = [
  { id: "therapy", label: "Therapy", icon: Brain, color: "bg-[#6B9BC3]", gradient: "from-[#6B9BC3] to-[#5A8AB2]" },
  { id: "coaching", label: "Coaching", icon: Sparkles, color: "bg-[#D4AF37]", gradient: "from-[#D4AF37] to-[#C9A42E]" },
  { id: "wellness", label: "Wellness", icon: Leaf, color: "bg-[#7DD3D3]", gradient: "from-[#7DD3D3] to-[#0D9488]", badge: "New" },
  { id: "groups", label: "Groups", icon: Users, color: "bg-[#B8A4C9]", gradient: "from-[#B8A4C9] to-[#9B8BB5]" },
  { id: "clinics", label: "Clinics", icon: Stethoscope, color: "bg-[#0D9488]", gradient: "from-[#0D9488] to-[#0B7B71]" },
  { id: "fitness", label: "Fitness", icon: Dumbbell, color: "bg-[#F4A261]", gradient: "from-[#F4A261] to-[#E8914F]" },
  { id: "perks", label: "Perks", icon: Gift, color: "bg-[#E9967A]", gradient: "from-[#E9967A] to-[#D88568]" },
  { id: "support", label: "Support", icon: MessageCircle, color: "bg-[#7DD3D3]", gradient: "from-[#7DD3D3] to-[#6BC4C4]" },
];

// Promo items for carousel (3 items per slide)
const promoItems = [
  { id: 1, title: "Therapy", subtitle: "Talk to experts", image: "/promo/therapy.png", bgColor: "bg-[#E0F4F4]" },
  { id: 2, title: "Wellness", subtitle: "Daily check-ins", image: "/promo/wellness.png", bgColor: "bg-[#F5E6D3]" },
  { id: 3, title: "Groups", subtitle: "Join community", image: "/promo/groups.png", bgColor: "bg-[#F0F7FF]" },
  { id: 4, title: "Coaching", subtitle: "Life goals", image: "/promo/coaching.png", bgColor: "bg-[#FFF8E7]" },
  { id: 5, title: "Fitness", subtitle: "Move & groove", image: "/promo/fitness.png", bgColor: "bg-[#FFF0E6]" },
  { id: 6, title: "Perks", subtitle: "Exclusive deals", image: "/promo/perks.png", bgColor: "bg-[#F5E6D3]" },
];

// Wellness metrics for charts
const wellnessMetrics = [
  { id: "mind", label: "Mind", value: 72, color: "#0D9488", icon: Brain },
  { id: "body", label: "Body", value: 85, color: "#D4AF37", icon: Activity },
  { id: "sleep", label: "Sleep", value: 68, color: "#6B9BC3", icon: Moon },
  { id: "energy", label: "Energy", value: 79, color: "#F4A261", icon: Zap },
  { id: "mood", label: "Mood", value: 88, color: "#E9967A", icon: Smile },
  { id: "focus", label: "Focus", value: 65, color: "#7DD3D3", icon: Sun },
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

// Animated Wellness Chart Component - Bigger size
function WellnessChart({ value, label, color, delay, icon: Icon }: { value: number; label: string; color: string; delay: number; icon?: any }) {
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
    <div className="flex flex-col items-center flex-shrink-0 p-2 rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
      style={{ minWidth: 80 }}
    >
      <div className="relative h-16 w-16">
        <svg className="h-16 w-16 -rotate-90 transform">
          <circle cx="32" cy="32" r="28" stroke="#F5E6D3" strokeWidth="5" fill="none" />
          <circle
            cx="32" cy="32" r="28"
            stroke={color}
            strokeWidth="5"
            fill="none"
            strokeDasharray={175.9}
            strokeDashoffset={175.9 * (1 - animatedValue / 100)}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold" style={{ color }}>
          {animatedValue}%
        </span>
      </div>
      <div className="flex items-center gap-1 mt-1">
        {Icon && <Icon className="h-3 w-3" style={{ color }} />}
        <span className="text-xs font-medium text-gray-600">{label}</span>
      </div>
    </div>
  );
}

// Promo Card Component for carousel
function PromoCard({ item }: { item: typeof promoItems[0] }) {
  return (
    <div className={`${item.bgColor} rounded-2xl p-3 h-24 w-24 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer`}>
      <div className="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center mb-1">
        <Sparkles className="h-6 w-6 text-gray-600" />
      </div>
      <p className="text-[10px] font-semibold text-gray-700 truncate w-full">{item.title}</p>
      <p className="text-[8px] text-gray-500 truncate w-full">{item.subtitle}</p>
    </div>
  );
}

// Timer Progress Bar Component
function SlideProgressBar({ duration, isActive, onComplete }: { duration: number; isActive: boolean; onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (!isActive) {
      setProgress(0);
      return;
    }
    
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / (duration * 1000)) * 100, 100);
      setProgress(newProgress);
      
      if (newProgress >= 100) {
        clearInterval(interval);
        onComplete();
      }
    }, 50);
    
    return () => clearInterval(interval);
  }, [isActive, duration, onComplete]);

  return (
    <div className="h-1 bg-white/20 rounded-full overflow-hidden flex-1">
      <div 
        className="h-full bg-white rounded-full transition-all duration-100"
        style={{ width: `${progress}%` }}
      />
    </div>
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

  // Calculate total promo slides (3 items per slide)
  const totalPromoSlides = Math.ceil(promoItems.length / 3);
  
  // Auto-rotate carousel with dynamic duration
  useEffect(() => {
    if (totalPromoSlides === 0) return;
    const currentDuration = (slides[currentSlide % slides.length]?.duration || 5) * 1000;
    const interval = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % totalPromoSlides);
    }, currentDuration);
    return () => clearTimeout(interval);
  }, [currentSlide, slides, totalPromoSlides]);

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

        {/* Carousel Content with 3 Promo Items - Hidden when collapsed */}
        <div
          className={`absolute inset-0 pt-16 transition-opacity duration-300 ${
            isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="h-full flex flex-col justify-center px-5 pb-12">
            {/* Text Content */}
            <div className="mb-4">
              <h1 className="text-2xl font-display font-bold text-white mb-1">
                {currentSlideData.title}
              </h1>
              <p className="text-white/90 text-sm mb-3">
                {currentSlideData.subtitle}
              </p>
              <Link 
                href={currentSlideData.ctaLink || "#"}
                className="inline-flex items-center gap-2 text-white text-sm font-medium hover:underline"
              >
                {currentSlideData.ctaText}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            
            {/* 3 Promo Cards per Slide */}
            <div className="flex gap-3">
              {promoItems.slice(currentSlide * 3, currentSlide * 3 + 3).map((item) => (
                <div 
                  key={item.id}
                  className={`${item.bgColor} rounded-2xl p-3 flex-1 flex flex-col items-center justify-center text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer`}
                  style={{ minHeight: 100 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-white/70 flex items-center justify-center mb-2 shadow-sm">
                    <Sparkles className="h-6 w-6 text-gray-600" />
                  </div>
                  <p className="text-xs font-semibold text-gray-700">{item.title}</p>
                  <p className="text-[10px] text-gray-500">{item.subtitle}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Slide Progress Indicators */}
          <div className="absolute bottom-4 left-5 right-5 flex items-center gap-3">
            {Array.from({ length: Math.ceil(promoItems.length / 3) }).map((_, i) => (
              <div key={i} className="flex-1 flex items-center gap-2">
                <div 
                  className={`h-1.5 rounded-full overflow-hidden flex-1 transition-all ${
                    i === currentSlide ? 'bg-white/30' : 'bg-white/10'
                  }`}
                >
                  {i === currentSlide && (
                    <div 
                      className="h-full bg-white rounded-full animate-progress"
                      style={{ 
                        animation: `progress ${currentSlideData.duration}s linear`,
                        width: '100%'
                      }}
                    />
                  )}
                  {i < currentSlide && (
                    <div className="h-full bg-white/60 rounded-full w-full" />
                  )}
                </div>
              </div>
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
          <div className={`pb-8 ${isCollapsed ? 'pt-4' : 'pt-2'}`} style={{ background: 'linear-gradient(180deg, #FDFBF7 0%, #F8F6F0 100%)' }}>
            {/* Wellness Charts - Horizontal Scroll (6 charts) */}
            <div className="mb-5">
              <div className="flex items-center justify-between px-4 mb-3">
                <h3 className="text-sm font-semibold text-gray-700">Your Wellness</h3>
                <Link href="/appx/wellness" className="text-xs text-[#0D9488] font-medium">View All</Link>
              </div>
              <div 
                className="flex gap-3 overflow-x-auto pb-2 px-4 cursor-grab active:cursor-grabbing"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {wellnessMetrics.map((metric, i) => (
                  <WellnessChart 
                    key={metric.id}
                    value={metric.value} 
                    label={metric.label} 
                    color={metric.color} 
                    delay={i * 100}
                    icon={metric.icon}
                  />
                ))}
              </div>
            </div>

            {/* Service Grid - 2 Rows Max, Horizontal Scroll */}
            <div className="mb-5">
              <div 
                className="flex gap-3 overflow-x-auto pb-2 px-4 cursor-grab active:cursor-grabbing"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {/* First column of 2 */}
                <div className="flex flex-col gap-3 flex-shrink-0">
                  {serviceCategories.slice(0, 2).map((service) => (
                    <Link
                      key={service.id}
                      href={`/appx/${service.id}`}
                      className="flex flex-col items-center gap-1.5"
                    >
                      <div className="relative">
                        <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95`}>
                          <service.icon className="h-8 w-8 text-white" />
                        </div>
                        {service.badge && (
                          <span className="absolute -top-1 -right-1 bg-[#7DD3D3] text-[8px] font-bold text-white px-1.5 py-0.5 rounded-full shadow">
                            {service.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-medium text-gray-600">{service.label}</span>
                    </Link>
                  ))}
                </div>
                {/* Second column of 2 */}
                <div className="flex flex-col gap-3 flex-shrink-0">
                  {serviceCategories.slice(2, 4).map((service) => (
                    <Link
                      key={service.id}
                      href={`/appx/${service.id}`}
                      className="flex flex-col items-center gap-1.5"
                    >
                      <div className="relative">
                        <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95`}>
                          <service.icon className="h-8 w-8 text-white" />
                        </div>
                        {service.badge && (
                          <span className="absolute -top-1 -right-1 bg-[#7DD3D3] text-[8px] font-bold text-white px-1.5 py-0.5 rounded-full shadow">
                            {service.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-medium text-gray-600">{service.label}</span>
                    </Link>
                  ))}
                </div>
                {/* Third column of 2 */}
                <div className="flex flex-col gap-3 flex-shrink-0">
                  {serviceCategories.slice(4, 6).map((service) => (
                    <Link
                      key={service.id}
                      href={`/appx/${service.id}`}
                      className="flex flex-col items-center gap-1.5"
                    >
                      <div className="relative">
                        <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95`}>
                          <service.icon className="h-8 w-8 text-white" />
                        </div>
                        {service.badge && (
                          <span className="absolute -top-1 -right-1 bg-[#7DD3D3] text-[8px] font-bold text-white px-1.5 py-0.5 rounded-full shadow">
                            {service.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-medium text-gray-600">{service.label}</span>
                    </Link>
                  ))}
                </div>
                {/* Fourth column of 2 */}
                <div className="flex flex-col gap-3 flex-shrink-0">
                  {serviceCategories.slice(6, 8).map((service) => (
                    <Link
                      key={service.id}
                      href={`/appx/${service.id}`}
                      className="flex flex-col items-center gap-1.5"
                    >
                      <div className="relative">
                        <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95`}>
                          <service.icon className="h-8 w-8 text-white" />
                        </div>
                        {service.badge && (
                          <span className="absolute -top-1 -right-1 bg-[#7DD3D3] text-[8px] font-bold text-white px-1.5 py-0.5 rounded-full shadow">
                            {service.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-medium text-gray-600">{service.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions - Horizontal Scroll, Taller */}
            <div className="mb-5">
              <div 
                className="flex gap-3 overflow-x-auto pb-2 px-4 cursor-grab active:cursor-grabbing"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {quickActions.map((action, i) => (
                  <button
                    key={i}
                    className="flex-shrink-0 flex items-center gap-3 bg-white rounded-2xl px-5 py-4 shadow-sm hover:shadow-md border border-[#E8D5C4] active:scale-95 transition-all duration-300"
                  >
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#F5E6D3] to-[#E8D5C4] flex items-center justify-center">
                      <action.icon className="h-6 w-6 text-[#D4AF37]" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-800">{action.label}</p>
                      <p className="text-xs text-gray-500">{action.sublabel}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          {/* Promo Banner - Sand/Water colors */}
          <div className="px-4 mb-5">
            <div className="bg-gradient-to-r from-[#0D9488] via-[#7DD3D3] to-[#B8D4E8] rounded-2xl p-5 text-white shadow-lg">
              <p className="text-sm opacity-90">Book your first session</p>
              <h3 className="text-xl font-bold mb-2">AED 50 OFF</h3>
              <p className="text-xs opacity-80 mb-3">Use code: BOLDSTART</p>
              <Button size="sm" className="bg-white text-[#0D9488] hover:bg-[#F5E6D3] rounded-full shadow-md">
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
