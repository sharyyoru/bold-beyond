"use client";

import { ReactNode } from "react";

type BackgroundPattern = "mandala" | "diamond" | "pattern" | "outline";

interface BrandedSectionProps {
  children: ReactNode;
  pattern?: BackgroundPattern;
  opacity?: number;
  className?: string;
  patternSize?: number;
  patternPosition?: "center" | "top-right" | "bottom-left" | "full";
}

const patternPaths: Record<BackgroundPattern, string> = {
  mandala: "/assets/mandala-logo.svg",
  diamond: "/assets/b&b-diamond-pattern.svg",
  pattern: "/assets/b&b-pattern.svg",
  outline: "/assets/mandala-logo-outline.svg",
};

export function BrandedSection({
  children,
  pattern = "pattern",
  opacity = 0.4,
  className = "",
  patternSize = 200,
  patternPosition = "full",
}: BrandedSectionProps) {
  const getPositionStyles = () => {
    switch (patternPosition) {
      case "center":
        return {
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: `${patternSize}px`,
        };
      case "top-right":
        return {
          backgroundPosition: "top right",
          backgroundRepeat: "no-repeat",
          backgroundSize: `${patternSize}px`,
        };
      case "bottom-left":
        return {
          backgroundPosition: "bottom left",
          backgroundRepeat: "no-repeat",
          backgroundSize: `${patternSize}px`,
        };
      case "full":
      default:
        return {
          backgroundPosition: "center",
          backgroundRepeat: "repeat",
          backgroundSize: `${patternSize}px`,
        };
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url('${patternPaths[pattern]}')`,
          opacity,
          ...getPositionStyles(),
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function BrandedCard({
  children,
  pattern = "diamond",
  opacity = 0.1,
  className = "",
}: BrandedSectionProps) {
  return (
    <BrandedSection
      pattern={pattern}
      opacity={opacity}
      patternSize={80}
      patternPosition="full"
      className={`rounded-2xl ${className}`}
    >
      {children}
    </BrandedSection>
  );
}
