"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  size?: "sm" | "md" | "lg";
  showLogo?: boolean;
}

export function LoadingSpinner({ 
  fullScreen = false, 
  size = "md",
  showLogo = true 
}: LoadingSpinnerProps) {
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev + 1) % 4);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  const spinnerSize = {
    sm: 32,
    md: 48,
    lg: 64,
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#0D4F4F] to-[#0A3D3D]">
        {/* Animated Logo */}
        <div className="relative mb-8">
          <div className="absolute inset-0 animate-ping opacity-20">
            <div className="h-24 w-24 rounded-full bg-[#7DD3D3]" />
          </div>
          <div className="relative animate-pulse">
            {showLogo ? (
              <Image
                src="/images/bold-beyond-logo.png"
                alt="Bold & Beyond"
                width={80}
                height={80}
                className="h-20 w-20 object-contain"
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#7DD3D3] to-[#0D9488] flex items-center justify-center">
                <span className="text-white text-2xl font-bold">B</span>
              </div>
            )}
          </div>
        </div>

        {/* Spinning circles */}
        <div className="relative h-16 w-16 mb-6">
          <div className="absolute inset-0 animate-spin">
            <svg viewBox="0 0 64 64" className="h-full w-full">
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="#7DD3D3"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="120 200"
                className="opacity-30"
              />
            </svg>
          </div>
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: "1.5s", animationDirection: "reverse" }}>
            <svg viewBox="0 0 64 64" className="h-full w-full">
              <circle
                cx="32"
                cy="32"
                r="20"
                fill="none"
                stroke="#D4AF37"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="80 150"
              />
            </svg>
          </div>
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: "2s" }}>
            <svg viewBox="0 0 64 64" className="h-full w-full">
              <circle
                cx="32"
                cy="32"
                r="12"
                fill="none"
                stroke="#F5E6D3"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="40 80"
                className="opacity-60"
              />
            </svg>
          </div>
        </div>

        {/* Loading text */}
        <p className="text-[#7DD3D3] text-lg font-medium">
          Loading{".".repeat(dots)}
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      <div className={`relative ${sizeClasses[size]}`}>
        <div className="absolute inset-0 animate-spin">
          <svg viewBox="0 0 64 64" className="h-full w-full">
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="#7DD3D3"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="120 200"
            />
          </svg>
        </div>
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: "1.5s", animationDirection: "reverse" }}>
          <svg viewBox="0 0 64 64" className="h-full w-full">
            <circle
              cx="32"
              cy="32"
              r="18"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="60 100"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function PageLoader() {
  return <LoadingSpinner fullScreen showLogo />;
}

export function ContentLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <LoadingSpinner size="lg" showLogo={false} />
      <p className="mt-4 text-gray-500 text-sm">Loading content...</p>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 rounded-2xl h-32 w-full mb-3" />
      <div className="bg-gray-200 rounded h-4 w-3/4 mb-2" />
      <div className="bg-gray-200 rounded h-3 w-1/2" />
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse flex items-center gap-4">
          <div className="bg-gray-200 rounded-full h-12 w-12" />
          <div className="flex-1">
            <div className="bg-gray-200 rounded h-4 w-3/4 mb-2" />
            <div className="bg-gray-200 rounded h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
