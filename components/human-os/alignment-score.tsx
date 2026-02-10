"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HelpCircle, TrendingUp, TrendingDown, Minus, AlertCircle } from "lucide-react";

interface AlignmentDimension {
  id: string;
  label: string;
  value: number;
  description: string;
}

interface AlignmentScoreProps {
  dimensions: AlignmentDimension[];
  overallScore: number;
  previousScore?: number;
  nervousSystemStatus?: "regulated" | "elevated" | "dysregulated";
  burnoutRisk?: "low" | "moderate" | "high";
  onHelpClick?: () => void;
}

// Default dimensions: Mind, Emotion, Behavior, Energy
const defaultDimensions: AlignmentDimension[] = [
  { id: "mind", label: "Mind", value: 70, description: "Mental clarity and focus" },
  { id: "emotion", label: "Emotion", value: 65, description: "Emotional regulation" },
  { id: "behavior", label: "Behavior", value: 75, description: "Actions aligned with values" },
  { id: "energy", label: "Energy", value: 60, description: "Vitality and stamina" },
];

export function AlignmentScore({
  dimensions = defaultDimensions,
  overallScore,
  previousScore,
  nervousSystemStatus = "regulated",
  burnoutRisk = "low",
  onHelpClick,
}: AlignmentScoreProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  // Animate score on mount
  useEffect(() => {
    const duration = 1200;
    const steps = 60;
    const increment = overallScore / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= overallScore) {
        setAnimatedScore(overallScore);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [overallScore]);

  const trend = previousScore ? overallScore - previousScore : 0;

  // Dynamic background based on state
  const getBackgroundGradient = () => {
    if (nervousSystemStatus === "dysregulated") {
      return "from-[#C17767] to-[#A65D4D]"; // Warm coral - needs attention
    }
    if (nervousSystemStatus === "elevated") {
      return "from-[#E8A87C] to-[#D4956A]"; // Orange - elevated
    }
    return "from-[#5BB5B0] to-[#4A9A96]"; // Sea teal - regulated
  };

  const getStatusLabel = () => {
    if (nervousSystemStatus === "dysregulated") return "Needs Attention";
    if (nervousSystemStatus === "elevated") return "Elevated";
    return "Aligned";
  };

  // Radar chart calculations
  const centerX = 100;
  const centerY = 100;
  const maxRadius = 70;

  const getPointPosition = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / dimensions.length - Math.PI / 2;
    const radius = (value / 100) * maxRadius;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  };

  const radarPoints = dimensions.map((dim, i) => getPointPosition(i, dim.value));
  const radarPath = radarPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  // Grid circles
  const gridLevels = [25, 50, 75, 100];

  return (
    <div className={`relative bg-gradient-to-br ${getBackgroundGradient()} rounded-3xl overflow-hidden`}>
      {/* Subtle pattern */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: "url('/assets/b&b-pattern.svg')",
          backgroundSize: "80px",
        }}
      />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-4">
        <div>
          <h3 className="text-white font-semibold">Alignment Score™</h3>
          <p className="text-white/60 text-xs">Your internal state</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/70 text-xs bg-white/20 px-2 py-0.5 rounded-full">
            {getStatusLabel()}
          </span>
          {onHelpClick && (
            <button
              onClick={onHelpClick}
              className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center"
            >
              <HelpCircle className="h-4 w-4 text-white" />
            </button>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-6 p-4 pt-0">
        {/* Radar Chart */}
        <div className="relative">
          <svg width="200" height="200" viewBox="0 0 200 200">
            {/* Grid circles */}
            {gridLevels.map((level) => (
              <circle
                key={level}
                cx={centerX}
                cy={centerY}
                r={(level / 100) * maxRadius}
                fill="none"
                stroke="white"
                strokeOpacity={0.15}
                strokeWidth={1}
              />
            ))}

            {/* Axis lines */}
            {dimensions.map((_, i) => {
              const point = getPointPosition(i, 100);
              return (
                <line
                  key={i}
                  x1={centerX}
                  y1={centerY}
                  x2={point.x}
                  y2={point.y}
                  stroke="white"
                  strokeOpacity={0.2}
                  strokeWidth={1}
                />
              );
            })}

            {/* Filled radar area */}
            <motion.path
              d={radarPath}
              fill="white"
              fillOpacity={0.2}
              stroke="white"
              strokeWidth={2}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />

            {/* Data points */}
            {radarPoints.map((point, i) => (
              <motion.circle
                key={i}
                cx={point.x}
                cy={point.y}
                r={4}
                fill="white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
              />
            ))}

            {/* Labels */}
            {dimensions.map((dim, i) => {
              const labelPoint = getPointPosition(i, 120);
              return (
                <text
                  key={dim.id}
                  x={labelPoint.x}
                  y={labelPoint.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize={11}
                  fontWeight={500}
                >
                  {dim.label}
                </text>
              );
            })}
          </svg>

          {/* Center score */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className="text-4xl font-bold text-white">{animatedScore}</span>
            </div>
          </div>
        </div>

        {/* Side info */}
        <div className="flex flex-col gap-3 text-white">
          {/* Trend */}
          {previousScore !== undefined && (
            <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
              {trend > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-300" />
              ) : trend < 0 ? (
                <TrendingDown className="h-4 w-4 text-red-300" />
              ) : (
                <Minus className="h-4 w-4 text-white/50" />
              )}
              <span className={trend > 0 ? "text-green-300" : trend < 0 ? "text-red-300" : "text-white/50"}>
                {trend > 0 ? "+" : ""}{trend}% vs last week
              </span>
            </div>
          )}

          {/* Nervous System Status */}
          <div className="bg-white/10 rounded-xl px-3 py-2">
            <p className="text-xs text-white/60">Nervous System</p>
            <p className="font-medium capitalize">{nervousSystemStatus}</p>
          </div>

          {/* Burnout Risk */}
          <div className={`rounded-xl px-3 py-2 ${
            burnoutRisk === "high" ? "bg-red-500/20" : 
            burnoutRisk === "moderate" ? "bg-orange-500/20" : "bg-white/10"
          }`}>
            <p className="text-xs text-white/60">Burnout Risk</p>
            <div className="flex items-center gap-1">
              {burnoutRisk === "high" && <AlertCircle className="h-4 w-4 text-red-300" />}
              <p className="font-medium capitalize">{burnoutRisk}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dimension breakdown */}
      <div className="relative z-10 px-4 pb-4">
        <div className="grid grid-cols-2 gap-2">
          {dimensions.map((dim) => (
            <div key={dim.id} className="bg-white/10 rounded-xl p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-white/70">{dim.label}</span>
                <span className="text-sm font-bold text-white">{dim.value}%</span>
              </div>
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${dim.value}%` }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export { defaultDimensions };
export type { AlignmentDimension };
