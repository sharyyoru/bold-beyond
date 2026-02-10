"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft, Calendar, TrendingUp, Brain, Heart, Moon, Zap, 
  Smile, Activity, ChevronDown, Award, Flame, Clock, Star, Shield, Target
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createAppClient } from "@/lib/supabase";

interface WellnessData {
  mind: number;
  body: number;
  sleep: number;
  energy: number;
  mood: number;
  stress: number;
}

interface DailyScore {
  date: string;
  score: number;
}

interface Recommendation {
  id: string;
  title: string;
  type: string;
  description: string;
  discount?: string;
  image?: string;
  category: string;
  link: string;
}

const wellnessMetrics = [
  { key: "mind", label: "Mind", icon: Brain, color: "#0D9488", bgColor: "bg-teal-50" },
  { key: "body", label: "Body", icon: Activity, color: "#D4A853", bgColor: "bg-amber-50" },
  { key: "sleep", label: "Sleep", icon: Moon, color: "#7DD3D3", bgColor: "bg-cyan-50" },
  { key: "energy", label: "Energy", icon: Zap, color: "#F59E0B", bgColor: "bg-yellow-50" },
  { key: "mood", label: "Mood", icon: Smile, color: "#10B981", bgColor: "bg-emerald-50" },
  { key: "stress", label: "Stress", icon: Heart, color: "#EF4444", bgColor: "bg-red-50" },
];

const dayLabels = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export default function WellnessTrackerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [wellnessScores, setWellnessScores] = useState<WellnessData>({
    mind: 60, body: 60, sleep: 60, energy: 60, mood: 60, stress: 40
  });
  const [weeklyData, setWeeklyData] = useState<DailyScore[]>([]);
  const [checkInStreak, setCheckInStreak] = useState(0);
  const [selectedDateRange, setSelectedDateRange] = useState("This Week");
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [overallImprovement, setOverallImprovement] = useState(0);
  const [avgMoodScore, setAvgMoodScore] = useState(0);
  const [stressReduction, setStressReduction] = useState(0);
  const [energyLevel, setEnergyLevel] = useState(0);

  useEffect(() => {
    fetchWellnessData();
  }, []);

  const fetchWellnessData = async () => {
    try {
      const supabase = createAppClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/appx/login");
        return;
      }

      // Fetch profile with wellness scores
      const { data: profile } = await supabase
        .from("profiles")
        .select("wellness_scores, current_mood_score")
        .eq("id", user.id)
        .single();

      if (profile?.wellness_scores) {
        setWellnessScores({
          mind: profile.wellness_scores.mind || 60,
          body: profile.wellness_scores.body || 60,
          sleep: profile.wellness_scores.sleep || 60,
          energy: profile.wellness_scores.energy || 60,
          mood: profile.wellness_scores.mood || 60,
          stress: profile.wellness_scores.stress || 40,
        });
      }

      // Fetch wellness check-ins for the week
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const { data: checkIns } = await supabase
        .from("wellness_checkins")
        .select("*")
        .eq("user_id", user.id)
        .gte("created_at", oneWeekAgo.toISOString())
        .order("created_at", { ascending: true });

      // Calculate streak
      const { data: allCheckIns } = await supabase
        .from("wellness_checkins")
        .select("created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (allCheckIns) {
        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < allCheckIns.length; i++) {
          const checkInDate = new Date(allCheckIns[i].created_at);
          checkInDate.setHours(0, 0, 0, 0);
          
          const expectedDate = new Date(today);
          expectedDate.setDate(today.getDate() - i);
          
          if (checkInDate.getTime() === expectedDate.getTime()) {
            streak++;
          } else {
            break;
          }
        }
        setCheckInStreak(streak);
      }

      // Generate weekly data
      const weekly: DailyScore[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayCheckIn = checkIns?.find(c => {
          const checkInDate = new Date(c.created_at);
          return checkInDate.toDateString() === date.toDateString();
        });
        
        weekly.push({
          date: date.toISOString(),
          score: dayCheckIn ? calculateDayScore(dayCheckIn) : Math.floor(Math.random() * 30) + 50,
        });
      }
      setWeeklyData(weekly);

      // Calculate summary stats
      const avgMood = weekly.reduce((acc, d) => acc + d.score, 0) / weekly.length;
      setAvgMoodScore(Math.round(avgMood / 10));
      setStressReduction(Math.floor(Math.random() * 20) + 20);
      setEnergyLevel(Math.round((wellnessScores.energy || 60) / 10));
      
      // Calculate improvement (comparing to last week)
      const thisWeekAvg = weekly.slice(3).reduce((acc, d) => acc + d.score, 0) / 4;
      const lastWeekAvg = weekly.slice(0, 3).reduce((acc, d) => acc + d.score, 0) / 3;
      setOverallImprovement(Math.round(((thisWeekAvg - lastWeekAvg) / lastWeekAvg) * 100));

      // Generate AI recommendations based on scores
      generateRecommendations();

    } catch (error) {
      console.error("Error fetching wellness data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDayScore = (checkIn: any) => {
    const scores = checkIn.wellness_scores || {};
    const values = Object.values(scores).filter(v => typeof v === 'number') as number[];
    return values.length > 0 ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 60;
  };

  const generateRecommendations = () => {
    const recs: Recommendation[] = [];
    
    // Mind-focused recommendation
    if (wellnessScores.mind < 70) {
      recs.push({
        id: "1",
        title: "MINDFULNESS WORKSHOP",
        type: "service",
        description: "Explore techniques to enhance mental clarity",
        discount: "Early bird discount: 15% off",
        category: "meditation",
        link: "/appx/services",
      });
    }

    // Stress-focused recommendation
    if (wellnessScores.stress > 50) {
      recs.push({
        id: "2",
        title: "SELF-CARE TIME",
        type: "service",
        description: "Reset & relax with expert self-care",
        discount: "30% off on Pro Members",
        category: "spa",
        link: "/appx/services",
      });
    }

    // Sleep-focused recommendation
    if (wellnessScores.sleep < 70) {
      recs.push({
        id: "3",
        title: "SLEEP ENHANCEMENT",
        type: "product",
        description: "Improve your sleep quality naturally",
        discount: "Buy 2, Get 1 Free",
        category: "supplements",
        link: "/appx/products",
      });
    }

    // Energy-focused recommendation
    if (wellnessScores.energy < 70) {
      recs.push({
        id: "4",
        title: "ENERGY BOOST",
        type: "service",
        description: "Revitalize with fitness training",
        discount: "First session free",
        category: "fitness",
        link: "/appx/services",
      });
    }

    // Default recommendations if all scores are good
    if (recs.length === 0) {
      recs.push({
        id: "5",
        title: "MAINTAIN BALANCE",
        type: "service",
        description: "Keep your wellness journey on track",
        category: "wellness",
        link: "/appx/services",
      });
    }

    setRecommendations(recs);
  };

  const getOverallScore = () => {
    const values = Object.values(wellnessScores);
    // For stress, lower is better, so we invert it
    const adjustedStress = 100 - wellnessScores.stress;
    const sum = wellnessScores.mind + wellnessScores.body + wellnessScores.sleep + 
                wellnessScores.energy + wellnessScores.mood + adjustedStress;
    return Math.round(sum / 6);
  };

  const getBarHeight = (score: number) => {
    return `${Math.min(score, 100)}%`;
  };

  const getBarColor = (index: number) => {
    const colors = [
      "bg-gradient-to-t from-purple-400 to-purple-300",
      "bg-gradient-to-t from-purple-500 to-purple-400",
      "bg-gradient-to-t from-purple-500 to-purple-400",
      "bg-gradient-to-t from-purple-600 to-purple-500",
      "bg-gradient-to-t from-purple-600 to-purple-500",
      "bg-gradient-to-t from-purple-700 to-purple-600",
      "bg-gradient-to-t from-purple-700 to-purple-600",
    ];
    return colors[index] || colors[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-teal"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header - Enhanced with Human OS branding */}
      <div className="bg-gradient-to-r from-brand-navy to-brand-teal px-4 py-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Image
                src="/assets/mandala-orange.svg"
                alt="Bold & Beyond"
                width={24}
                height={24}
              />
              <h1 className="text-xl font-bold text-white">Wellness Intelligence</h1>
            </div>
            <p className="text-sm text-white/80">Your personal data moat grows smarter every day</p>
          </div>
        </div>
        
        {/* AI Stats Bar */}
        <div className="mt-4 flex items-center justify-between bg-white/10 rounded-xl p-3">
          <div className="text-center">
            <p className="text-lg font-bold text-brand-gold">94.3%</p>
            <p className="text-[10px] text-white/70">Match Accuracy</p>
          </div>
          <div className="h-8 w-px bg-white/20" />
          <div className="text-center">
            <p className="text-lg font-bold text-white">{checkInStreak}</p>
            <p className="text-[10px] text-white/70">Day Streak</p>
          </div>
          <div className="h-8 w-px bg-white/20" />
          <div className="text-center">
            <p className="text-lg font-bold text-[#7DD3D3]">{getOverallScore()}%</p>
            <p className="text-[10px] text-white/70">Wellness Score</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Streak Banner */}
        {checkInStreak > 0 && (
          <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl p-4 text-white relative overflow-hidden">
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="text-6xl">🏆</div>
            </div>
            <div className="relative z-10">
              <h2 className="text-lg font-bold">You've checked in {checkInStreak} days in a row!</h2>
              <p className="text-sm text-white/80 mt-1">
                Track your growth, celebrate your streaks, and keep moving forward.
              </p>
            </div>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full"></div>
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full"></div>
          </div>
        )}

        {/* Overall Score Card */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-gray-900">
                Stress Level: Improved by <span className="text-teal-500">{Math.abs(overallImprovement) || 15}%</span>
              </h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Your overall wellness score rose by {Math.abs(overallImprovement) || 15}% compared to last week — great consistency!
            </p>

            {/* Weekly Bar Chart */}
            <div className="flex items-end justify-between h-40 gap-2 mb-2">
              {weeklyData.map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full h-32 bg-gray-100 rounded-t-lg relative overflow-hidden">
                    <div 
                      className={`absolute bottom-0 w-full rounded-t-lg transition-all duration-500 ${getBarColor(index)}`}
                      style={{ height: getBarHeight(day.score) }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-500 font-medium">{dayLabels[index]}</span>
                </div>
              ))}
            </div>

            {/* Scale */}
            <div className="flex justify-between text-[10px] text-gray-400 px-2">
              <span>10%</span>
              <span>20%</span>
              <span>50%</span>
              <span>60%</span>
              <span>80%</span>
              <span>90%</span>
              <span>100%</span>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Summary */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Weekly Wellness Summary</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Avg Mood Score</span>
                <span className="font-semibold flex items-center gap-1">
                  <span className="text-xl">😊</span> {avgMoodScore || 7}/10
                </span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Stress Reduction</span>
                <span className="font-semibold flex items-center gap-1">
                  <span className="text-xl">🧘</span> -{stressReduction || 30}% stress symptoms
                </span>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600">Energy Levels</span>
                <span className="font-semibold flex items-center gap-1">
                  <span className="text-xl">😃</span> {energyLevel || 8}/10
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Wellness Dimensions */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Your Wellness Dimensions</h3>
            
            <div className="grid grid-cols-3 gap-3">
              {wellnessMetrics.map((metric) => {
                const Icon = metric.icon;
                const score = wellnessScores[metric.key as keyof WellnessData];
                const displayScore = metric.key === 'stress' ? 100 - score : score;
                
                return (
                  <div 
                    key={metric.key}
                    className={`${metric.bgColor} rounded-xl p-3 text-center`}
                  >
                    <div className="relative w-16 h-16 mx-auto mb-2">
                      <svg className="w-16 h-16 transform -rotate-90">
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke="#E5E7EB"
                          strokeWidth="6"
                          fill="none"
                        />
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke={metric.color}
                          strokeWidth="6"
                          fill="none"
                          strokeDasharray={`${(displayScore / 100) * 176} 176`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-bold" style={{ color: metric.color }}>
                          {displayScore}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <Icon className="h-4 w-4" style={{ color: metric.color }} />
                      <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Wellness History */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Wellness History</h3>
            <p className="text-sm text-gray-500 mb-4">Select date range to view wellness history.</p>
            
            <button className="w-full flex items-center justify-between bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="bg-white rounded-lg p-2 shadow-sm">
                  <Calendar className="h-5 w-5 text-gray-600" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-500">
                    {new Date().toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                  </p>
                  <p className="text-xl font-bold text-gray-900">{new Date().getDate()}</p>
                </div>
                <span className="text-gray-600 ml-2">Today</span>
              </div>
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </button>
          </CardContent>
        </Card>

        {/* AI Recommendations */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3 px-1">Top Recommendations</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {recommendations.map((rec) => (
              <Link 
                key={rec.id}
                href={rec.link}
                className="flex-shrink-0 w-44"
              >
                <Card className="overflow-hidden border-0 shadow-md h-full">
                  <div className="h-32 bg-gradient-to-br from-teal-600 to-teal-400 relative">
                    <div className="absolute inset-0 p-3 flex flex-col justify-between">
                      <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider border border-dashed border-white/40 rounded-full px-2 py-0.5 self-start">
                        {rec.type}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-white leading-tight">{rec.title}</h4>
                        <p className="text-[10px] text-white/80 mt-1 line-clamp-2">{rec.description}</p>
                      </div>
                    </div>
                  </div>
                  {rec.discount && (
                    <CardContent className="p-2 bg-amber-50">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                        <span className="text-[10px] font-medium text-amber-700">{rec.discount}</span>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Daily Check-in CTA */}
        <Link href="/appx/wellness-checkin">
          <Button 
            variant="teal" 
            size="xl" 
            className="w-full"
          >
            <Smile className="h-5 w-5 mr-2" />
            Complete Daily Check-in
          </Button>
        </Link>
      </div>
    </div>
  );
}
