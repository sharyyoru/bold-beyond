"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Settings,
  Bell,
  ChevronRight,
  Brain,
  Activity,
  Moon,
  Zap,
  Smile,
  TrendingUp,
  Calendar,
  Target,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GlassCard, GlassContainer } from "@/components/ui/glass-card";
import { createAppClient } from "@/lib/supabase";
import {
  MoodCheckin,
  ScoreDashboard,
  MoodHistory,
  AIRecommendations,
  MindfulnessTimer,
  AlignmentScore,
  IntelligentRouting,
  RegulationTools,
} from "@/components/human-os";
import {
  fetchUserWellnessData,
  generateSmartRecommendations,
  updateWellnessScores,
  type UserWellnessData,
  type AIRecommendation,
} from "@/lib/human-os/wellness-data";

const wellnessDimensions = [
  { id: "mind", label: "Mind", icon: Brain, color: "#5BB5B0" },
  { id: "body", label: "Body", icon: Activity, color: "#6B9BC3" },
  { id: "sleep", label: "Sleep", icon: Moon, color: "#8B7355" },
  { id: "energy", label: "Energy", icon: Zap, color: "#E8A87C" },
  { id: "mood", label: "Mood", icon: Smile, color: "#5BB5B0" },
  { id: "stress", label: "Stress", icon: TrendingUp, color: "#C17767" },
];

export default function HumanOSPage() {
  const router = useRouter();
  const [showMoodCheckin, setShowMoodCheckin] = useState(false);
  const [showMindfulness, setShowMindfulness] = useState(false);
  const [wellnessData, setWellnessData] = useState<UserWellnessData | null>(null);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [userName, setUserName] = useState("there");
  const [loading, setLoading] = useState(true);

  // Derived state from wellnessData
  const wellnessScores = wellnessData?.scores || { mind: 60, body: 60, sleep: 60, energy: 60, mood: 60, stress: 60, overall: 60 };
  const previousScore = wellnessData?.previousAlignmentScore || 60;
  const moodHistory = wellnessData?.moodHistory || [];
  const nervousSystemStatus = wellnessData?.nervousSystemStatus || "regulated";
  const burnoutRisk = wellnessData?.burnoutRisk || "low";
  const alignmentDimensions = [
    { id: "mind", label: "Mind", value: wellnessScores.mind || 60, description: "Mental clarity" },
    { id: "emotion", label: "Emotion", value: wellnessScores.mood || 60, description: "Emotional regulation" },
    { id: "behavior", label: "Behavior", value: Math.round(((wellnessScores.body || 60) + (wellnessScores.energy || 60)) / 2), description: "Aligned actions" },
    { id: "energy", label: "Energy", value: wellnessScores.energy || 60, description: "Vitality" },
  ];

  // Load all user data using the wellness-data utility
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const supabase = createAppClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Fetch user profile for name
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", user.id)
            .single();
          
          if (profile) {
            setUserName(profile.full_name?.split(" ")[0] || "there");
          }
        }
        
        // Fetch comprehensive wellness data
        const data = await fetchUserWellnessData();
        setWellnessData(data);
        
        // Generate smart recommendations based on all data
        const recs = generateSmartRecommendations(data);
        setRecommendations(recs);
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleMoodComplete = async (mood: any) => {
    setShowMoodCheckin(false);
    
    try {
      const supabase = createAppClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Update wellness scores via utility
        const newScores = await updateWellnessScores(user.id, { mood: mood.score });
        
        // Save check-in
        await supabase.from("wellness_checkins").insert({
          user_id: user.id,
          answers: { quick_mood: mood },
          scores: { mood: mood.score, overall: newScores?.overall || 60 },
          created_at: new Date().toISOString(),
        });
        
        // Refresh all data
        const data = await fetchUserWellnessData();
        setWellnessData(data);
        setRecommendations(generateSmartRecommendations(data));
      }
    } catch (error) {
      console.error("Error saving mood:", error);
    }
  };

  // Convert recommendations to format expected by AIRecommendations component
  const formattedRecommendations = recommendations.map(rec => ({
    id: rec.id,
    title: rec.title,
    description: rec.description,
    category: rec.category,
    scoreImpact: rec.scoreImpact,
    duration: rec.duration,
    icon: rec.icon,
    stressReduction: rec.stressReduction,
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5BB5B0]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-palette-sky/20 via-palette-sea/10 to-palette-sand/20 pb-24 relative overflow-hidden">
      {/* Decorative glass orbs */}
      <div className="absolute top-40 -left-20 w-72 h-72 bg-palette-sea/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-palette-sky/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-40 left-1/4 w-64 h-64 bg-palette-sand/25 rounded-full blur-3xl pointer-events-none" />
      
      {/* Mood Check-in Modal */}
      <AnimatePresence>
        {showMoodCheckin && (
          <MoodCheckin
            userName={userName}
            onComplete={handleMoodComplete}
            onClose={() => setShowMoodCheckin(false)}
          />
        )}
      </AnimatePresence>

      {/* Mindfulness Timer Modal */}
      <AnimatePresence>
        {showMindfulness && (
          <MindfulnessTimer
            isFullScreen
            onClose={() => setShowMindfulness(false)}
            onComplete={() => {
              setShowMindfulness(false);
              // Could add celebration or score update
            }}
          />
        )}
      </AnimatePresence>

      {/* Header - Glassmorphism */}
      <div className="relative z-10 bg-gradient-to-br from-[#1B365D]/90 to-[#0D9488]/90 backdrop-blur-xl px-4 pt-4 pb-6 overflow-hidden">
        {/* Glass overlay */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
        
        {/* Subtle pattern */}
        <div 
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "url('/assets/b&b-diamond-pattern.svg')",
            backgroundSize: "80px",
          }}
        />
        
        <div className="relative z-10">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => router.back()}
              className="h-10 w-10 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/25 transition-all"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </button>
            <div className="flex flex-col items-center gap-1">
              <Image
                src="/new-assets/bnb-white.png"
                alt="Human OS"
                width={80}
                height={80}
                className="object-contain"
                style={{ width: 80, height: 80 }}
              />
              <span className="text-white font-semibold text-sm">Human OS</span>
            </div>
            <button className="h-10 w-10 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/25 transition-all">
              <Settings className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Greeting */}
          <div className="text-center mb-4">
            <p className="text-white/70 text-sm">👋 Good {getTimeOfDay()}, {userName}!</p>
            <h1 className="text-2xl font-bold text-white">How are you feeling today?</h1>
          </div>

          {/* Quick mood button - Glass effect */}
          <button
            onClick={() => setShowMoodCheckin(true)}
            className="w-full bg-white/15 backdrop-blur-xl border border-white/25 rounded-2xl p-4 flex items-center justify-between hover:bg-white/25 hover:shadow-glass transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                <span className="text-2xl">😊</span>
              </div>
              <div className="text-left">
                <p className="text-white font-medium">Log your mood</p>
                <p className="text-white/70 text-sm">Quick 5-second check-in</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-white/70" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 pt-6">
        {/* Intelligent Routing - Single Action */}
        <div className="mb-6">
          <IntelligentRouting
            userState={{
              nervousSystemStatus,
              alignmentScore: wellnessScores.overall || 64,
              burnoutRisk,
              currentProgram: "Sustainable Leadership",
            }}
          />
        </div>

        {/* Alignment Score with 4-axis Radar */}
        <div className="mb-6">
          <AlignmentScore
            dimensions={alignmentDimensions}
            overallScore={wellnessScores.overall || 64}
            previousScore={previousScore}
            nervousSystemStatus={nervousSystemStatus}
            burnoutRisk={burnoutRisk}
          />
        </div>

        {/* Regulation Tools */}
        <div className="mb-6">
          <RegulationTools
            onToolSelect={(tool) => {
              console.log("Selected tool:", tool.name);
            }}
          />
        </div>

        {/* Mental Score History - Glassmorphism */}
        <GlassCard className="p-5 mb-6" variant="light" blur="xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Mental Score History</h3>
            <Link href="/appx/wellness-tracker" className="text-sm text-palette-sea font-medium">
              See All
            </Link>
          </div>
          
          {/* Score entries */}
          <div className="space-y-3">
            {[
              { date: "Today", mood: "Anxious, Stressed", score: 65, recommendation: "Try 15m Mindfulness" },
              { date: "Yesterday", mood: "Happy, Energetic", score: 82, recommendation: null },
              { date: "2 days ago", mood: "Calm, Focused", score: 78, recommendation: null },
            ].map((entry, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-white/50 backdrop-blur-sm border border-white/40 rounded-xl hover:bg-white/70 transition-all">
                <div className="flex-1">
                  <p className="text-xs text-gray-400">{entry.date}</p>
                  <p className="font-medium text-gray-700">{entry.mood}</p>
                  {entry.recommendation && (
                    <p className="text-xs text-palette-sea">{entry.recommendation}</p>
                  )}
                </div>
                <div className="h-10 w-10 rounded-full bg-palette-sea/15 backdrop-blur-sm border border-palette-sea/20 flex items-center justify-center">
                  <span className="font-bold text-palette-sea">{entry.score}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Mood History */}
        <div className="mb-6">
          <MoodHistory entries={moodHistory} />
        </div>

        {/* AI Recommendations */}
        <div className="mb-6">
          <AIRecommendations
            recommendations={formattedRecommendations}
            userScore={wellnessScores.overall || 60}
            onViewAll={() => router.push("/appx/services")}
          />
        </div>

        {/* Mindfulness Timer Card */}
        <div className="mb-6">
          <MindfulnessTimer
            defaultMinutes={10}
            onComplete={() => {
              // Update scores after meditation
            }}
          />
        </div>

        {/* Wellness Dimensions - Glassmorphism */}
        <GlassCard className="p-5 mb-6" variant="light" blur="xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Wellness Breakdown</h3>
            <Link href="/appx/wellness-tracker" className="text-sm text-palette-sea font-medium">
              Details
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {wellnessDimensions.map((dim) => {
              const score = (wellnessScores as Record<string, number>)[dim.id] || 60;
              return (
                <div 
                  key={dim.id}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ backgroundColor: `${dim.color}10` }}
                >
                  <div 
                    className="h-10 w-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${dim.color}20` }}
                  >
                    <dim.icon className="h-5 w-5" style={{ color: dim.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">{dim.label}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: dim.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${score}%` }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                        />
                      </div>
                      <span className="text-sm font-bold" style={{ color: dim.color }}>
                        {score}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Quick Actions - Glassmorphism */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => setShowMindfulness(true)}
            className="bg-gradient-to-br from-palette-sea/80 to-palette-sea backdrop-blur-lg border border-white/20 rounded-2xl p-4 text-left text-white shadow-glass-sm hover:shadow-glass hover:scale-[1.02] transition-all duration-300"
          >
            <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2">
              <Brain className="h-5 w-5" />
            </div>
            <p className="font-semibold">Start Meditation</p>
            <p className="text-sm opacity-80">5-30 minutes</p>
          </button>
          
          <Link
            href="/appx/wellness-chat"
            className="bg-gradient-to-br from-palette-sky/80 to-palette-sky backdrop-blur-lg border border-white/20 rounded-2xl p-4 text-left text-white shadow-glass-sm hover:shadow-glass hover:scale-[1.02] transition-all duration-300"
          >
            <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2">
              <Sparkles className="h-5 w-5" />
            </div>
            <p className="font-semibold">Talk to AI</p>
            <p className="text-sm opacity-80">Get support</p>
          </Link>
          
          <Link
            href="/appx/wellness-checkin"
            className="bg-gradient-to-br from-amber-600/80 to-amber-700 backdrop-blur-lg border border-white/20 rounded-2xl p-4 text-left text-white shadow-glass-sm hover:shadow-glass hover:scale-[1.02] transition-all duration-300"
          >
            <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2">
              <Target className="h-5 w-5" />
            </div>
            <p className="font-semibold">Full Check-in</p>
            <p className="text-sm opacity-80">6 questions</p>
          </Link>
          
          <Link
            href="/appx/wellness-tracker"
            className="bg-gradient-to-br from-palette-sand/90 to-palette-sand backdrop-blur-lg border border-white/30 rounded-2xl p-4 text-left text-gray-800 shadow-glass-sm hover:shadow-glass hover:scale-[1.02] transition-all duration-300"
          >
            <div className="h-10 w-10 rounded-xl bg-white/40 backdrop-blur-sm flex items-center justify-center mb-2">
              <Calendar className="h-5 w-5" />
            </div>
            <p className="font-semibold">View History</p>
            <p className="text-sm opacity-80">Track progress</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}
