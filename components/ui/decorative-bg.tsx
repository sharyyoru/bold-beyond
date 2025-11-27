"use client";

export function DecorativeBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Top left pattern */}
      <svg
        className="absolute -top-10 -left-10 w-40 h-40 text-brand-cream-dark opacity-60"
        viewBox="0 0 100 100"
        fill="none"
      >
        <path
          d="M50 10 L90 50 L50 90 L10 50 Z"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d="M50 20 L80 50 L50 80 L20 50 Z"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="1" />
        <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="1" />
      </svg>

      {/* Top right pattern */}
      <svg
        className="absolute -top-10 -right-10 w-40 h-40 text-brand-cream-dark opacity-60"
        viewBox="0 0 100 100"
        fill="none"
      >
        <path
          d="M50 10 L90 50 L50 90 L10 50 Z"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d="M50 20 L80 50 L50 80 L20 50 Z"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="1" />
        <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="1" />
      </svg>

      {/* Bottom left pattern */}
      <svg
        className="absolute -bottom-10 -left-10 w-40 h-40 text-brand-cream-dark opacity-60"
        viewBox="0 0 100 100"
        fill="none"
      >
        <path
          d="M50 10 L90 50 L50 90 L10 50 Z"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d="M50 20 L80 50 L50 80 L20 50 Z"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="1" />
        <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="1" />
      </svg>

      {/* Bottom right pattern */}
      <svg
        className="absolute -bottom-10 -right-10 w-40 h-40 text-brand-cream-dark opacity-60"
        viewBox="0 0 100 100"
        fill="none"
      >
        <path
          d="M50 10 L90 50 L50 90 L10 50 Z"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d="M50 20 L80 50 L50 80 L20 50 Z"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="1" />
        <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="1" />
      </svg>

      {/* Center patterns */}
      <svg
        className="absolute top-1/4 left-10 w-24 h-24 text-brand-gold/20"
        viewBox="0 0 100 100"
        fill="none"
      >
        <path
          d="M50 10 L90 50 L50 90 L10 50 Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>

      <svg
        className="absolute top-1/3 right-10 w-20 h-20 text-brand-gold/20"
        viewBox="0 0 100 100"
        fill="none"
      >
        <path
          d="M50 10 L90 50 L50 90 L10 50 Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}

export function BrandLogo({ className = "h-16 w-16" }: { className?: string }) {
  return (
    <div className={`${className} text-brand-teal`}>
      <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
        <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="3" />
        <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="2" />
        <path
          d="M50 15 L50 85 M15 50 L85 50"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M25 25 L75 75 M75 25 L25 75"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle cx="50" cy="50" r="8" fill="currentColor" />
      </svg>
    </div>
  );
}
