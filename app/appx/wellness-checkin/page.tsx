"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Smile,
  Meh,
  Frown,
  Heart,
  Brain,
  Moon,
  Zap,
  Activity,
  Sun,
  Coffee,
  TrendingUp,
  Check,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createSupabaseClient } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

// Mood options with emoji and scores
const moodOptions = [
  { id: "great", label: "Great", emoji: "😄", score: 100, color: "#22C55E" },
  { id: "good", label: "Good", emoji: "🙂", score: 80, color: "#84CC16" },
  { id: "okay", label: "Okay", emoji: "😐", score: 60, color: "#EAB308" },
  { id: "low", label: "Low", emoji: "😔", score: 40, color: "#F97316" },
  { id: "struggling", label: "Struggling", emoji: "😢", score: 20, color: "#EF4444" },
];

// Wellness dimensions
const wellnessDimensions = [
  { id: "mind", label: "Mind", icon: Brain, color: "#0D9488" },
  { id: "body", label: "Body", icon: Activity, color: "#D4AF37" },
  { id: "sleep", label: "Sleep", icon: Moon, color: "#6B9BC3" },
  { id: "energy", label: "Energy", icon: Zap, color: "#F4A261" },
  { id: "mood", label: "Mood", icon: Smile, color: "#E9967A" },
  { id: "stress", label: "Stress", icon: TrendingUp, color: "#B8A4C9" },
];

// Daily questions
const dailyQuestions = [
  {
    id: "overall_mood",
    question: "How are you feeling today?",
    type: "mood",
  },
  {
    id: "sleep_quality",
    question: "How well did you sleep last night?",
    type: "scale",
    dimension: "sleep",
    options: [
      { label: "Terribly", score: 20 },
      { label: "Poorly", score: 40 },
      { label: "Okay", score: 60 },
      { label: "Well", score: 80 },
      { label: "Great", score: 100 },
    ],
  },
  {
    id: "energy_level",
    question: "What's your energy level right now?",
    type: "scale",
    dimension: "energy",
    options: [
      { label: "Exhausted", score: 20 },
      { label: "Tired", score: 40 },
      { label: "Moderate", score: 60 },
      { label: "Energized", score: 80 },
      { label: "Very High", score: 100 },
    ],
  },
  {
    id: "stress_level",
    question: "How stressed do you feel?",
    type: "scale",
    dimension: "stress",
    options: [
      { label: "Very Stressed", score: 20 },
      { label: "Stressed", score: 40 },
      { label: "Moderate", score: 60 },
      { label: "Relaxed", score: 80 },
      { label: "Very Calm", score: 100 },
    ],
  },
  {
    id: "mind_clarity",
    question: "How clear is your mind today?",
    type: "scale",
    dimension: "mind",
    options: [
      { label: "Very Foggy", score: 20 },
      { label: "Foggy", score: 40 },
      { label: "Okay", score: 60 },
      { label: "Clear", score: 80 },
      { label: "Crystal Clear", score: 100 },
    ],
  },
  {
    id: "physical_feeling",
    question: "How does your body feel?",
    type: "scale",
    dimension: "body",
    options: [
      { label: "Very Tense", score: 20 },
      { label: "Tense", score: 40 },
      { label: "Neutral", score: 60 },
      { label: "Good", score: 80 },
      { label: "Great", score: 100 },
    ],
  },
  {
    id: "concerns",
    question: "What's on your mind today?",
    type: "multiselect",
    options: [
      { label: "Work/Career", tag: "work" },
      { label: "Relationships", tag: "relationships" },
      { label: "Health", tag: "health" },
      { label: "Finances", tag: "finances" },
      { label: "Family", tag: "family" },
      { label: "Self-growth", tag: "growth" },
      { label: "Nothing specific", tag: "none" },
    ],
  },
];

export default function WellnessCheckinPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [wellnessScores, setWellnessScores] = useState<Record<string, number>>({});

  const currentQuestion = dailyQuestions[currentStep];
  const progress = ((currentStep + 1) / dailyQuestions.length) * 100;

  const handleMoodSelect = (mood: typeof moodOptions[0]) => {
    setAnswers({ ...answers, overall_mood: mood });
    // Auto-advance after selection
    setTimeout(() => handleNext(), 300);
  };

  const handleScaleSelect = (questionId: string, option: any) => {
    setAnswers({ ...answers, [questionId]: option });
    setTimeout(() => handleNext(), 300);
  };

  const handleMultiSelect = (questionId: string, option: any) => {
    const current = answers[questionId] || [];
    const isSelected = current.some((o: any) => o.tag === option.tag);
    
    if (isSelected) {
      setAnswers({
        ...answers,
        [questionId]: current.filter((o: any) => o.tag !== option.tag),
      });
    } else {
      setAnswers({
        ...answers,
        [questionId]: [...current, option],
      });
    }
  };

  const handleNext = () => {
    if (currentStep < dailyQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      calculateScores();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateScores = async () => {
    setIsSubmitting(true);

    // Calculate wellness scores from answers
    const scores: Record<string, number> = {
      mood: answers.overall_mood?.score || 60,
      sleep: answers.sleep_quality?.score || 60,
      energy: answers.energy_level?.score || 60,
      stress: answers.stress_level?.score || 60,
      mind: answers.mind_clarity?.score || 60,
      body: answers.physical_feeling?.score || 60,
    };

    // Calculate overall wellness score
    const overallScore = Math.round(
      Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length
    );
    scores.overall = overallScore;

    setWellnessScores(scores);

    // Save to Supabase
    try {
      const supabase = createSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Save check-in data
        await supabase.from("wellness_checkins").insert({
          user_id: user.id,
          answers: answers,
          scores: scores,
          concerns: answers.concerns?.map((c: any) => c.tag) || [],
          created_at: new Date().toISOString(),
        });

        // Update user's wellness scores in profile
        await supabase.from("profiles").update({
          wellness_scores: scores,
          last_checkin: new Date().toISOString(),
        }).eq("id", user.id);
      }

      setShowResults(true);
    } catch (error) {
      console.error("Error saving check-in:", error);
      setShowResults(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get service recommendations based on scores
  const getRecommendations = () => {
    const recommendations = [];
    
    if (wellnessScores.stress < 60) {
      recommendations.push({
        title: "Stress Management",
        description: "Try a meditation or breathing session",
        category: "therapy",
      });
    }
    if (wellnessScores.sleep < 60) {
      recommendations.push({
        title: "Sleep Improvement",
        description: "Consider a sleep consultation",
        category: "wellness",
      });
    }
    if (wellnessScores.energy < 60) {
      recommendations.push({
        title: "Energy Boost",
        description: "Try yoga or fitness coaching",
        category: "coaching",
      });
    }
    if (wellnessScores.mind < 60) {
      recommendations.push({
        title: "Mental Clarity",
        description: "Mindfulness session recommended",
        category: "therapy",
      });
    }

    return recommendations.length > 0 ? recommendations : [
      { title: "Keep it up!", description: "You're doing great. Explore our services.", category: "wellness" }
    ];
  };

  if (showResults) {
    const recommendations = getRecommendations();

    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0D9488] to-[#1B365D] px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Check-in Complete!</h1>
            <p className="text-white/80">Here's your wellness snapshot</p>
          </div>

          {/* Overall Score */}
          <div className="bg-white rounded-3xl p-6 mb-6 text-center">
            <p className="text-gray-500 text-sm mb-2">Overall Wellness Score</p>
            <div className="relative h-32 w-32 mx-auto mb-4">
              <svg className="h-32 w-32 -rotate-90 transform">
                <circle cx="64" cy="64" r="56" stroke="#E5E7EB" strokeWidth="12" fill="none" />
                <circle
                  cx="64" cy="64" r="56"
                  stroke="#0D9488"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={351.8}
                  strokeDashoffset={351.8 * (1 - (wellnessScores.overall || 0) / 100)}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-gray-900">
                {wellnessScores.overall}
              </span>
            </div>
            <p className="text-lg font-medium text-gray-700">
              {wellnessScores.overall >= 80 ? "You're doing great! 🌟" :
               wellnessScores.overall >= 60 ? "Good progress! Keep going 💪" :
               "Let's work on improving together 🤗"}
            </p>
          </div>

          {/* Individual Scores */}
          <div className="bg-white rounded-3xl p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Your Wellness Breakdown</h3>
            <div className="grid grid-cols-2 gap-4">
              {wellnessDimensions.map((dim) => (
                <div key={dim.id} className="flex items-center gap-3">
                  <div 
                    className="h-10 w-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${dim.color}20` }}
                  >
                    <dim.icon className="h-5 w-5" style={{ color: dim.color }} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{dim.label}</p>
                    <p className="font-bold" style={{ color: dim.color }}>
                      {wellnessScores[dim.id] || 0}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-3xl p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Recommended for You</h3>
            <div className="space-y-3">
              {recommendations.map((rec, i) => (
                <Link
                  key={i}
                  href={`/appx/services?category=${rec.category}`}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="h-10 w-10 rounded-full bg-[#0D9488]/10 flex items-center justify-center">
                    <Heart className="h-5 w-5 text-[#0D9488]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{rec.title}</p>
                    <p className="text-xs text-gray-500">{rec.description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </Link>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Link href="/appx/wellness-chat" className="flex-1">
              <Button variant="outline" className="w-full bg-white">
                Talk to AI Coach
              </Button>
            </Link>
            <Link href="/appx" className="flex-1">
              <Button className="w-full bg-white text-[#0D9488] hover:bg-white/90">
                Go to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDFBF7] to-[#E0F4F4] px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => currentStep > 0 ? handleBack() : router.back()}
          className="h-10 w-10 rounded-full bg-white shadow-sm flex items-center justify-center"
        >
          <ArrowLeft className="h-5 w-5 text-gray-700" />
        </button>
        <div className="text-center">
          <p className="text-sm text-gray-500">Daily Check-in</p>
          <p className="text-xs text-gray-400">{currentStep + 1} of {dailyQuestions.length}</p>
        </div>
        <button
          onClick={() => router.push("/appx")}
          className="text-sm text-gray-500"
        >
          Skip
        </button>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-gray-200 rounded-full mb-8 overflow-hidden">
        <div 
          className="h-full bg-[#0D9488] rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {currentQuestion.question}
        </h1>
        {currentQuestion.type === "multiselect" && (
          <p className="text-gray-500 text-sm">Select all that apply</p>
        )}
      </div>

      {/* Answer Options */}
      <div className="max-w-md mx-auto">
        {currentQuestion.type === "mood" && (
          <div className="grid grid-cols-5 gap-3">
            {moodOptions.map((mood) => (
              <button
                key={mood.id}
                onClick={() => handleMoodSelect(mood)}
                className={`flex flex-col items-center p-4 rounded-2xl transition-all ${
                  answers.overall_mood?.id === mood.id
                    ? "bg-[#0D9488] scale-105 shadow-lg"
                    : "bg-white shadow-sm hover:shadow-md"
                }`}
              >
                <span className="text-3xl mb-2">{mood.emoji}</span>
                <span className={`text-xs font-medium ${
                  answers.overall_mood?.id === mood.id ? "text-white" : "text-gray-600"
                }`}>
                  {mood.label}
                </span>
              </button>
            ))}
          </div>
        )}

        {currentQuestion.type === "scale" && currentQuestion.options && (
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleScaleSelect(currentQuestion.id, option)}
                className={`w-full p-4 rounded-2xl text-left transition-all flex items-center justify-between ${
                  answers[currentQuestion.id]?.label === option.label
                    ? "bg-[#0D9488] text-white shadow-lg"
                    : "bg-white shadow-sm hover:shadow-md"
                }`}
              >
                <span className="font-medium">{option.label}</span>
                {answers[currentQuestion.id]?.label === option.label && (
                  <Check className="h-5 w-5" />
                )}
              </button>
            ))}
          </div>
        )}

        {currentQuestion.type === "multiselect" && currentQuestion.options && (
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const optionTag = (option as { label: string; tag: string }).tag;
              const isSelected = answers[currentQuestion.id]?.some(
                (o: any) => o.tag === optionTag
              );
              return (
                <button
                  key={index}
                  onClick={() => handleMultiSelect(currentQuestion.id, option)}
                  className={`w-full p-4 rounded-2xl text-left transition-all flex items-center justify-between ${
                    isSelected
                      ? "bg-[#0D9488] text-white shadow-lg"
                      : "bg-white shadow-sm hover:shadow-md"
                  }`}
                >
                  <span className="font-medium">{option.label}</span>
                  {isSelected && <Check className="h-5 w-5" />}
                </button>
              );
            })}
            
            {/* Continue button for multiselect */}
            <Button
              onClick={handleNext}
              disabled={!answers[currentQuestion.id]?.length}
              className="w-full mt-4 bg-[#0D9488] hover:bg-[#0B7B71]"
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Loading overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 text-center">
            <div className="h-12 w-12 rounded-full border-4 border-[#0D9488] border-t-transparent animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Analyzing your wellness...</p>
          </div>
        </div>
      )}
    </div>
  );
}
