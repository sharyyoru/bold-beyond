"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ChevronDown, Apple, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
  { name: "Experts", href: "/experts" },
  { name: "Partners", href: "/partners" },
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-gradient-to-r from-palette-sky/95 via-palette-sea/90 to-palette-sky/95 backdrop-blur-xl supports-[backdrop-filter]:bg-palette-sky/80">
      <nav className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/new-assets/bnb-white.png"
            alt="Bold & Beyond"
            width={120}
            height={120}
            className="object-contain"
            style={{ width: 120, height: 120 }}
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-x-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-white",
                pathname === item.href
                  ? "text-white"
                  : "text-white/70"
              )}
            >
              {item.name}
            </Link>
          ))}
          
          {/* Download Buttons */}
          <div className="flex items-center gap-2 ml-4">
            <Button size="sm" variant="outline" className="bg-black text-white border-black hover:bg-gray-900 gap-1.5" asChild>
              <Link href="/download">
                <Apple className="h-4 w-4" />
                <span className="text-xs">App Store</span>
              </Link>
            </Button>
            <Button size="sm" variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20 gap-1.5" asChild>
              <Link href="/download">
                <Smartphone className="h-4 w-4" />
                <span className="text-xs">Play Store</span>
              </Link>
            </Button>
          </div>
        </div>


        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-md p-2.5 text-muted-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="sr-only">Open main menu</span>
          {mobileMenuOpen ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/20 bg-palette-sky/95 backdrop-blur-xl">
          <div className="space-y-1 px-4 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "block rounded-lg px-3 py-2 text-base font-medium transition-colors",
                  pathname === item.href
                    ? "bg-white/20 text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {/* Mobile Download Buttons */}
            <div className="flex gap-2 pt-4 border-t border-white/20 mt-4">
              <Button size="sm" className="flex-1 bg-black text-white gap-1.5" asChild>
                <Link href="/download" onClick={() => setMobileMenuOpen(false)}>
                  <Apple className="h-4 w-4" />
                  App Store
                </Link>
              </Button>
              <Button size="sm" className="flex-1 bg-white/10 text-white gap-1.5" asChild>
                <Link href="/download" onClick={() => setMobileMenuOpen(false)}>
                  <Smartphone className="h-4 w-4" />
                  Play Store
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
