"use client";

import Image from "next/image";

export default function PageLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-palette-sky via-palette-sea to-palette-sky">
      {/* Background orbs */}
      <div className="absolute top-20 -left-32 w-96 h-96 bg-palette-sand/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 -right-32 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 flex flex-col items-center">
        {/* Sand icon logo - spinning animation */}
        <div className="relative">
          {/* Outer glow ring */}
          <div className="absolute inset-0 w-24 h-24 rounded-full bg-palette-sand/30 animate-ping" style={{ animationDuration: "1.5s" }} />
          
          {/* Logo with spin */}
          <div className="relative w-24 h-24 animate-spin" style={{ animationDuration: "3s" }}>
            <Image
              src="/new-assets/sand-icon.png"
              alt="Bold & Beyond"
              width={96}
              height={96}
              className="object-contain"
              priority
            />
          </div>
        </div>
        
        {/* Animated dots loader */}
        <div className="mt-8 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-white/80 animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-3 h-3 rounded-full bg-white/80 animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-3 h-3 rounded-full bg-white/80 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
        
        {/* Loading text */}
        <p className="mt-4 text-white/80 text-sm font-medium">
          Loading...
        </p>
      </div>
    </div>
  );
}
