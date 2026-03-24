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
      description: "Thought patterns, belief systems & cognitive reframing",
      icon: Brain,
      href: "/pillars/mind",
      color: "text-palette-sky",
    },
    {
      name: "Emotion",
      description: "Emotional states, triggers & body awareness",
      icon: Heart,
      href: "/pillars/emotion",
      color: "text-rose-500",
    },
    {
      name: "Energy",
      description: "Nervous system, stress vs flow & recovery",
      icon: Zap,
      href: "/pillars/energy",
      color: "text-amber-500",
    },
    {
      name: "Purpose",
      description: "Life alignment, meaning & identity evolution",
      icon: Target,
      href: "/pillars/purpose",
      color: "text-palette-sea",
    },
  ],
};

const featuresMenu = {
  title: "Features",
  items: [
    { name: "Emotional Pattern Mapping", href: "/features/emotional-mapping" },
    { name: "Thought Reframe Engine", href: "/features/thought-reframe" },
    { name: "Nervous System Tracker", href: "/features/nervous-system" },
    { name: "Alignment Actions", href: "/features/alignment-actions" },
    { name: "Identity Shift Engine", href: "/features/identity-shift" },
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
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top announcement bar */}
      <div className="bg-brand-navy text-white text-center py-2 text-sm">
        <span className="opacity-80">The Human Alignment System™</span>
        <span className="mx-2">—</span>
        <span className="font-medium">Transform from inside → out</span>
      </div>

      <nav className="bg-white/95 backdrop-blur-xl border-b border-gray-100">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/new-assets/bnb-orang.png"
              alt="Bold & Beyond"
              width={100}
              height={40}
              className="object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-x-8" ref={dropdownRef}>
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                {item.hasDropdown ? (
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === item.menu ? null : item.menu!)}
                    className={cn(
                      "flex items-center gap-1 text-sm font-medium transition-colors hover:text-brand-navy",
                      activeDropdown === item.menu ? "text-brand-navy" : "text-gray-600"
                    )}
                  >
                    {item.name}
                    <ChevronDown className={cn(
                      "h-4 w-4 transition-transform",
                      activeDropdown === item.menu && "rotate-180"
                    )} />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-brand-navy",
                      pathname === item.href ? "text-brand-navy" : "text-gray-600"
                    )}
                  >
                    {item.name}
                  </Link>
                )}

                {/* Pillars Mega Menu */}
                {item.menu === "pillars" && activeDropdown === "pillars" && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[600px] bg-white rounded-2xl shadow-xl border border-gray-100 p-6 animate-fade-in">
                    <div className="flex gap-8">
                      {/* Featured card */}
                      <div className="w-48 bg-gradient-to-br from-palette-sky to-palette-sea rounded-xl p-4 text-white">
                        <p className="text-xs opacity-80 mb-2">Your Unfair Advantage</p>
                        <h4 className="font-bold mb-2">The 4 Pillars</h4>
                        <p className="text-xs opacity-90 mb-4">Track what actually matters for human alignment</p>
                        <Link href="/human-os" className="text-xs font-medium flex items-center gap-1 hover:underline">
                          Learn More <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>

                      {/* Pillar items */}
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        {pillarsMenu.items.map((pillar) => (
                          <Link
                            key={pillar.name}
                            href={pillar.href}
                            onClick={() => setActiveDropdown(null)}
                            className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                          >
                            <div className={cn("p-2 rounded-lg bg-gray-100 group-hover:bg-white transition-colors", pillar.color)}>
                              <pillar.icon className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{pillar.name}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{pillar.description}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Features Menu */}
                {item.menu === "features" && activeDropdown === "features" && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 animate-fade-in">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-3 px-2">Signature Features</p>
                    {featuresMenu.items.map((feature) => (
                      <Link
                        key={feature.name}
                        href={feature.href}
                        onClick={() => setActiveDropdown(null)}
                        className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-navy transition-colors"
                      >
                        {feature.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Button 
              size="sm" 
              className="bg-black text-white hover:bg-gray-900 gap-2 rounded-full px-4"
              asChild
            >
              <Link href="/download">
                <Apple className="h-4 w-4" />
                <span>App Store</span>
              </Link>
            </Button>
            <Button 
              size="sm" 
              className="bg-palette-sea text-white hover:bg-palette-sea-dark gap-2 rounded-full px-4"
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
            className="lg:hidden inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
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

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white">
            <div className="space-y-1 px-4 py-4">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.hasDropdown ? (
                    <div>
                      <button
                        onClick={() => setActiveDropdown(activeDropdown === item.menu ? null : item.menu!)}
                        className="flex items-center justify-between w-full rounded-lg px-3 py-2 text-base font-medium text-gray-700"
                      >
                        {item.name}
                        <ChevronDown className={cn(
                          "h-4 w-4 transition-transform",
                          activeDropdown === item.menu && "rotate-180"
                        )} />
                      </button>
                      {activeDropdown === item.menu && item.menu === "pillars" && (
                        <div className="pl-4 space-y-1 mt-1">
                          {pillarsMenu.items.map((pillar) => (
                            <Link
                              key={pillar.name}
                              href={pillar.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:text-brand-navy"
                            >
                              <pillar.icon className={cn("h-4 w-4", pillar.color)} />
                              {pillar.name}
                            </Link>
                          ))}
                        </div>
                      )}
                      {activeDropdown === item.menu && item.menu === "features" && (
                        <div className="pl-4 space-y-1 mt-1">
                          {featuresMenu.items.map((feature) => (
                            <Link
                              key={feature.name}
                              href={feature.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className="block px-3 py-2 text-sm text-gray-600 hover:text-brand-navy"
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
                        "block rounded-lg px-3 py-2 text-base font-medium transition-colors",
                        pathname === item.href
                          ? "bg-gray-100 text-brand-navy"
                          : "text-gray-700 hover:bg-gray-50"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}

              {/* Mobile Download Buttons */}
              <div className="flex gap-2 pt-4 border-t border-gray-100 mt-4">
                <Button size="sm" className="flex-1 bg-black text-white gap-2 rounded-full" asChild>
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
      </nav>
    </header>
  );
}

export default MegaHeader;
