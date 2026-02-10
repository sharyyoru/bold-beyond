"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { HelpCircle, Plus, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ScoreDashboardProps {
  score: number;
  previousScore?: number;
  label?: string;
  subtitle?: string;
  showTrend?: boolean;
  size?: "sm" | "md" | "lg";
  onAddEntry?: () => void;
}

export function ScoreDashboard({
  score,
  previousScore,
  label = "Human OS Score",
  subtitle = "Your wellness intelligence",
  showTrend = true,
  size = "lg",
  onAddEntry,
}: ScoreDashboardProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  // Animate score on mount
  useEffect(() => {
    const duration = 1000;
    const steps = 60;
    const increment = score / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score]);

  const getScoreColor = (s: number) => {
    if (s >= 80) return "#5BB5B0"; // Sea - great
    if (s >= 60) return "#6B9BC3"; // Sky - good
    if (s >= 40) return "#E8D5C4"; // Sand - okay
    return "#C17767"; // Muted coral - needs attention
  };

  const getScoreLabel = (s: number) => {
    if (s >= 80) return "Excellent";
    if (s >= 60) return "Good";
    if (s >= 40) return "Fair";
    return "Needs Attention";
  };

  const trend = previousScore ? score - previousScore : 0;
  const scoreColor = getScoreColor(score);
  
  const sizeConfig = {
    sm: { container: "h-24 w-24", text: "text-2xl", stroke: 6, radius: 40 },
    md: { container: "h-32 w-32", text: "text-4xl", stroke: 8, radius: 56 },
    lg: { container: "h-48 w-48", text: "text-6xl", stroke: 12, radius: 84 },
  };

  const config = sizeConfig[size];
  const circumference = 2 * Math.PI * config.radius;
  const progress = (animatedScore / 100) * circumference;

  return (
    <div className="relative bg-gradient-to-b from-[#5BB5B0] to-[#4A9A96] rounded-3xl overflow-hidden">
      {/* Background pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "url('/assets/b&b-pattern.svg')",
          backgroundSize: "100px",
        }}
      />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Image
            src="/assets/mandala-orange.svg"
            alt="Human OS"
            width={24}
            height={24}
          />
          <span className="text-white font-medium">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/70 text-sm bg-white/20 px-2 py-0.5 rounded-full">
            {getScoreLabel(score)}
          </span>
          <button className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
            <HelpCircle className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>

      {/* Score Circle */}
      <div className="relative z-10 flex flex-col items-center py-8">
        <div className="relative">
          {/* Background circle */}
          <svg className={`${config.container} -rotate-90 transform`}>
            <circle
              cx="50%"
              cy="50%"
              r={config.radius}
              fill="none"
              stroke="white"
              strokeOpacity="0.2"
              strokeWidth={config.stroke}
            />
            <motion.circle
              cx="50%"
              cy="50%"
              r={config.radius}
              fill="none"
              stroke="white"
              strokeWidth={config.stroke}
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: circumference - progress }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </svg>
          
          {/* Score text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`${config.text} font-bold text-white`}>
              {animatedScore}
            </span>
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-white/80 text-center mt-4 px-4">
          {subtitle}
        </p>

        {/* Trend indicator */}
        {showTrend && previousScore !== undefined && (
          <div className="flex items-center gap-1 mt-2 bg-white/20 rounded-full px-3 py-1">
            {trend > 0 ? (
              <>
                <TrendingUp className="h-4 w-4 text-green-300" />
                <span className="text-green-300 text-sm">+{trend}%</span>
              </>
            ) : trend < 0 ? (
              <>
                <TrendingDown className="h-4 w-4 text-red-300" />
                <span className="text-red-300 text-sm">{trend}%</span>
              </>
            ) : (
              <>
                <Minus className="h-4 w-4 text-white/70" />
                <span className="text-white/70 text-sm">No change</span>
              </>
            )}
            <span className="text-white/50 text-xs ml-1">vs last week</span>
          </div>
        )}
      </div>

      {/* Bottom curve with add button */}
      <div className="relative">
        <div className="h-16 bg-white rounded-t-[40px]" />
        {onAddEntry && (
          <button
            onClick={onAddEntry}
            className="absolute left-1/2 -translate-x-1/2 -top-6 h-12 w-12 rounded-full bg-[#8B7355] shadow-lg flex items-center justify-center hover:bg-[#7A6548] transition-colors"
          >
            <Plus className="h-6 w-6 text-white" />
          </button>
        )}
      </div>
    </div>
  );
}
