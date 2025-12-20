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
  X,
  Home,
  HelpCircle,
  ClipboardList,
  User,
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

// Promo items for header carousel (3 stacked cards, auto-rotating)
const promoItems = [
  { id: 1, title: "Rides", subtitle: "Book now", bgColor: "bg-[#E0F4F4]", icon: Activity },
  { id: 2, title: "Food", subtitle: "Order fresh", bgColor: "bg-[#F5E6D3]", icon: Coffee },
  { id: 3, title: "Wellness", subtitle: "Feel good", bgColor: "bg-[#F0F7FF]", icon: Leaf },
];

// Navigation menu items
const navMenuItems = [
  { id: "home", label: "Home", icon: Home, href: "/appx" },
  { id: "help", label: "Help", icon: HelpCircle, href: "/appx/help", badge: true },
  { id: "activities", label: "Activities", icon: ClipboardList, href: "/appx/activities" },
  { id: "profile", label: "Profile", icon: User, href: "/appx/profile" },
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
  const [currentPromoCard, setCurrentPromoCard] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  // Auto-rotate the 3 stacked promo cards (like Careem)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromoCard((prev) => (prev + 1) % promoItems.length);
    }, 2000); // Rotate every 2 seconds for animated feel
    return () => clearInterval(interval);
  }, []);
  
  // Auto-rotate main carousel slides
  useEffect(() => {
    const currentDuration = (slides[currentSlide % slides.length]?.duration || 5) * 1000;
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
      {/* Slide-out Navigation Menu */}
      <div 
        className={`fixed inset-0 z-50 transition-all duration-300 ${
          isMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsMenuOpen(false)}
        />
        
        {/* Menu Panel */}
        <div 
          className={`absolute top-0 left-0 right-0 bg-white rounded-b-3xl shadow-2xl transition-transform duration-300 ${
            isMenuOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <div className="p-6 pt-8">
            {/* Logo and Close */}
            <div className="flex items-center justify-between mb-8">
              <Image 
                src="/images/bold-beyond-logo.png" 
                alt="Bold & Beyond" 
                width={140} 
                height={40}
                className="h-10 w-auto"
              />
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            
            {/* Navigation Items */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {navMenuItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="relative h-14 w-14 rounded-2xl border-2 border-gray-200 flex items-center justify-center hover:border-[#0D9488] transition-colors">
                    <item.icon className="h-6 w-6 text-gray-700" />
                    {item.badge && (
                      <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full" />
                    )}
                  </div>
                  <span className="text-xs font-medium text-gray-700">{item.label}</span>
                </Link>
              ))}
            </div>
            
            {/* Drag Handle */}
            <div className="flex justify-center pt-2">
              <div className="w-16 h-1.5 bg-gray-300 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Header Section */}
      <div
        ref={headerRef}
        className={`relative transition-all duration-300 ease-out bg-gradient-to-br from-[#1B365D] to-[#0D9488]`}
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
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="h-12 w-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center"
            >
              <Menu className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        {/* Carousel Content - Text LEFT, 3 Stacked Cards RIGHT */}
        <div
          className={`absolute inset-0 pt-20 transition-opacity duration-300 ${
            isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="h-full flex items-center px-5 pb-8">
            {/* Text Content - Left Side */}
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
            
            {/* 3 Stacked Promo Cards - Right Side (Auto-rotating) */}
            <div className="relative w-36 h-40 flex-shrink-0">
              {promoItems.map((item, index) => {
                const offset = (index - currentPromoCard + promoItems.length) % promoItems.length;
                const isTop = offset === 0;
                const isMiddle = offset === 1;
                const isBottom = offset === 2;
                
                return (
                  <div
                    key={item.id}
                    className={`absolute rounded-2xl shadow-lg transition-all duration-500 ease-out cursor-pointer overflow-hidden ${item.bgColor}`}
                    style={{
                      width: isTop ? 130 : isMiddle ? 115 : 100,
                      height: isTop ? 100 : isMiddle ? 85 : 70,
                      top: isTop ? 0 : isMiddle ? 10 : 20,
                      right: isTop ? 0 : isMiddle ? 8 : 16,
                      zIndex: isTop ? 3 : isMiddle ? 2 : 1,
                      opacity: isBottom ? 0.6 : isMiddle ? 0.85 : 1,
                      transform: `scale(${isTop ? 1 : isMiddle ? 0.95 : 0.9})`,
                    }}
                  >
                    <div className="h-full p-3 flex flex-col justify-between">
                      <div className="flex items-start justify-between">
                        <span className="text-xs font-semibold text-gray-700">{item.title}</span>
                        <div className="w-8 h-8 rounded-lg bg-white/70 flex items-center justify-center">
                          <item.icon className="h-4 w-4 text-gray-600" />
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-500">{item.subtitle}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Slide Progress Indicators */}
          <div className="absolute bottom-4 left-5 flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
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
          <div className={`pb-8 ${isCollapsed ? 'pt-4' : 'pt-2'}`} style={{ background: 'linear-gradient(180deg, #FDFBF7 0%, #F8F6F0 100%)' }}>
            {/* Combined Wellness Charts + Service Grid - 2 Rows, Horizontal Scroll */}
            <div className="mb-5">
              <div 
                className="flex gap-4 overflow-x-auto pb-2 px-4 cursor-grab active:cursor-grabbing"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {/* Wellness Chart Column 1 (Mind) */}
                <div className="flex flex-col gap-3 flex-shrink-0 items-center">
                  <WellnessChart value={wellnessMetrics[0].value} label={wellnessMetrics[0].label} color={wellnessMetrics[0].color} delay={0} icon={wellnessMetrics[0].icon} />
                </div>
                
                {/* Service Column 1 */}
                <div className="flex flex-col gap-3 flex-shrink-0">
                  {serviceCategories.slice(0, 2).map((service) => (
                    <Link key={service.id} href={`/appx/${service.id}`} className="flex flex-col items-center gap-1.5">
                      <div className="relative">
                        <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95`}>
                          <service.icon className="h-8 w-8 text-white" />
                        </div>
                        {service.badge && (
                          <span className="absolute -top-1 -right-1 bg-[#7DD3D3] text-[8px] font-bold text-white px-1.5 py-0.5 rounded-full shadow">{service.badge}</span>
                        )}
                      </div>
                      <span className="text-xs font-medium text-gray-600">{service.label}</span>
                    </Link>
                  ))}
                </div>
                
                {/* Wellness Chart Column 2 (Body) */}
                <div className="flex flex-col gap-3 flex-shrink-0 items-center">
                  <WellnessChart value={wellnessMetrics[1].value} label={wellnessMetrics[1].label} color={wellnessMetrics[1].color} delay={100} icon={wellnessMetrics[1].icon} />
                </div>
                
                {/* Service Column 2 */}
                <div className="flex flex-col gap-3 flex-shrink-0">
                  {serviceCategories.slice(2, 4).map((service) => (
                    <Link key={service.id} href={`/appx/${service.id}`} className="flex flex-col items-center gap-1.5">
                      <div className="relative">
                        <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95`}>
                          <service.icon className="h-8 w-8 text-white" />
                        </div>
                        {service.badge && (
                          <span className="absolute -top-1 -right-1 bg-[#7DD3D3] text-[8px] font-bold text-white px-1.5 py-0.5 rounded-full shadow">{service.badge}</span>
                        )}
                      </div>
                      <span className="text-xs font-medium text-gray-600">{service.label}</span>
                    </Link>
                  ))}
                </div>
                
                {/* Wellness Chart Column 3 (Sleep) */}
                <div className="flex flex-col gap-3 flex-shrink-0 items-center">
                  <WellnessChart value={wellnessMetrics[2].value} label={wellnessMetrics[2].label} color={wellnessMetrics[2].color} delay={200} icon={wellnessMetrics[2].icon} />
                </div>
                
                {/* Service Column 3 */}
                <div className="flex flex-col gap-3 flex-shrink-0">
                  {serviceCategories.slice(4, 6).map((service) => (
                    <Link key={service.id} href={`/appx/${service.id}`} className="flex flex-col items-center gap-1.5">
                      <div className="relative">
                        <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95`}>
                          <service.icon className="h-8 w-8 text-white" />
                        </div>
                        {service.badge && (
                          <span className="absolute -top-1 -right-1 bg-[#7DD3D3] text-[8px] font-bold text-white px-1.5 py-0.5 rounded-full shadow">{service.badge}</span>
                        )}
                      </div>
                      <span className="text-xs font-medium text-gray-600">{service.label}</span>
                    </Link>
                  ))}
                </div>
                
                {/* Wellness Chart Column 4 (Energy) */}
                <div className="flex flex-col gap-3 flex-shrink-0 items-center">
                  <WellnessChart value={wellnessMetrics[3].value} label={wellnessMetrics[3].label} color={wellnessMetrics[3].color} delay={300} icon={wellnessMetrics[3].icon} />
                </div>
                
                {/* Service Column 4 */}
                <div className="flex flex-col gap-3 flex-shrink-0">
                  {serviceCategories.slice(6, 8).map((service) => (
                    <Link key={service.id} href={`/appx/${service.id}`} className="flex flex-col items-center gap-1.5">
                      <div className="relative">
                        <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95`}>
                          <service.icon className="h-8 w-8 text-white" />
                        </div>
                        {service.badge && (
                          <span className="absolute -top-1 -right-1 bg-[#7DD3D3] text-[8px] font-bold text-white px-1.5 py-0.5 rounded-full shadow">{service.badge}</span>
                        )}
                      </div>
                      <span className="text-xs font-medium text-gray-600">{service.label}</span>
                    </Link>
                  ))}
                </div>
                
                {/* Wellness Chart Column 5 (Mood) */}
                <div className="flex flex-col gap-3 flex-shrink-0 items-center">
                  <WellnessChart value={wellnessMetrics[4].value} label={wellnessMetrics[4].label} color={wellnessMetrics[4].color} delay={400} icon={wellnessMetrics[4].icon} />
                </div>
                
                {/* Wellness Chart Column 6 (Focus) */}
                <div className="flex flex-col gap-3 flex-shrink-0 items-center">
                  <WellnessChart value={wellnessMetrics[5].value} label={wellnessMetrics[5].label} color={wellnessMetrics[5].color} delay={500} icon={wellnessMetrics[5].icon} />
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
