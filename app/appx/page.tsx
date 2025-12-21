"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Menu,
  ArrowRight,
  ChevronRight,
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
  Clock,
  ShoppingBag,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { sanityClient, urlFor, queries } from "@/lib/sanity";

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

// Promo items for header carousel (center big, left/right smaller)
const promoItems = [
  { id: 1, title: "Rides", subtitle: "Book now", bgColor: "bg-[#E0F4F4]", icon: Activity },
  { id: 2, title: "Food", subtitle: "Order fresh", bgColor: "bg-[#F5E6D3]", icon: Coffee },
  { id: 3, title: "Wellness", subtitle: "Feel good", bgColor: "bg-[#F0F7FF]", icon: Leaf },
];

// Navigation menu items
const navMenuItems = [
  { id: "home", label: "Home", icon: Home, href: "/appx" },
  { id: "help", label: "Help", icon: HelpCircle, href: "/appx/wellness-chat", badge: true },
  { id: "activities", label: "Activities", icon: ClipboardList, href: "/appx/activities" },
  { id: "profile", label: "Profile", icon: User, href: "/appx/profile" },
];

// Wellness metrics config (values will be dynamic from user profile)
const wellnessMetricsConfig = [
  { id: "mind", label: "Mind", defaultValue: 60, color: "#0D9488", icon: Brain },
  { id: "body", label: "Body", defaultValue: 60, color: "#D4AF37", icon: Activity },
  { id: "sleep", label: "Sleep", defaultValue: 60, color: "#6B9BC3", icon: Moon },
  { id: "energy", label: "Energy", defaultValue: 60, color: "#F4A261", icon: Zap },
  { id: "mood", label: "Mood", defaultValue: 60, color: "#E9967A", icon: Smile },
  { id: "focus", label: "Focus", defaultValue: 60, color: "#7DD3D3", icon: Sun },
  { id: "stress", label: "Stress", defaultValue: 60, color: "#B8A4C9", icon: TrendingUp },
  { id: "hydration", label: "Hydration", defaultValue: 60, color: "#6B9BC3", icon: Coffee },
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

// Service type for Sanity data
interface SanityService {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  category: string;
  basePrice?: number;
  duration?: number;
  image?: any;
  rating?: number;
  serviceType?: string;
  provider?: {
    _id: string;
    name: string;
    slug: { current: string };
    logo?: any;
  };
}

// Product type for Sanity data
interface SanityProduct {
  _id: string;
  name: string;
  slug: { current: string };
  images?: any[];
  category: string;
  price: number;
  salePrice?: number;
  discountPercentage?: number;
  provider?: {
    _id: string;
    name: string;
    slug: { current: string };
    logo?: any;
  };
}

// Provider type for Sanity data
interface SanityProvider {
  _id: string;
  name: string;
  slug: { current: string };
  logo?: any;
  coverImage?: any;
  category: string;
  shortDescription?: string;
  location?: {
    area?: string;
    distance?: string;
  };
  rating?: number;
  reviewCount?: number;
  averageSessionDuration?: string;
  priceRange?: {
    min?: number;
    max?: number;
  };
  discountText?: string;
}

// User profile type
interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  onboarding_complete: boolean;
  wellness_scores?: {
    mind?: number;
    body?: number;
    sleep?: number;
    energy?: number;
    mood?: number;
    stress?: number;
    overall?: number;
  };
  current_mood_score?: number;
  last_checkin?: string;
}

export default function AppXPage() {
  const [currentPromoCard, setCurrentPromoCard] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [services, setServices] = useState<SanityService[]>([]);
  const [products, setProducts] = useState<SanityProduct[]>([]);
  const [providers, setProviders] = useState<SanityProvider[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  const slides = defaultSlides.filter(s => s.isActive);

  // Fetch Sanity data
  useEffect(() => {
    async function fetchSanityData() {
      try {
        const [servicesData, productsData, providersData] = await Promise.all([
          sanityClient.fetch(queries.allServices),
          sanityClient.fetch(queries.allProducts),
          sanityClient.fetch(queries.allProviders),
        ]);
        setServices(servicesData || []);
        setProducts(productsData || []);
        setProviders(providersData || []);
      } catch (error) {
        console.error("Error fetching Sanity data:", error);
      } finally {
        setLoadingData(false);
      }
    }
    fetchSanityData();
  }, []);

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      const { createSupabaseClient } = await import("@/lib/supabase");
      const supabase = createSupabaseClient();
      
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        
        // Merge profile data with user metadata (auth has the name sometimes)
        const mergedProfile = {
          ...profile,
          id: user.id,
          email: user.email || profile?.email,
          // Check multiple sources for name: profile table, user_metadata, email
          full_name: profile?.full_name || user.user_metadata?.full_name || user.user_metadata?.name || null,
        };
        
        setUserProfile(mergedProfile);
      }
    };
    
    fetchUserProfile();
  }, []);

  // Get user display name and initials - check multiple sources
  const userName = userProfile?.full_name || 
    (userProfile?.email ? userProfile.email.split("@")[0].replace(/[._]/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : "User");
  const userInitials = userName.split(" ").map(n => n?.[0] || "").join("").toUpperCase().slice(0, 2) || "U";
  
  // Calculate wellness score from stored data
  const userWellnessScore = (() => {
    const scores = userProfile?.wellness_scores;
    if (!scores || typeof scores !== 'object') return null;
    const values = [scores.mind, scores.body, scores.sleep, scores.energy, scores.mood]
      .filter((v): v is number => typeof v === 'number' && !isNaN(v));
    return values.length > 0 ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : null;
  })();
  
  // Get mood label from score
  const userMoodLabel = (() => {
    const mood = userProfile?.wellness_scores?.mood || userProfile?.current_mood_score;
    if (!mood || typeof mood !== 'number') return null;
    if (mood >= 80) return { emoji: '😄', text: 'Great' };
    if (mood >= 60) return { emoji: '😊', text: 'Happy' };
    if (mood >= 40) return { emoji: '😐', text: 'Okay' };
    return { emoji: '😔', text: 'Low' };
  })();
  
  // Header heights
  const HEADER_EXPANDED = 350;
  const HEADER_COLLAPSED = 72;

  // Handle content scroll - collapse on scroll down, expand only at top
  useEffect(() => {
    const contentElement = contentRef.current;
    if (!contentElement) return;

    const handleScroll = () => {
      const scrollTop = contentElement.scrollTop;
      
      // Scrolling down - collapse header
      if (scrollTop > lastScrollTop && scrollTop > 20) {
        setIsCollapsed(true);
      }
      // At the very top - expand header
      else if (scrollTop === 0) {
        setIsCollapsed(false);
      }
      
      setLastScrollTop(scrollTop);
    };

    contentElement.addEventListener('scroll', handleScroll, { passive: true });
    return () => contentElement.removeEventListener('scroll', handleScroll);
  }, [lastScrollTop]);

  // Handle bar drag - drag UP to collapse, drag DOWN to expand
  const handleDragStart = useRef({ y: 0, collapsed: false });
  
  const handleHandlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    handleDragStart.current = { y: e.clientY, collapsed: isCollapsed };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [isCollapsed]);

  const handleHandlePointerMove = useCallback((e: React.PointerEvent) => {
    const deltaY = e.clientY - handleDragStart.current.y;
    
    // Dragging UP (negative deltaY) = collapse
    if (deltaY < -30 && !isCollapsed) {
      setIsCollapsed(true);
    }
    // Dragging DOWN (positive deltaY) = expand (only if at top of content)
    else if (deltaY > 30 && isCollapsed && contentRef.current?.scrollTop === 0) {
      setIsCollapsed(false);
    }
  }, [isCollapsed]);

  const handleHandlePointerUp = useCallback((e: React.PointerEvent) => {
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  }, []);

  // Auto-rotate the 3 stacked promo cards (like Careem) - 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromoCard((prev) => (prev + 1) % promoItems.length);
    }, 3000); // Rotate every 3 seconds
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
      {/* Slide-out Navigation Menu - Draggable */}
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
        
        {/* Menu Panel - Slides from top */}
        <div 
          className={`absolute top-0 left-0 right-0 bg-[#F5F3EF] rounded-b-[2rem] shadow-2xl transition-transform duration-300 ease-out ${
            isMenuOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
          style={{ maxHeight: '85vh' }}
        >
          <div className="p-5 pt-10 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 40px)' }}>
            {/* Header: Logo + Brand + Close */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Image 
                  src="/images/bold-beyond-logo.png" 
                  alt="Bold & Beyond" 
                  width={40} 
                  height={40}
                  className="h-10 w-10 object-contain"
                />
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-[#0D4F4F] leading-tight">BOLD&</span>
                  <span className="text-lg font-bold text-[#0D4F4F] leading-tight">BEYOND</span>
                </div>
              </div>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="h-10 w-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* User Profile Section */}
            <div className="flex items-center gap-4 mb-6">
              {/* Avatar - Shows photo or initials */}
              <div className="relative">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#0D9488] to-[#0D4F4F] p-0.5">
                  {userProfile?.avatar_url ? (
                    <img 
                      src={userProfile.avatar_url} 
                      alt={userName}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full rounded-full bg-[#F5E6D3] flex items-center justify-center">
                      <span className="text-xl font-bold text-[#0D4F4F]">{userInitials}</span>
                    </div>
                  )}
                </div>
                {/* Teal accent */}
                <div className="absolute -bottom-1 -left-1 h-6 w-6 bg-[#0D9488] rounded-full" />
              </div>
              
              {/* Name & Stats */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Hi, {userName.split(" ")[0]}!</h2>
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Pro Member Badge */}
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#D4AF37] text-white text-xs font-bold rounded-full">
                    <Star className="h-3 w-3 fill-white" />
                    {userProfile?.role === 'admin' ? 'Admin' : 'Pro Member'}
                  </span>
                  {/* Wellness Score & Mood */}
                  <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                    <span className="text-[#D4AF37]">👤</span> {userWellnessScore !== null ? `${userWellnessScore}%` : '—%'}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                    {userMoodLabel ? `${userMoodLabel.emoji} ${userMoodLabel.text}` : '😊 —'}
                  </span>
                </div>
              </div>
            </div>

            {/* Finish Profile Reminder - Shows if onboarding was skipped */}
            {typeof window !== 'undefined' && localStorage.getItem('onboarding_skipped') === 'true' && !localStorage.getItem('onboarding_complete') && (
              <Link
                href="/onboarding"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 p-4 mb-5 bg-gradient-to-r from-[#FFF3E0] to-[#FFE0B2] rounded-2xl border border-[#FFB74D]"
              >
                <div className="h-10 w-10 rounded-full bg-[#FF9800] flex items-center justify-center">
                  <span className="text-white text-lg">⚡</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">Finish your profile</p>
                  <p className="text-xs text-gray-600">Activate all features</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>
            )}

            {/* Navigation Items - Circular buttons */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              {navMenuItems.map((item, index) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex flex-col items-center gap-2"
                >
                  <div className={`relative h-16 w-16 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 ${
                    index === 1 ? 'bg-[#25D366] shadow-lg' : 'bg-white shadow-md border border-gray-100'
                  }`}>
                    <item.icon className={`h-6 w-6 ${index === 1 ? 'text-white' : 'text-gray-700'}`} />
                    {item.badge && (
                      <span className="absolute -top-0.5 -right-0.5 h-3 w-3 bg-red-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <span className="text-xs font-medium text-gray-700">{item.label}</span>
                </Link>
              ))}
            </div>

            {/* AI Daily Question Card */}
            <Link href="/appx/wellness-chat" className="block">
              <div className="bg-white rounded-2xl p-4 shadow-sm mb-4 hover:shadow-md transition-shadow">
                <div className="flex gap-4">
                  {/* Date */}
                  <div className="flex flex-col items-center justify-center bg-gradient-to-br from-[#0D9488] to-[#7DD3D3] rounded-xl px-4 py-2 text-white">
                    <span className="text-xs font-medium uppercase opacity-90">
                      {new Date().toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-2xl font-bold">
                      {new Date().getDate()}
                    </span>
                  </div>
                  
                  {/* Content - AI Generated Question */}
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">
                      {(() => {
                        const hour = new Date().getHours();
                        if (hour < 12) return "How are you feeling this morning?";
                        if (hour < 17) return "How's your energy level this afternoon?";
                        return "How was your day today?";
                      })()}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Share with our AI wellness coach for personalized insights.
                    </p>
                  </div>
                </div>
                
                {/* CTA Button */}
                <div className="w-full mt-4 py-3 bg-[#7DD3D3] hover:bg-[#6BC4C4] text-white font-semibold rounded-2xl transition-colors text-center">
                  Share My Thoughts
                </div>
              </div>
            </Link>
          </div>
          
          {/* Draggable Handle Bar - Drag up to close */}
          <div 
            className="flex justify-center py-4 cursor-grab active:cursor-grabbing touch-none bg-[#F5F3EF] rounded-b-[2rem]"
            onPointerDown={(e) => {
              e.preventDefault();
              const startY = e.clientY;
              const onMove = (moveEvent: PointerEvent) => {
                const deltaY = moveEvent.clientY - startY;
                if (deltaY < -50) {
                  setIsMenuOpen(false);
                  document.removeEventListener('pointermove', onMove);
                  document.removeEventListener('pointerup', onUp);
                }
              };
              const onUp = () => {
                document.removeEventListener('pointermove', onMove);
                document.removeEventListener('pointerup', onUp);
              };
              document.addEventListener('pointermove', onMove);
              document.addEventListener('pointerup', onUp);
            }}
          >
            <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
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
            <Link href="/appx/search" className="flex-1 relative block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <div className="w-full pl-12 pr-4 py-3.5 bg-white rounded-full text-sm text-gray-400 shadow-lg cursor-pointer hover:ring-2 hover:ring-brand-gold transition-all">
                Discover anything
              </div>
            </Link>
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
            
            {/* Rotating Carousel - Center big, Left/Right smaller behind */}
            <div className="relative w-44 h-28 flex-shrink-0 flex items-center justify-center">
              {promoItems.map((item, index) => {
                const offset = (index - currentPromoCard + promoItems.length) % promoItems.length;
                const isCenter = offset === 0;
                const isRight = offset === 1;
                const isLeft = offset === 2;
                
                return (
                  <div
                    key={item.id}
                    className={`absolute rounded-2xl shadow-lg transition-all duration-500 ease-out cursor-pointer overflow-hidden ${item.bgColor}`}
                    style={{
                      width: isCenter ? 100 : 70,
                      height: isCenter ? 90 : 65,
                      left: isCenter ? '50%' : isLeft ? '0%' : 'auto',
                      right: isRight ? '0%' : 'auto',
                      transform: isCenter ? 'translateX(-50%) scale(1)' : isLeft ? 'translateX(0) scale(0.85)' : 'translateX(0) scale(0.85)',
                      zIndex: isCenter ? 3 : 1,
                      opacity: isCenter ? 1 : 0.7,
                    }}
                  >
                    <div className="h-full p-2 flex flex-col justify-between">
                      <div className="flex items-start justify-between">
                        <span className="text-[10px] font-semibold text-gray-700">{item.title}</span>
                        <div className="w-6 h-6 rounded-lg bg-white/70 flex items-center justify-center">
                          <item.icon className="h-3 w-3 text-gray-600" />
                        </div>
                      </div>
                      <p className="text-[8px] text-gray-500">{item.subtitle}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Slide Progress Indicators - Positioned higher */}
          <div className="absolute bottom-12 left-5 flex items-center gap-2">
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
        className={`flex-1 bg-white rounded-t-[2rem] overflow-hidden relative z-10 transition-all duration-300 ease-out ${
          isCollapsed ? 'rounded-t-none' : ''
        }`}
        style={{ marginTop: isCollapsed ? 0 : -28 }}
      >
        {/* Drag Handle - Functional */}
        <div 
          className="flex justify-center py-4 cursor-grab active:cursor-grabbing touch-none"
          onPointerDown={handleHandlePointerDown}
          onPointerMove={handleHandlePointerMove}
          onPointerUp={handleHandlePointerUp}
          onPointerLeave={handleHandlePointerUp}
        >
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>
        
        {/* Scrollable Content */}
        <div
          ref={contentRef}
          className="h-full overflow-y-auto overflow-x-hidden scrollbar-none"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <div className={`pb-32 ${isCollapsed ? 'pt-4' : 'pt-2'}`} style={{ background: 'linear-gradient(180deg, #FDFBF7 0%, #F8F6F0 100%)' }}>
            {/* Row 1: 8 Wellness Charts - Horizontal Scroll + Daily Check-in */}
            <div className="mb-4">
              <div 
                className="flex gap-3 overflow-x-auto pb-2 px-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {/* Daily Check-in Button */}
                <Link href="/appx/wellness-checkin" className="flex-shrink-0">
                  <div className="flex flex-col items-center p-2 rounded-2xl bg-gradient-to-br from-[#0D9488] to-[#7DD3D3] shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 active:scale-95"
                    style={{ minWidth: 80 }}
                  >
                    <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
                      <span className="text-2xl">✨</span>
                    </div>
                    <span className="text-xs font-medium text-white mt-1">Check-in</span>
                  </div>
                </Link>
                {wellnessMetricsConfig.map((metric, i) => {
                  const score = userProfile?.wellness_scores?.[metric.id as keyof typeof userProfile.wellness_scores] ?? metric.defaultValue;
                  return (
                    <Link key={metric.id} href="/appx/wellness-tracker" className="flex-shrink-0">
                      <WellnessChart value={score} label={metric.label} color={metric.color} delay={i * 100} icon={metric.icon} />
                    </Link>
                  );
                })}
              </div>
            </div>
            
            {/* Row 2: All Service Buttons - Horizontal Scroll */}
            <div className="mb-5">
              <div 
                className="flex gap-3 overflow-x-auto pb-2 px-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {serviceCategories.map((service) => (
                  <Link key={service.id} href={`/appx/${service.id}`} className="flex flex-col items-center gap-1.5 flex-shrink-0">
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

          {/* Featured Services from Sanity */}
          <div className="mb-6">
            <div className="flex items-center justify-between px-4 mb-3">
              <h3 className="font-semibold text-gray-900">Popular Services</h3>
              <Link href="/appx/services" className="text-sm text-brand-teal font-medium">
                See All
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 px-4 scrollbar-hide">
              {loadingData ? (
                [1, 2, 3].map((i) => (
                  <div key={i} className="flex-shrink-0 w-48 animate-pulse">
                    <div className="h-28 bg-gray-200 rounded-t-xl" />
                    <div className="bg-white p-3 rounded-b-xl space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))
              ) : services.length > 0 ? (
                services.slice(0, 6).map((service: SanityService) => (
                  <Link
                    key={service._id}
                    href={`/appx/services/${service.slug.current}`}
                    className="flex-shrink-0 w-48"
                  >
                    <Card className="overflow-hidden border-0 shadow-md h-full min-h-[220px]">
                      <div className="h-28 bg-gradient-to-br from-brand-navy/80 to-brand-teal/60 relative">
                        {service.image && (
                          <Image
                            src={urlFor(service.image).width(300).height(200).url()}
                            alt={service.title}
                            fill
                            className="object-cover"
                          />
                        )}
                        <span className="absolute top-2 left-2 text-[10px] font-bold bg-white/90 px-2 py-1 rounded-full uppercase">
                          {service.category}
                        </span>
                        <FavoriteButton
                          item={{
                            item_type: "service",
                            item_id: service._id,
                            item_slug: service.slug.current,
                            item_name: service.title,
                            item_image_url: service.image ? urlFor(service.image).width(300).url() : null,
                            item_category: service.category,
                            item_price: service.basePrice ?? null,
                          }}
                          className="absolute top-2 right-2"
                        />
                      </div>
                      <CardContent className="p-3 flex flex-col flex-1">
                        <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 min-h-[40px]">
                          {service.title}
                        </h4>
                        <p className="text-sm font-bold text-brand-gold mb-1">
                          {service.basePrice || 0} AED
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="truncate flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {service.duration || 60}min
                          </span>
                          {service.rating && (
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              {service.rating}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              ) : (
                <p className="text-gray-500 text-sm px-2">No services available</p>
              )}
            </div>
          </div>

          {/* Featured Products from Sanity */}
          <div className="mb-6">
            <div className="flex items-center justify-between px-4 mb-3">
              <h3 className="font-semibold text-gray-900">Wellness Products</h3>
              <Link href="/appx/products" className="text-sm text-brand-teal font-medium">
                See All
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 px-4 scrollbar-hide">
              {loadingData ? (
                [1, 2, 3].map((i) => (
                  <div key={i} className="flex-shrink-0 w-40 animate-pulse">
                    <div className="h-32 bg-gray-200 rounded-t-xl" />
                    <div className="bg-white p-3 rounded-b-xl space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))
              ) : products.length > 0 ? (
                products.slice(0, 6).map((product: SanityProduct) => (
                  <Link
                    key={product._id}
                    href={`/appx/products/${product.slug.current}`}
                    className="flex-shrink-0 w-40"
                  >
                    <Card className="overflow-hidden border-0 shadow-md h-full min-h-[220px]">
                      <div className="h-32 bg-gray-100 relative">
                        {product.images && product.images[0] ? (
                          <Image
                            src={urlFor(product.images[0]).width(200).height(200).url()}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                            <span className="text-3xl">🧴</span>
                          </div>
                        )}
                        {product.discountPercentage && (
                          <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            -{product.discountPercentage}%
                          </span>
                        )}
                        <FavoriteButton
                          item={{
                            item_type: "product",
                            item_id: product._id,
                            item_slug: product.slug.current,
                            item_name: product.name,
                            item_image_url: product.images?.[0] ? urlFor(product.images[0]).width(200).url() : null,
                            item_category: product.category,
                            item_price: product.salePrice || product.price || null,
                          }}
                          size="sm"
                          className="absolute top-2 right-2"
                        />
                      </div>
                      <CardContent className="p-3 flex flex-col flex-1">
                        <h4 className="text-xs font-semibold text-gray-900 line-clamp-2 mb-1 min-h-[32px]">
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-1">
                          {product.salePrice ? (
                            <>
                              <span className="text-xs text-gray-400 line-through">
                                {product.price}
                              </span>
                              <span className="text-sm font-bold text-[#0D9488]">
                                {product.salePrice} AED
                              </span>
                            </>
                          ) : (
                            <span className="text-sm font-bold text-gray-900">
                              {product.price} AED
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              ) : (
                <p className="text-gray-500 text-sm px-2">No products available</p>
              )}
            </div>
          </div>

          {/* Featured Providers from Sanity */}
          <div className="mb-6">
            <div className="flex items-center justify-between px-4 mb-3">
              <h3 className="font-semibold text-gray-900">Top Providers</h3>
              <Link href="/appx/providers" className="text-sm text-brand-teal font-medium">
                See All
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 px-4 scrollbar-hide">
              {loadingData ? (
                [1, 2, 3].map((i) => (
                  <div key={i} className="flex-shrink-0 w-56 animate-pulse">
                    <div className="h-24 bg-gray-200 rounded-t-xl" />
                    <div className="bg-white p-3 rounded-b-xl space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))
              ) : providers.length > 0 ? (
                providers.slice(0, 5).map((provider: SanityProvider) => (
                  <Link
                    key={provider._id}
                    href={`/appx/providers/${provider.slug.current}`}
                    className="flex-shrink-0 w-56"
                  >
                    <Card className="overflow-hidden border-0 shadow-md h-full min-h-[180px]">
                      <div className="h-24 bg-gradient-to-br from-[#1B365D] to-[#0D9488] relative">
                        {provider.coverImage && (
                          <Image
                            src={urlFor(provider.coverImage).width(300).height(150).url()}
                            alt={provider.name}
                            fill
                            className="object-cover"
                          />
                        )}
                        <div className="absolute bottom-0 left-3 translate-y-1/2">
                          <div className="h-12 w-12 rounded-xl bg-white shadow-lg overflow-hidden border-2 border-white">
                            {provider.logo ? (
                              <Image
                                src={urlFor(provider.logo).width(80).height(80).url()}
                                alt={provider.name}
                                width={48}
                                height={48}
                                className="object-cover"
                              />
                            ) : (
                              <div className="h-full w-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                                <span className="text-xl">🧘</span>
                              </div>
                            )}
                          </div>
                        </div>
                        {provider.rating && (
                          <div className="absolute top-2 right-2 bg-white/90 px-2 py-0.5 rounded-lg flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-semibold">{provider.rating}</span>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-3 pt-8">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                          {provider.name}
                        </h4>
                        <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {provider.location?.area || provider.category}
                        </p>
                        {provider.discountText && (
                          <p className="text-[10px] text-[#0D9488] font-medium truncate">
                            🎁 {provider.discountText}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))
              ) : (
                <p className="text-gray-500 text-sm px-2">No providers available</p>
              )}
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
