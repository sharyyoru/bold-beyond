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
import { createAppClient } from "@/lib/supabase";
import {
  MoodCheckin,
  ScoreDashboard,
  MoodHistory,
  generateMockMoodHistory,
  AIRecommendations,
  generateRecommendations,
  MindfulnessTimer,
  AlignmentScore,
  IntelligentRouting,
  RegulationTools,
} from "@/components/human-os";

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
  const [wellnessScores, setWellnessScores] = useState<Record<string, number>>({
    mind: 72,
    body: 68,
    sleep: 55,
    energy: 65,
    mood: 78,
    stress: 45,
    overall: 64,
  });
  const [previousScore, setPreviousScore] = useState(60);
  const [moodHistory, setMoodHistory] = useState(generateMockMoodHistory());
  const [userName, setUserName] = useState("there");
  const [nervousSystemStatus, setNervousSystemStatus] = useState<"regulated" | "elevated" | "dysregulated">("regulated");
  const [burnoutRisk, setBurnoutRisk] = useState<"low" | "moderate" | "high">("low");
  const [alignmentDimensions, setAlignmentDimensions] = useState([
    { id: "mind", label: "Mind", value: 72, description: "Mental clarity" },
    { id: "emotion", label: "Emotion", value: 65, description: "Emotional regulation" },
    { id: "behavior", label: "Behavior", value: 75, description: "Aligned actions" },
    { id: "energy", label: "Energy", value: 60, description: "Vitality" },
  ]);
  const [loading, setLoading] = useState(true);

  // Calculate nervous system status based on scores
  const calculateNervousSystemStatus = (scores: Record<string, number>): "regulated" | "elevated" | "dysregulated" => {
    const stressScore = scores.stress || 50;
    const moodScore = scores.mood || 50;
    const avgScore = (stressScore + moodScore) / 2;
    
    if (avgScore < 40) return "dysregulated";
    if (avgScore < 60) return "elevated";
    return "regulated";
  };

  // Calculate burnout risk based on scores
  const calculateBurnoutRisk = (scores: Record<string, number>): "low" | "moderate" | "high" => {
    const energyScore = scores.energy || 50;
    const stressScore = scores.stress || 50;
    const sleepScore = scores.sleep || 50;
    const avgScore = (energyScore + stressScore + sleepScore) / 3;
    
    if (avgScore < 40) return "high";
    if (avgScore < 60) return "moderate";
    return "low";
  };

  // Update alignment dimensions from wellness scores
  const updateAlignmentFromScores = (scores: Record<string, number>) => {
    setAlignmentDimensions([
      { id: "mind", label: "Mind", value: scores.mind || 60, description: "Mental clarity" },
      { id: "emotion", label: "Emotion", value: scores.mood || 60, description: "Emotional regulation" },
      { id: "behavior", label: "Behavior", value: Math.round(((scores.body || 60) + (scores.energy || 60)) / 2), description: "Aligned actions" },
      { id: "energy", label: "Energy", value: scores.energy || 60, description: "Vitality" },
    ]);
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const supabase = createAppClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Fetch user profile with wellness scores
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, wellness_scores, alignment_score")
            .eq("id", user.id)
            .single();
          
          if (profile) {
            setUserName(profile.full_name?.split(" ")[0] || "there");
            if (profile.wellness_scores) {
              setWellnessScores(profile.wellness_scores);
              setNervousSystemStatus(calculateNervousSystemStatus(profile.wellness_scores));
              setBurnoutRisk(calculateBurnoutRisk(profile.wellness_scores));
              updateAlignmentFromScores(profile.wellness_scores);
            }
          }

          // Fetch recent check-ins for mood history
          const { data: checkins } = await supabase
            .from("wellness_checkins")
            .select("created_at, scores, answers")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(7);

          if (checkins && checkins.length > 0) {
            const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            const moodEntries = checkins.map((checkin: any) => {
              const date = new Date(checkin.created_at);
              const score = checkin.scores?.mood || checkin.scores?.overall || 60;
              let moodType: "great" | "happy" | "neutral" | "low" | "sad" = "neutral";
              if (score >= 80) moodType = "great";
              else if (score >= 65) moodType = "happy";
              else if (score >= 50) moodType = "neutral";
              else if (score >= 35) moodType = "low";
              else moodType = "sad";
              
              return {
                date: date.toISOString().split('T')[0],
                dayName: days[date.getDay()],
                mood: moodType,
                score: score,
              };
            });
            setMoodHistory(moodEntries.reverse());
          }

          // Fetch last week's score for trend comparison
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          
          const { data: lastWeekCheckin } = await supabase
            .from("wellness_checkins")
            .select("scores")
            .eq("user_id", user.id)
            .lte("created_at", oneWeekAgo.toISOString())
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

          if (lastWeekCheckin?.scores?.overall) {
            setPreviousScore(lastWeekCheckin.scores.overall);
          }
        }
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
    
    // Update mood score and recalculate everything
    const newScores = {
      ...wellnessScores,
      mood: mood.score,
      overall: Math.round((wellnessScores.mind + wellnessScores.body + wellnessScores.sleep + wellnessScores.energy + mood.score + wellnessScores.stress) / 6),
    };
    
    setWellnessScores(newScores);
    setNervousSystemStatus(calculateNervousSystemStatus(newScores));
    setBurnoutRisk(calculateBurnoutRisk(newScores));
    updateAlignmentFromScores(newScores);
    
    // Save to database
    try {
      const supabase = createAppClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Save check-in
        await supabase.from("wellness_checkins").insert({
          user_id: user.id,
          answers: { quick_mood: mood },
          scores: { mood: mood.score, overall: newScores.overall },
          created_at: new Date().toISOString(),
        });
        
        // Update profile with new scores
        await supabase.from("profiles").update({
          wellness_scores: newScores,
          last_checkin: new Date().toISOString(),
        }).eq("id", user.id);
      }
    } catch (error) {
      console.error("Error saving mood:", error);
    }
  };

  const recommendations = generateRecommendations(wellnessScores);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5BB5B0]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-24">
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

      {/* Header */}
      <div className="bg-gradient-to-br from-[#1B365D] to-[#0D9488] px-4 pt-4 pb-6 relative overflow-hidden">
        {/* Subtle pattern */}
        <div 
          className="absolute inset-0 opacity-[0.06]"
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
              className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </button>
            <div className="flex items-center gap-2">
              <Image
                src="/assets/mandala-orange.svg"
                alt="Human OS"
                width={28}
                height={28}
              />
              <span className="text-white font-semibold">Human OS</span>
            </div>
            <button className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
              <Settings className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Greeting */}
          <div className="text-center mb-4">
            <p className="text-white/70 text-sm">👋 Good {getTimeOfDay()}, {userName}!</p>
            <h1 className="text-2xl font-bold text-white">How are you feeling today?</h1>
          </div>

          {/* Quick mood button */}
          <button
            onClick={() => setShowMoodCheckin(true)}
            className="w-full bg-white/20 backdrop-blur rounded-2xl p-4 flex items-center justify-between hover:bg-white/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-[#E8D5C4] flex items-center justify-center">
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
      <div className="px-4 -mt-2">
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

        {/* Mental Score History */}
        <div className="bg-white rounded-3xl p-5 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Mental Score History</h3>
            <Link href="/appx/wellness-tracker" className="text-sm text-[#5BB5B0]">
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
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="flex-1">
                  <p className="text-xs text-gray-400">{entry.date}</p>
                  <p className="font-medium text-gray-700">{entry.mood}</p>
                  {entry.recommendation && (
                    <p className="text-xs text-[#5BB5B0]">{entry.recommendation}</p>
                  )}
                </div>
                <div className="h-10 w-10 rounded-full bg-[#5BB5B0]/10 flex items-center justify-center">
                  <span className="font-bold text-[#5BB5B0]">{entry.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mood History */}
        <div className="mb-6">
          <MoodHistory entries={moodHistory} />
        </div>

        {/* AI Recommendations */}
        <div className="mb-6">
          <AIRecommendations
            recommendations={recommendations}
            userScore={wellnessScores.overall}
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

        {/* Wellness Dimensions */}
        <div className="bg-white rounded-3xl p-5 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Wellness Breakdown</h3>
            <Link href="/appx/wellness-tracker" className="text-sm text-[#5BB5B0]">
              Details
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {wellnessDimensions.map((dim) => {
              const score = wellnessScores[dim.id] || 60;
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
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => setShowMindfulness(true)}
            className="bg-[#5BB5B0] rounded-2xl p-4 text-left text-white"
          >
            <Brain className="h-6 w-6 mb-2" />
            <p className="font-semibold">Start Meditation</p>
            <p className="text-sm opacity-80">5-30 minutes</p>
          </button>
          
          <Link
            href="/appx/wellness-chat"
            className="bg-[#6B9BC3] rounded-2xl p-4 text-left text-white"
          >
            <Sparkles className="h-6 w-6 mb-2" />
            <p className="font-semibold">Talk to AI</p>
            <p className="text-sm opacity-80">Get support</p>
          </Link>
          
          <Link
            href="/appx/wellness-checkin"
            className="bg-[#8B7355] rounded-2xl p-4 text-left text-white"
          >
            <Target className="h-6 w-6 mb-2" />
            <p className="font-semibold">Full Check-in</p>
            <p className="text-sm opacity-80">6 questions</p>
          </Link>
          
          <Link
            href="/appx/wellness-tracker"
            className="bg-[#E8D5C4] rounded-2xl p-4 text-left text-gray-800"
          >
            <Calendar className="h-6 w-6 mb-2" />
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
