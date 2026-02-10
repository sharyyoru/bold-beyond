"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Brain, Moon, Zap, Heart, Dumbbell, Coffee } from "lucide-react";
import Link from "next/link";

interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  scoreImpact: number;
  duration?: string;
  icon: "brain" | "moon" | "zap" | "heart" | "dumbbell" | "coffee";
  stressReduction?: number;
}

const iconMap = {
  brain: Brain,
  moon: Moon,
  zap: Zap,
  heart: Heart,
  dumbbell: Dumbbell,
  coffee: Coffee,
};

interface AIRecommendationsProps {
  recommendations: Recommendation[];
  userScore?: number;
  onViewAll?: () => void;
}

export function AIRecommendations({ 
  recommendations, 
  userScore = 70,
  onViewAll 
}: AIRecommendationsProps) {
  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#5BB5B0] to-[#6B9BC3] flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">AI Suggestions</h3>
          <p className="text-xs text-gray-500">Based on your data input</p>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="space-y-3">
        {recommendations.slice(0, 3).map((rec, index) => {
          const Icon = iconMap[rec.icon];
          
          return (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`/appx/services?category=${rec.category}`}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors group"
              >
                {/* Icon */}
                <div className="h-12 w-12 rounded-xl bg-[#E8D5C4] flex items-center justify-center flex-shrink-0">
                  <Icon className="h-6 w-6 text-[#8B7355]" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs text-[#5BB5B0] font-medium">
                      +{rec.scoreImpact} Score
                    </span>
                    {rec.stressReduction && (
                      <span className="text-xs text-gray-400">
                        -{rec.stressReduction} stress
                      </span>
                    )}
                  </div>
                  <p className="font-medium text-gray-900 truncate">{rec.title}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    {rec.duration && <span>⏱ {rec.duration}</span>}
                  </div>
                </div>

                {/* Arrow */}
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* View All */}
      {onViewAll && (
        <button
          onClick={onViewAll}
          className="w-full mt-4 py-3 text-center text-sm font-medium text-[#5BB5B0] hover:bg-[#5BB5B0]/5 rounded-xl transition-colors"
        >
          View All Recommendations
        </button>
      )}
    </div>
  );
}

// Generate recommendations based on wellness scores
export function generateRecommendations(scores: Record<string, number>): Recommendation[] {
  const recommendations: Recommendation[] = [];

  if (scores.stress < 60) {
    recommendations.push({
      id: "stress-1",
      title: "Quick Breathing Session",
      description: "A 5-minute guided breathing exercise",
      category: "wellness",
      scoreImpact: 3,
      duration: "5 min",
      icon: "brain",
      stressReduction: 2,
    });
  }

  if (scores.sleep < 60) {
    recommendations.push({
      id: "sleep-1",
      title: "Sleep Meditation",
      description: "Calm your mind before bed",
      category: "wellness",
      scoreImpact: 4,
      duration: "15 min",
      icon: "moon",
      stressReduction: 1,
    });
  }

  if (scores.energy < 60) {
    recommendations.push({
      id: "energy-1",
      title: "Energy Boost Workout",
      description: "Quick exercises to energize",
      category: "fitness",
      scoreImpact: 5,
      duration: "10 min",
      icon: "zap",
    });
  }

  if (scores.mood < 60) {
    recommendations.push({
      id: "mood-1",
      title: "Mindful Walk",
      description: "Connect with nature",
      category: "wellness",
      scoreImpact: 3,
      duration: "20 min",
      icon: "heart",
    });
  }

  // Default recommendations if scores are good
  if (recommendations.length === 0) {
    recommendations.push(
      {
        id: "maintain-1",
        title: "Morning Yoga Flow",
        description: "Start your day right",
        category: "fitness",
        scoreImpact: 2,
        duration: "15 min",
        icon: "dumbbell",
      },
      {
        id: "maintain-2",
        title: "Gratitude Journaling",
        description: "Reflect on positive moments",
        category: "wellness",
        scoreImpact: 2,
        duration: "5 min",
        icon: "heart",
      },
      {
        id: "maintain-3",
        title: "Hydration Reminder",
        description: "Stay hydrated throughout the day",
        category: "wellness",
        scoreImpact: 1,
        duration: "Ongoing",
        icon: "coffee",
      }
    );
  }

  return recommendations;
}
