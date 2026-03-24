"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronDown, Brain, Heart, Zap, Target, Apple, Play, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const pillarsMenu = {
  title: "The 4 Pillars",
  items: [
    {
      name: "Mind",
      description: "Thought patterns & cognitive reframing",
      icon: Brain,
      href: "/pillars/mind",
      color: "text-palette-sky",
      bgColor: "bg-blue-50",
    },
    {
      name: "Emotion",
      description: "Emotional states & body awareness",
      icon: Heart,
      href: "/pillars/emotion",
      color: "text-rose-500",
      bgColor: "bg-rose-50",
    },
    {
      name: "Energy",
      description: "Nervous system & recovery",
      icon: Zap,
      href: "/pillars/energy",
      color: "text-amber-500",
      bgColor: "bg-amber-50",
    },
    {
      name: "Purpose",
      description: "Life alignment & identity",
      icon: Target,
      href: "/pillars/purpose",
      color: "text-palette-sea",
      bgColor: "bg-teal-50",
    },
  ],
};

const featuresMenu = {
  title: "Features",
  items: [
    { name: "Emotional Pattern Mapping", href: "/features/emotional-mapping", description: "Track recurring emotions & triggers" },
    { name: "Thought Reframe Engine", href: "/features/thought-reframe", description: "CBT + NLP powered reframing" },
    { name: "Nervous System Tracker", href: "/features/nervous-system", description: "Beyond HRV monitoring" },
    { name: "Alignment Actions", href: "/features/alignment-actions", description: "Actions that actually matter" },
    { name: "Identity Shift Engine", href: "/features/identity-shift", description: "Track your growth patterns" },
  ],
};

const navigation = [
  { name: "Home", href: "/" },
  { name: "Pillars", href: "#", hasDropdown: true, menu: "pillars" },
  { name: "Features", href: "#", hasDropdown: true, menu: "features" },
  { name: "About", href: "/about" },
  { name: "Experts", href: "/experts" },
];

export function MegaHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const pathname = usePathname();
  const headerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (menu: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(menu);
    setIsAnimating(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
      setTimeout(() => setActiveDropdown(null), 200);
    }, 100);
  };

  const handleDropdownMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full" ref={headerRef}>
      {/* Main Navigation - Black background like Oura */}
      <nav className="bg-black">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo - White version */}
          <Link href="/" className="flex items-center">
            <Image
              src="/new-assets/bnb-white.png"
              alt="Bold & Beyond"
              width={120}
              height={40}
              className="object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex lg:items-center lg:gap-x-8">
            {navigation.map((item) => (
              <div 
                key={item.name} 
                className="relative"
                onMouseEnter={() => item.hasDropdown && handleMouseEnter(item.menu!)}
                onMouseLeave={handleMouseLeave}
              >
                {item.hasDropdown ? (
                  <button
                    className={cn(
                      "flex items-center gap-1 text-sm font-medium transition-colors py-6",
                      activeDropdown === item.menu 
                        ? "text-white" 
                        : "text-white/80 hover:text-white"
                    )}
                  >
                    {item.name}
                    <ChevronDown className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      activeDropdown === item.menu && "rotate-180"
                    )} />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "text-sm font-medium transition-colors py-6 block",
                      pathname === item.href 
                        ? "text-white" 
                        : "text-white/80 hover:text-white"
                    )}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Button 
              size="sm" 
              className="bg-white text-black hover:bg-white/90 gap-2 rounded-full px-5"
              asChild
            >
              <Link href="/download">
                <Apple className="h-4 w-4" />
                <span>App Store</span>
              </Link>
            </Button>
            <Button 
              size="sm" 
              className="bg-palette-sea text-white hover:bg-palette-sea-dark gap-2 rounded-full px-5"
              asChild
            >
              <Link href="/download">
                <Play className="h-4 w-4 fill-current" />
                <span>Google Play</span>
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden inline-flex items-center justify-center rounded-md p-2.5 text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {/* Oura-style Mega Menu Dropdown - Full width with curved bottom */}
      <div 
        className={cn(
          "absolute left-0 right-0 bg-[#f5f1eb] overflow-hidden transition-all duration-300 ease-out",
          activeDropdown && isAnimating
            ? "max-h-[400px] opacity-100" 
            : "max-h-0 opacity-0"
        )}
        style={{
          borderBottomLeftRadius: "2rem",
          borderBottomRightRadius: "2rem",
        }}
        onMouseEnter={handleDropdownMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="container py-8">
          {/* Pillars Menu */}
          {activeDropdown === "pillars" && (
            <div className="flex gap-8">
              {/* Pillar Cards - Oura style */}
              <div className="flex gap-4 flex-1">
                {pillarsMenu.items.map((pillar) => (
                  <Link
                    key={pillar.name}
                    href={pillar.href}
                    onClick={() => setActiveDropdown(null)}
                    className={cn(
                      "flex-1 rounded-2xl p-6 transition-all duration-200 hover:shadow-lg group",
                      pillar.bgColor
                    )}
                  >
                    <div className="flex flex-col h-full">
                      <div className={cn("p-3 rounded-xl bg-white/80 w-fit mb-4", pillar.color)}>
                        <pillar.icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">{pillar.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">{pillar.description}</p>
                      <div className="mt-auto flex items-center gap-2 text-gray-600 group-hover:text-gray-900 transition-colors">
                        <ArrowRight className="h-5 w-5 p-1 rounded-full bg-white" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Side Links */}
              <div className="w-48 space-y-4 pt-4">
                <Link 
                  href="/human-os" 
                  onClick={() => setActiveDropdown(null)}
                  className="flex items-center gap-3 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <ArrowRight className="h-5 w-5 p-1 rounded-full bg-palette-sea text-white" />
                  <span className="text-sm font-medium">Why 4 Pillars</span>
                </Link>
                <Link 
                  href="/download" 
                  onClick={() => setActiveDropdown(null)}
                  className="flex items-center gap-3 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <ArrowRight className="h-5 w-5 p-1 rounded-full bg-palette-sea text-white" />
                  <span className="text-sm font-medium">Get Started</span>
                </Link>
              </div>
            </div>
          )}

          {/* Features Menu */}
          {activeDropdown === "features" && (
            <div className="flex gap-8">
              {/* Feature Cards */}
              <div className="grid grid-cols-3 gap-4 flex-1">
                {featuresMenu.items.map((feature, index) => (
                  <Link
                    key={feature.name}
                    href={feature.href}
                    onClick={() => setActiveDropdown(null)}
                    className="rounded-2xl bg-white p-5 transition-all duration-200 hover:shadow-lg group"
                  >
                    <h3 className="font-semibold text-gray-900 text-sm mb-2">{feature.name}</h3>
                    <p className="text-xs text-gray-500 mb-3">{feature.description}</p>
                    <ArrowRight className="h-5 w-5 p-1 rounded-full bg-gray-100 text-gray-600 group-hover:bg-palette-sea group-hover:text-white transition-colors" />
                  </Link>
                ))}
              </div>

              {/* Side Links */}
              <div className="w-48 space-y-4 pt-4">
                <Link 
                  href="/features" 
                  onClick={() => setActiveDropdown(null)}
                  className="flex items-center gap-3 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <ArrowRight className="h-5 w-5 p-1 rounded-full bg-palette-sea text-white" />
                  <span className="text-sm font-medium">All Features</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-black border-t border-white/10">
          <div className="space-y-1 px-4 py-4">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.hasDropdown ? (
                  <div>
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === item.menu ? null : item.menu!)}
                      className="flex items-center justify-between w-full rounded-lg px-3 py-3 text-base font-medium text-white/80"
                    >
                      {item.name}
                      <ChevronDown className={cn(
                        "h-4 w-4 transition-transform",
                        activeDropdown === item.menu && "rotate-180"
                      )} />
                    </button>
                    {activeDropdown === item.menu && item.menu === "pillars" && (
                      <div className="pl-4 space-y-1 mt-1 mb-2">
                        {pillarsMenu.items.map((pillar) => (
                          <Link
                            key={pillar.name}
                            href={pillar.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-sm text-white/70 hover:text-white"
                          >
                            <pillar.icon className={cn("h-4 w-4", pillar.color)} />
                            {pillar.name}
                          </Link>
                        ))}
                      </div>
                    )}
                    {activeDropdown === item.menu && item.menu === "features" && (
                      <div className="pl-4 space-y-1 mt-1 mb-2">
                        {featuresMenu.items.map((feature) => (
                          <Link
                            key={feature.name}
                            href={feature.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-3 py-2 text-sm text-white/70 hover:text-white"
                          >
                            {feature.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "block rounded-lg px-3 py-3 text-base font-medium transition-colors",
                      pathname === item.href
                        ? "text-white"
                        : "text-white/80 hover:text-white"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}

            {/* Mobile Download Buttons */}
            <div className="flex gap-2 pt-4 border-t border-white/10 mt-4">
              <Button size="sm" className="flex-1 bg-white text-black gap-2 rounded-full" asChild>
                <Link href="/download" onClick={() => setMobileMenuOpen(false)}>
                  <Apple className="h-4 w-4" />
                  App Store
                </Link>
              </Button>
              <Button size="sm" className="flex-1 bg-palette-sea text-white gap-2 rounded-full" asChild>
                <Link href="/download" onClick={() => setMobileMenuOpen(false)}>
                  <Play className="h-4 w-4 fill-current" />
                  Google Play
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default MegaHeader;
