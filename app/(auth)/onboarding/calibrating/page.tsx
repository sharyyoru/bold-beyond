"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function CalibratingPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Analyzing your preferences...");

  const statusMessages = [
    "Analyzing your preferences...",
    "Personalizing your experience...",
    "Finding the best matches for you...",
    "Setting up your wellness journey...",
    "Almost ready...",
  ];

  useEffect(() => {
    // Animate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    // Change status messages
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % statusMessages.length;
      setStatusText(statusMessages[messageIndex]);
    }, 800);

    // Redirect after animation completes
    const redirectTimeout = setTimeout(() => {
      router.push("/appx");
    }, 3500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
      clearTimeout(redirectTimeout);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D4F4F] to-[#0A3D3D] flex flex-col items-center justify-center px-6">
      {/* Animated Logo Container */}
      <div className="relative mb-12">
        {/* Outer pulsing ring */}
        <div className="absolute inset-0 -m-8">
          <div className="w-40 h-40 rounded-full border-4 border-[#7DD3D3]/30 animate-ping" />
        </div>
        
        {/* Middle rotating ring */}
        <div className="absolute inset-0 -m-4">
          <div className="w-32 h-32 rounded-full border-2 border-dashed border-[#D4AF37]/50 animate-spin" style={{ animationDuration: "3s" }} />
        </div>
        
        {/* Inner rotating ring (opposite direction) */}
        <div className="absolute inset-0 -m-2">
          <div className="w-28 h-28 rounded-full border-2 border-dotted border-[#7DD3D3]/40 animate-spin" style={{ animationDuration: "2s", animationDirection: "reverse" }} />
        </div>

        {/* Logo */}
        <div className="relative w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center animate-pulse">
          <Image
            src="/images/bold-beyond-logo.png"
            alt="Bold & Beyond"
            width={64}
            height={64}
            className="object-contain"
          />
        </div>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold text-white mb-3 text-center">
        Calibrating the app
      </h1>
      <p className="text-[#7DD3D3] mb-8 text-center">
        for your preferences
      </p>

      {/* Progress Bar */}
      <div className="w-full max-w-xs mb-6">
        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#7DD3D3] to-[#D4AF37] rounded-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Status Text */}
      <p className="text-white/80 text-sm animate-pulse">
        {statusText}
      </p>

      {/* Floating particles animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-[#7DD3D3]/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Add floating animation to globals.css */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-20px) scale(1.2);
            opacity: 0.5;
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
