"use client";

import { cn } from "@/lib/utils";
import { HTMLAttributes, forwardRef } from "react";

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "light" | "dark" | "colored" | "frosted";
  blur?: "sm" | "md" | "lg" | "xl" | "2xl";
  border?: boolean;
  glow?: "sea" | "sky" | "none";
  hover?: boolean;
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ 
    className, 
    variant = "light", 
    blur = "xl",
    border = true,
    glow = "none",
    hover = true,
    children,
    ...props 
  }, ref) => {
    const variantStyles = {
      light: "bg-white/70 text-gray-900",
      dark: "bg-gray-900/40 text-white",
      colored: "bg-gradient-to-br from-palette-sea/20 to-palette-sky/20 text-gray-900",
      frosted: "bg-white/20 text-white",
    };

    const blurStyles = {
      sm: "backdrop-blur-sm",
      md: "backdrop-blur-md",
      lg: "backdrop-blur-lg",
      xl: "backdrop-blur-xl",
      "2xl": "backdrop-blur-2xl",
    };

    const glowStyles = {
      sea: "shadow-glow-sea",
      sky: "shadow-glow-sky",
      none: "",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-3xl",
          variantStyles[variant],
          blurStyles[blur],
          border && "border border-white/20",
          glow !== "none" && glowStyles[glow],
          hover && "transition-all duration-300 hover:shadow-glass-lg hover:scale-[1.01]",
          "shadow-glass",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";

// Glass container for full-page backgrounds
export function GlassContainer({ 
  children, 
  className,
  gradient = "sea"
}: { 
  children: React.ReactNode; 
  className?: string;
  gradient?: "sea" | "sky" | "purple" | "warm";
}) {
  const gradients = {
    sea: "from-palette-sea/30 via-palette-sky/20 to-palette-sand/30",
    sky: "from-palette-sky/40 via-palette-sea/20 to-white",
    purple: "from-purple-600/30 via-palette-sea/20 to-palette-sky/30",
    warm: "from-palette-sand/40 via-orange-200/30 to-palette-sea/20",
  };

  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br",
      gradients[gradient],
      "relative overflow-hidden",
      className
    )}>
      {/* Decorative blurred orbs */}
      <div className="absolute top-20 -left-20 w-72 h-72 bg-palette-sea/30 rounded-full blur-3xl" />
      <div className="absolute top-1/2 -right-20 w-96 h-96 bg-palette-sky/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-palette-sand/30 rounded-full blur-3xl" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

// Glass button component
export function GlassButton({
  children,
  className,
  variant = "primary",
  ...props
}: HTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
}) {
  const variants = {
    primary: "bg-white/90 text-gray-900 hover:bg-white shadow-glass-sm",
    secondary: "bg-white/20 text-white hover:bg-white/30 border border-white/30",
    ghost: "bg-transparent text-white hover:bg-white/10",
  };

  return (
    <button
      className={cn(
        "px-6 py-3 rounded-full font-medium backdrop-blur-sm transition-all duration-300",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// Glass input component
export function GlassInput({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full px-4 py-3 rounded-2xl",
        "bg-white/50 backdrop-blur-md",
        "border border-white/30",
        "text-gray-900 placeholder:text-gray-500",
        "focus:outline-none focus:ring-2 focus:ring-palette-sea/50 focus:border-transparent",
        "transition-all duration-300",
        className
      )}
      {...props}
    />
  );
}

// Glass metric card for dashboard
export function GlassMetricCard({
  icon: Icon,
  label,
  value,
  trend,
  color = "sea",
  className,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  trend?: { value: number; direction: "up" | "down" };
  color?: "sea" | "sky" | "sand";
  className?: string;
}) {
  const colors = {
    sea: "from-palette-sea/30 to-palette-sea/10",
    sky: "from-palette-sky/30 to-palette-sky/10",
    sand: "from-palette-sand/50 to-palette-sand/20",
  };

  const iconColors = {
    sea: "text-palette-sea",
    sky: "text-palette-sky",
    sand: "text-amber-600",
  };

  return (
    <div className={cn(
      "p-4 rounded-2xl",
      "bg-gradient-to-br",
      colors[color],
      "backdrop-blur-lg",
      "border border-white/30",
      "shadow-glass-sm",
      "transition-all duration-300 hover:shadow-glass hover:scale-[1.02]",
      className
    )}>
      <div className="flex items-center gap-3">
        <div className={cn(
          "h-10 w-10 rounded-xl flex items-center justify-center",
          "bg-white/50 backdrop-blur-sm"
        )}>
          <Icon className={cn("h-5 w-5", iconColors[color])} />
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-600">{label}</p>
          <div className="flex items-center gap-2">
            <p className="text-xl font-bold text-gray-900">{value}</p>
            {trend && (
              <span className={cn(
                "text-xs font-medium",
                trend.direction === "up" ? "text-green-500" : "text-red-500"
              )}>
                {trend.direction === "up" ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Glass modal overlay
export function GlassModal({
  children,
  isOpen,
  onClose,
  className,
}: {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      
      {/* Modal content */}
      <div 
        className={cn(
          "relative z-10 w-full max-w-md",
          "bg-white/80 backdrop-blur-2xl",
          "rounded-3xl border border-white/40",
          "shadow-glass-lg",
          "p-6",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export { GlassCard };
