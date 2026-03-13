"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function HeroAnimation() {
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    fetch("/animations/using-tablet.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error("Failed to load animation:", err));
  }, []);

  return (
    <div className="relative w-full max-w-lg aspect-square">
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
      
      {/* Floating branded cards with glassmorphism */}
      <div className="absolute -left-8 top-1/4 bg-white/90 backdrop-blur-lg rounded-xl shadow-xl p-4 animate-fade-in border border-white/50">
        <div className="flex items-center gap-3">
          <Image
            src="/assets/excellent-emoticon.svg"
            alt="Excellent"
            width={40}
            height={40}
          />
          <div>
            <p className="font-semibold text-palette-sky text-sm">Feeling Great!</p>
            <p className="text-xs text-gray-500">Wellbeing Score: 87%</p>
          </div>
        </div>
      </div>
      
      <div className="absolute -right-4 bottom-1/3 bg-white/90 backdrop-blur-lg rounded-xl shadow-xl p-4 animate-fade-in border border-white/50">
        <div className="flex items-center gap-3">
          <Image
            src="/assets/mandala-filled.svg"
            alt="AI Match"
            width={32}
            height={32}
          />
          <div>
            <p className="font-semibold text-palette-sky text-sm">AI Match Found</p>
            <p className="text-xs text-palette-sea">94.3% confidence</p>
          </div>
        </div>
      </div>
    </div>
  );
}
