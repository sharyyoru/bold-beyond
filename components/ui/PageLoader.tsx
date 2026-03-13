"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function PageLoader() {
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    fetch("/animations/using-app.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error("Failed to load animation:", err));
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-palette-sky via-palette-sea to-palette-sky">
      {/* Background orbs */}
      <div className="absolute top-20 -left-32 w-96 h-96 bg-palette-sand/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 -right-32 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 flex flex-col items-center">
        {/* Sand icon logo on top */}
        <div className="mb-4 animate-pulse">
          <Image
            src="/new-assets/sand-icon.png"
            alt="Bold & Beyond"
            width={80}
            height={80}
            className="object-contain"
          />
        </div>
        
        {/* Lottie animation */}
        <div className="w-64 h-64">
          {animationData ? (
            <Lottie
              animationData={animationData}
              loop={true}
              autoplay={true}
              className="w-full h-full"
              rendererSettings={{
                preserveAspectRatio: "xMidYMid meet",
              }}
            />
          ) : (
            <div className="w-full h-full bg-white/10 rounded-3xl animate-pulse" />
          )}
        </div>
        
        {/* Loading text */}
        <p className="mt-4 text-white/80 text-sm font-medium animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
}
