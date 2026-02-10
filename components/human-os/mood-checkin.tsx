"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mood options with colors inspired by Freud app
const moodOptions = [
  { 
    id: "great", 
    label: "I'm Feeling Great", 
    emoji: "😄", 
    score: 100, 
    bgColor: "from-[#5BB5B0] to-[#4A9A96]", // Sea
    faceColor: "#E8D5C4" // Sand
  },
  { 
    id: "happy", 
    label: "I'm Feeling Happy", 
    emoji: "🙂", 
    score: 80, 
    bgColor: "from-[#6B9BC3] to-[#5A8AB2]", // Sky
    faceColor: "#F5E6D3"
  },
  { 
    id: "neutral", 
    label: "I'm Feeling Neutral", 
    emoji: "😐", 
    score: 60, 
    bgColor: "from-[#8B7355] to-[#6B5344]", // Brown/Earth
    faceColor: "#D4C4B3"
  },
  { 
    id: "low", 
    label: "I'm Feeling Low", 
    emoji: "😔", 
    score: 40, 
    bgColor: "from-[#E8A87C] to-[#D4956A]", // Warm orange
    faceColor: "#F5DEB3"
  },
  { 
    id: "sad", 
    label: "I'm Feeling Sad", 
    emoji: "😢", 
    score: 20, 
    bgColor: "from-[#C17767] to-[#A65D4D]", // Muted coral
    faceColor: "#E8C4B8"
  },
];

interface MoodCheckinProps {
  onComplete: (mood: typeof moodOptions[0]) => void;
  onClose: () => void;
  userName?: string;
}

export function MoodCheckin({ onComplete, onClose, userName = "there" }: MoodCheckinProps) {
  const [selectedMood, setSelectedMood] = useState<typeof moodOptions[0] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(2); // Start at neutral

  const handleMoodChange = (direction: number) => {
    const newIndex = Math.max(0, Math.min(moodOptions.length - 1, currentIndex + direction));
    setCurrentIndex(newIndex);
    setSelectedMood(moodOptions[newIndex]);
  };

  const currentMood = moodOptions[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 z-50 bg-gradient-to-b ${currentMood.bgColor} flex flex-col`}
      >
        {/* Close button */}
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={onClose}
            className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8">
          {/* Greeting */}
          <motion.p 
            key={`greeting-${currentIndex}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white/80 text-sm mb-2"
          >
            👋 Hey {userName}!
          </motion.p>
          
          {/* Question */}
          <h1 className="text-3xl font-bold text-white text-center mb-12">
            How are you feeling<br />this day?
          </h1>

          {/* Emoji Face */}
          <motion.div 
            key={`face-${currentIndex}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative mb-6"
          >
            <div 
              className="h-40 w-40 rounded-full flex items-center justify-center shadow-2xl"
              style={{ backgroundColor: currentMood.faceColor }}
            >
              <span className="text-7xl">{currentMood.emoji}</span>
            </div>
          </motion.div>

          {/* Mood Label */}
          <motion.p
            key={`label-${currentIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-semibold text-white mb-8"
          >
            {currentMood.label}
          </motion.p>

          {/* Mood Slider */}
          <div className="w-full max-w-xs mb-12">
            <div className="relative flex items-center justify-between">
              {/* Track */}
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-0.5 bg-white/30 rounded-full">
                  <motion.div 
                    className="h-full bg-white rounded-full"
                    initial={false}
                    animate={{ width: `${(currentIndex / (moodOptions.length - 1)) * 100}%` }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                </div>
              </div>
              
              {/* Dots */}
              {moodOptions.map((mood, index) => (
                <button
                  key={mood.id}
                  onClick={() => {
                    setCurrentIndex(index);
                    setSelectedMood(mood);
                  }}
                  className={`relative z-10 h-4 w-4 rounded-full border-2 transition-all ${
                    index === currentIndex 
                      ? "bg-white border-white scale-150" 
                      : "bg-transparent border-white/50 hover:border-white"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Set Mood Button */}
        <div className="px-6 pb-8">
          <Button
            onClick={() => onComplete(currentMood)}
            className="w-full py-6 bg-white text-gray-900 hover:bg-white/90 rounded-full text-lg font-semibold shadow-lg"
          >
            Set Mood <Check className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export { moodOptions };
