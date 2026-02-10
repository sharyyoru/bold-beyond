"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, X, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MindfulnessTimerProps {
  defaultMinutes?: number;
  onComplete?: () => void;
  onClose?: () => void;
  isFullScreen?: boolean;
}

const presetDurations = [5, 10, 15, 20, 30];

export function MindfulnessTimer({
  defaultMinutes = 10,
  onComplete,
  onClose,
  isFullScreen = false,
}: MindfulnessTimerProps) {
  const [duration, setDuration] = useState(defaultMinutes * 60);
  const [timeLeft, setTimeLeft] = useState(defaultMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = ((duration - timeLeft) / duration) * 100;

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(duration);
  };

  const handleDurationChange = (mins: number) => {
    setDuration(mins * 60);
    setTimeLeft(mins * 60);
    setIsRunning(false);
  };

  const containerClass = isFullScreen
    ? "fixed inset-0 z-50 bg-gradient-to-b from-[#5BB5B0] to-[#4A9A96]"
    : "bg-white rounded-3xl p-5 shadow-sm";

  return (
    <div className={containerClass}>
      {/* Close button for fullscreen */}
      {isFullScreen && onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/20 flex items-center justify-center z-10"
        >
          <X className="h-5 w-5 text-white" />
        </button>
      )}

      <div className={`flex flex-col items-center ${isFullScreen ? "h-full justify-center" : ""}`}>
        {/* Header */}
        {!isFullScreen && (
          <div className="w-full flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Mindfulness Minute</h3>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="h-8 w-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4 text-gray-400" />
              ) : (
                <Volume2 className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
        )}

        {/* Timer Display */}
        <div className="relative mb-6">
          <motion.div
            className={`relative ${isFullScreen ? "h-64 w-64" : "h-40 w-40"}`}
          >
            {/* Background circle */}
            <svg className="w-full h-full -rotate-90 transform">
              <circle
                cx="50%"
                cy="50%"
                r={isFullScreen ? "120" : "75"}
                fill="none"
                stroke={isFullScreen ? "rgba(255,255,255,0.2)" : "#E5E7EB"}
                strokeWidth={isFullScreen ? "8" : "6"}
              />
              <motion.circle
                cx="50%"
                cy="50%"
                r={isFullScreen ? "120" : "75"}
                fill="none"
                stroke={isFullScreen ? "white" : "#5BB5B0"}
                strokeWidth={isFullScreen ? "8" : "6"}
                strokeLinecap="round"
                strokeDasharray={isFullScreen ? 754 : 471}
                animate={{
                  strokeDashoffset: isFullScreen
                    ? 754 * (1 - progress / 100)
                    : 471 * (1 - progress / 100),
                }}
                transition={{ duration: 0.5 }}
              />
            </svg>

            {/* Time text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className={`font-bold ${
                  isFullScreen ? "text-6xl text-white" : "text-4xl text-gray-900"
                }`}
              >
                {Math.floor(timeLeft / 60)}
              </span>
              <span
                className={`text-sm ${
                  isFullScreen ? "text-white/80" : "text-gray-500"
                }`}
              >
                I will meditate for {Math.floor(duration / 60)} minutes
              </span>
            </div>
          </motion.div>
        </div>

        {/* Duration presets (when not running) */}
        {!isRunning && timeLeft === duration && (
          <div className="flex gap-2 mb-6">
            {presetDurations.map((mins) => (
              <button
                key={mins}
                onClick={() => handleDurationChange(mins)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  duration === mins * 60
                    ? isFullScreen
                      ? "bg-white text-[#5BB5B0]"
                      : "bg-[#5BB5B0] text-white"
                    : isFullScreen
                    ? "bg-white/20 text-white hover:bg-white/30"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {mins}m
              </button>
            ))}
          </div>
        )}

        {/* Bar chart visualization */}
        {!isFullScreen && (
          <div className="w-full flex items-end justify-center gap-1 h-16 mb-4">
            {Array.from({ length: 12 }).map((_, i) => {
              const isActive = isRunning && i <= (progress / 100) * 12;
              const height = 20 + Math.random() * 40;
              return (
                <motion.div
                  key={i}
                  className="w-2 rounded-t-sm"
                  style={{
                    backgroundColor: isActive ? "#5BB5B0" : "#E5E7EB",
                    height: `${height}%`,
                  }}
                  animate={
                    isRunning
                      ? {
                          height: [`${height}%`, `${20 + Math.random() * 40}%`],
                        }
                      : {}
                  }
                  transition={{
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 0.5 + Math.random() * 0.5,
                  }}
                />
              );
            })}
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleReset}
            className={`h-12 w-12 rounded-full flex items-center justify-center ${
              isFullScreen
                ? "bg-white/20 text-white hover:bg-white/30"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <RotateCcw className="h-5 w-5" />
          </button>

          <Button
            onClick={() => setIsRunning(!isRunning)}
            className={`h-14 px-8 rounded-full font-semibold ${
              isFullScreen
                ? "bg-white text-[#5BB5B0] hover:bg-white/90"
                : "bg-[#8B7355] text-white hover:bg-[#7A6548]"
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="h-5 w-5 mr-2" /> Pause
              </>
            ) : (
              <>
                <Play className="h-5 w-5 mr-2" /> {timeLeft === duration ? "Start" : "Continue"}
              </>
            )}
          </Button>

          {isFullScreen && (
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="h-12 w-12 rounded-full bg-white/20 text-white hover:bg-white/30 flex items-center justify-center"
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
