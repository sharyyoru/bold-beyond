"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MoreHorizontal, Calendar } from "lucide-react";

interface MoodEntry {
  date: string;
  dayName: string;
  mood: "great" | "happy" | "neutral" | "low" | "sad";
  score: number;
}

const moodEmojis: Record<string, string> = {
  great: "😄",
  happy: "🙂",
  neutral: "😐",
  low: "😔",
  sad: "😢",
};

const moodColors: Record<string, string> = {
  great: "#5BB5B0",
  happy: "#6B9BC3",
  neutral: "#8B7355",
  low: "#E8A87C",
  sad: "#C17767",
};

interface MoodHistoryProps {
  entries: MoodEntry[];
  onViewAll?: () => void;
}

export function MoodHistory({ entries, onViewAll }: MoodHistoryProps) {
  const [viewMode, setViewMode] = useState<"weekly" | "monthly">("weekly");
  
  // Calculate positive/negative counts
  const positiveCount = entries.filter(e => e.score >= 60).length;
  const negativeCount = entries.filter(e => e.score < 60).length;

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Mood History</h3>
        <button className="h-8 w-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
          <MoreHorizontal className="h-5 w-5 text-gray-400" />
        </button>
      </div>

      {/* Weekly Emoji Row */}
      <div className="flex justify-between mb-6">
        {entries.slice(0, 7).map((entry, index) => (
          <motion.div
            key={entry.date}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex flex-col items-center"
          >
            <div 
              className="h-10 w-10 rounded-full flex items-center justify-center mb-1"
              style={{ backgroundColor: `${moodColors[entry.mood]}20` }}
            >
              <span className="text-xl">{moodEmojis[entry.mood]}</span>
            </div>
            <span className="text-xs text-gray-500">{entry.dayName}</span>
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-[#5BB5B0]" />
          <span className="text-sm text-gray-600">Positive</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-[#C17767]" />
          <span className="text-sm text-gray-600">Negative</span>
        </div>
        <div className="ml-auto">
          <button 
            onClick={() => setViewMode(viewMode === "weekly" ? "monthly" : "weekly")}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
          >
            <Calendar className="h-4 w-4" />
            {viewMode === "weekly" ? "Weekly" : "Monthly"}
          </button>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="flex items-end justify-between h-24 gap-1">
        {entries.slice(0, 7).map((entry, index) => {
          const isPositive = entry.score >= 60;
          const height = Math.max(20, (entry.score / 100) * 100);
          
          return (
            <motion.div
              key={entry.date}
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="flex-1 rounded-t-md"
              style={{ 
                backgroundColor: isPositive ? "#5BB5B0" : "#C17767",
                opacity: 0.8,
              }}
            />
          );
        })}
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t">
        <div className="text-center">
          <p className="text-2xl font-bold text-[#5BB5B0]">{positiveCount}</p>
          <p className="text-xs text-gray-500">Positive days</p>
        </div>
        <div className="h-8 w-px bg-gray-200" />
        <div className="text-center">
          <p className="text-2xl font-bold text-[#C17767]">{negativeCount}</p>
          <p className="text-xs text-gray-500">Challenging days</p>
        </div>
        <div className="h-8 w-px bg-gray-200" />
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-700">{entries.length}</p>
          <p className="text-xs text-gray-500">Total logged</p>
        </div>
      </div>
    </div>
  );
}

// Helper to generate mock data
export function generateMockMoodHistory(): MoodEntry[] {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const moods: Array<"great" | "happy" | "neutral" | "low" | "sad"> = ["great", "happy", "neutral", "low", "sad"];
  const scores = { great: 100, happy: 80, neutral: 60, low: 40, sad: 20 };
  
  return days.map((day, i) => {
    const mood = moods[Math.floor(Math.random() * moods.length)];
    return {
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dayName: day,
      mood,
      score: scores[mood] + Math.floor(Math.random() * 20) - 10,
    };
  });
}
