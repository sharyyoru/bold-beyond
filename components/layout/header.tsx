"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
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
        <div className="hidden md:flex md:items-center md:gap-x-8">
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
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex md:items-center md:gap-x-4">
          <Button variant="ghost" className="text-white hover:text-white hover:bg-white/20" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
          <Button className="bg-palette-sand text-gray-800 hover:bg-palette-sand/90 shadow-lg" asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
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
            <div className="mt-4 space-y-2 border-t border-white/20 pt-4">
              <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/10" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button className="w-full bg-palette-sand text-gray-800 hover:bg-palette-sand/90" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
