"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Brain,
  Heart,
  Activity,
  Zap,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Clock,
  Calendar,
  MessageCircle,
  FileText,
  ChevronRight,
  Shield,
  Target,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClientProfile {
  id: string;
  name: string;
  avatar?: string;
  alignmentScore: number;
  previousScore: number;
  nervousSystemStatus: "regulated" | "elevated" | "dysregulated";
  burnoutRisk: "low" | "moderate" | "high";
  lastCheckin: Date;
  sessionCount: number;
  dimensions: {
    mind: number;
    emotion: number;
    behavior: number;
    energy: number;
  };
  topConcerns: string[];
  recentMoods: Array<{ date: string; mood: string; score: number }>;
  interventionHistory: Array<{
    date: string;
    type: string;
    effectiveness: number;
  }>;
  readinessLevel: "ready" | "preparing" | "not-ready";
  nextSessionRecommendation?: string;
}

interface CoachDiagnosticProps {
  client: ClientProfile;
  onStartSession?: () => void;
  onViewFullProfile?: () => void;
  onSendMessage?: () => void;
}

export function CoachDiagnostic({
  client,
  onStartSession,
  onViewFullProfile,
  onSendMessage,
}: CoachDiagnosticProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "history" | "insights">("overview");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "dysregulated":
      case "high":
        return "text-red-500 bg-red-50";
      case "elevated":
      case "moderate":
        return "text-orange-500 bg-orange-50";
      default:
        return "text-green-500 bg-green-50";
    }
  };

  const getReadinessColor = (level: string) => {
    switch (level) {
      case "ready":
        return "bg-green-500";
      case "preparing":
        return "bg-orange-500";
      default:
        return "bg-gray-400";
    }
  };

  const trend = client.alignmentScore - client.previousScore;

  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
      {/* Header - Client Overview */}
      <div className="bg-gradient-to-r from-[#1B365D] to-[#0D9488] p-6 relative overflow-hidden">
        {/* Subtle pattern */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "url('/assets/b&b-diamond-pattern.svg')",
            backgroundSize: "60px",
          }}
        />

        <div className="relative z-10">
          {/* Client info */}
          <div className="flex items-start gap-4 mb-4">
            <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center overflow-hidden">
              {client.avatar ? (
                <Image
                  src={client.avatar}
                  alt={client.name}
                  width={64}
                  height={64}
                  className="object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-white">
                  {client.name.charAt(0)}
                </span>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">{client.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(
                    client.nervousSystemStatus
                  )}`}
                >
                  {client.nervousSystemStatus}
                </span>
                <span className="text-white/60 text-xs">
                  {client.sessionCount} sessions
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-white">{client.alignmentScore}</p>
              <div className="flex items-center justify-end gap-1 text-sm">
                {trend > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-300" />
                ) : trend < 0 ? (
                  <TrendingDown className="h-4 w-4 text-red-300" />
                ) : null}
                <span className={trend > 0 ? "text-green-300" : trend < 0 ? "text-red-300" : "text-white/60"}>
                  {trend > 0 ? "+" : ""}{trend}%
                </span>
              </div>
            </div>
          </div>

          {/* Readiness indicator */}
          <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3">
            <div className={`h-3 w-3 rounded-full ${getReadinessColor(client.readinessLevel)}`} />
            <div className="flex-1">
              <p className="text-white text-sm font-medium">
                Session Readiness: {client.readinessLevel === "ready" ? "Ready for deep work" : 
                  client.readinessLevel === "preparing" ? "Needs grounding first" : "Not recommended today"}
              </p>
              {client.nextSessionRecommendation && (
                <p className="text-white/60 text-xs">{client.nextSessionRecommendation}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        {(["overview", "history", "insights"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "text-[#0D9488] border-b-2 border-[#0D9488]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-5">
        {activeTab === "overview" && (
          <div className="space-y-5">
            {/* 4-Axis Dimensions */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Human Profile Dimensions</h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: "mind", label: "Mind", icon: Brain, color: "#5BB5B0" },
                  { key: "emotion", label: "Emotion", icon: Heart, color: "#E8A87C" },
                  { key: "behavior", label: "Behavior", icon: Target, color: "#6B9BC3" },
                  { key: "energy", label: "Energy", icon: Zap, color: "#8B7355" },
                ].map((dim) => {
                  const value = client.dimensions[dim.key as keyof typeof client.dimensions];
                  return (
                    <div
                      key={dim.key}
                      className="p-3 rounded-xl"
                      style={{ backgroundColor: `${dim.color}10` }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <dim.icon className="h-4 w-4" style={{ color: dim.color }} />
                        <span className="text-sm font-medium text-gray-700">{dim.label}</span>
                        <span className="ml-auto font-bold" style={{ color: dim.color }}>
                          {value}%
                        </span>
                      </div>
                      <div className="h-2 bg-white rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: dim.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${value}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Risk Indicators */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Risk Indicators</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className={`p-3 rounded-xl ${getStatusColor(client.burnoutRisk)}`}>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm font-medium">Burnout Risk</span>
                  </div>
                  <p className="text-lg font-bold capitalize mt-1">{client.burnoutRisk}</p>
                </div>
                <div className={`p-3 rounded-xl ${getStatusColor(client.nervousSystemStatus)}`}>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    <span className="text-sm font-medium">Nervous System</span>
                  </div>
                  <p className="text-lg font-bold capitalize mt-1">{client.nervousSystemStatus}</p>
                </div>
              </div>
            </div>

            {/* Top Concerns */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Current Concerns</h4>
              <div className="flex flex-wrap gap-2">
                {client.topConcerns.map((concern, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {concern}
                  </span>
                ))}
              </div>
            </div>

            {/* Recent Mood Trend */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Recent Mood Trend</h4>
              <div className="flex items-end gap-1 h-16">
                {client.recentMoods.slice(-7).map((mood, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t"
                    style={{
                      height: `${mood.score}%`,
                      backgroundColor: mood.score >= 60 ? "#5BB5B0" : "#C17767",
                    }}
                    title={`${mood.date}: ${mood.mood} (${mood.score})`}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>7 days ago</span>
                <span>Today</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-700">Intervention History</h4>
            {client.interventionHistory.map((intervention, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
              >
                <div className="h-10 w-10 rounded-full bg-[#5BB5B0]/10 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-[#5BB5B0]" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{intervention.type}</p>
                  <p className="text-xs text-gray-500">{intervention.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#5BB5B0]">{intervention.effectiveness}%</p>
                  <p className="text-xs text-gray-400">Effectiveness</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "insights" && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-[#5BB5B0]/10 to-[#6B9BC3]/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-5 w-5 text-[#5BB5B0]" />
                <h4 className="font-semibold text-gray-900">AI Session Insights</h4>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#5BB5B0] mt-2 flex-shrink-0" />
                  Client shows pattern of elevated stress on Mondays - consider scheduling mid-week
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#5BB5B0] mt-2 flex-shrink-0" />
                  Breathing exercises show 78% effectiveness - continue as grounding tool
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#5BB5B0] mt-2 flex-shrink-0" />
                  Energy dimension trending down - explore sleep and recovery patterns
                </li>
              </ul>
            </div>

            <div className="bg-orange-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <h4 className="font-semibold text-gray-900">Watch Points</h4>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                  Burnout risk elevated - monitor closely over next 2 weeks
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                  Work-related concerns mentioned in 4 of last 5 check-ins
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-5 pt-0 grid grid-cols-3 gap-3">
        <Button
          onClick={onStartSession}
          className="bg-[#0D9488] hover:bg-[#0B7B71] text-white rounded-xl"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Session
        </Button>
        <Button
          onClick={onSendMessage}
          variant="outline"
          className="rounded-xl"
        >
          <FileText className="h-4 w-4 mr-2" />
          Notes
        </Button>
        <Button
          onClick={onViewFullProfile}
          variant="outline"
          className="rounded-xl"
        >
          <ChevronRight className="h-4 w-4 mr-2" />
          Full Profile
        </Button>
      </div>
    </div>
  );
}

// Mock data generator for demo
export function generateMockClientProfile(): ClientProfile {
  return {
    id: "client-1",
    name: "Sarah Johnson",
    alignmentScore: 64,
    previousScore: 58,
    nervousSystemStatus: "elevated",
    burnoutRisk: "moderate",
    lastCheckin: new Date(),
    sessionCount: 12,
    dimensions: {
      mind: 72,
      emotion: 58,
      behavior: 75,
      energy: 52,
    },
    topConcerns: ["Work stress", "Sleep quality", "Work-life balance", "Anxiety"],
    recentMoods: [
      { date: "Mon", mood: "Anxious", score: 45 },
      { date: "Tue", mood: "Stressed", score: 52 },
      { date: "Wed", mood: "Neutral", score: 60 },
      { date: "Thu", mood: "Good", score: 68 },
      { date: "Fri", mood: "Tired", score: 55 },
      { date: "Sat", mood: "Relaxed", score: 72 },
      { date: "Sun", mood: "Calm", score: 78 },
    ],
    interventionHistory: [
      { date: "Feb 8, 2026", type: "Cognitive Reframing Session", effectiveness: 82 },
      { date: "Feb 5, 2026", type: "Stress Management Workshop", effectiveness: 75 },
      { date: "Feb 1, 2026", type: "Breathing & Grounding", effectiveness: 88 },
    ],
    readinessLevel: "preparing",
    nextSessionRecommendation: "Start with 5-min grounding before deep work",
  };
}

export type { ClientProfile };
