"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Check,
  ChevronRight,
  Clock,
  BookOpen,
  Award,
  Target,
  X,
  Volume2,
  VolumeX,
  Maximize,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface LessonContent {
  id: string;
  title: string;
  type: "video" | "exercise" | "reflection" | "quiz";
  duration: string;
  content: {
    videoUrl?: string;
    transcript?: string;
    exerciseSteps?: string[];
    reflectionPrompts?: string[];
    quizQuestions?: QuizQuestion[];
  };
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

const lessonContents: Record<string, LessonContent> = {
  l1: {
    id: "l1",
    title: "The Burnout Epidemic",
    type: "video",
    duration: "12 min",
    content: {
      transcript: `Welcome to the first lesson of Sustainable Leadership. Today, we'll explore the burnout epidemic that's affecting leaders worldwide.

Burnout isn't just feeling tired. It's a state of chronic stress that leads to physical and emotional exhaustion, cynicism and detachment, and feelings of ineffectiveness.

Research shows that 76% of employees experience burnout at least sometimes, and leaders are particularly vulnerable due to their high-pressure roles.

In this program, you'll learn to recognize the early warning signs of burnout, develop sustainable practices that prevent it, and build the resilience to lead effectively long-term.

Let's begin by understanding what makes leadership burnout unique and why traditional productivity approaches often backfire.`,
    },
  },
  l2: {
    id: "l2",
    title: "Self-Assessment",
    type: "exercise",
    duration: "15 min",
    content: {
      exerciseSteps: [
        "Find a quiet space where you won't be interrupted for the next 15 minutes.",
        "Take three deep breaths to center yourself.",
        "On a scale of 1-10, rate your current energy levels in the morning, afternoon, and evening.",
        "List three situations this week that drained your energy significantly.",
        "List three activities that restored your energy.",
        "Identify one pattern you notice about your energy throughout the day.",
        "Write down one small change you could make tomorrow to protect your energy.",
      ],
    },
  },
  l3: {
    id: "l3",
    title: "Your Leadership Style",
    type: "reflection",
    duration: "18 min",
    content: {
      reflectionPrompts: [
        "What kind of leader do you aspire to be?",
        "When do you feel most effective as a leader?",
        "What leadership behaviors drain you the most?",
        "How would your team describe your leadership style?",
        "What's one leadership habit you'd like to change?",
      ],
    },
  },
  l12: {
    id: "l12",
    title: "Module Quiz",
    type: "quiz",
    duration: "17 min",
    content: {
      quizQuestions: [
        {
          id: "q1",
          question: "What is the primary cause of leadership burnout?",
          options: [
            "Working too many hours",
            "Chronic stress without adequate recovery",
            "Having too many responsibilities",
            "Poor time management",
          ],
          correctAnswer: 1,
        },
        {
          id: "q2",
          question: "Which is NOT a component of the Delegation Framework?",
          options: [
            "Clear expectations",
            "Trust building",
            "Micromanagement",
            "Feedback loops",
          ],
          correctAnswer: 2,
        },
        {
          id: "q3",
          question: "Energy management differs from time management because:",
          options: [
            "It focuses on when you work",
            "It considers the quality of your attention",
            "It ignores productivity",
            "It requires more hours",
          ],
          correctAnswer: 1,
        },
      ],
    },
  },
};

export default function LessonPage() {
  const router = useRouter();
  const params = useParams();
  const programId = params.id as string;
  const lessonId = params.lessonId as string;
  
  const [lesson, setLesson] = useState<LessonContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const loadLesson = async () => {
      try {
        const lessonData = lessonContents[lessonId] || {
          id: lessonId,
          title: "Lesson Content",
          type: "video" as const,
          duration: "10 min",
          content: {
            transcript: "This lesson content is being prepared. Please check back soon for the full experience.",
          },
        };
        setLesson(lessonData);
      } catch (error) {
        console.error("Error loading lesson:", error);
      } finally {
        setLoading(false);
      }
    };

    loadLesson();
  }, [lessonId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && lesson?.type === "video") {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            setIsCompleted(true);
            return 100;
          }
          return prev + 0.5;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, lesson?.type]);

  const handleStepComplete = (stepIndex: number) => {
    if (!completedSteps.includes(stepIndex)) {
      setCompletedSteps([...completedSteps, stepIndex]);
    }
    if (lesson?.content.exerciseSteps && stepIndex < lesson.content.exerciseSteps.length - 1) {
      setCurrentStep(stepIndex + 1);
    } else if (lesson?.content.reflectionPrompts && stepIndex < lesson.content.reflectionPrompts.length - 1) {
      setCurrentStep(stepIndex + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleQuizAnswer = (questionId: string, answerIndex: number) => {
    setQuizAnswers({ ...quizAnswers, [questionId]: answerIndex });
  };

  const handleQuizSubmit = () => {
    setShowResults(true);
    setIsCompleted(true);
  };

  const getQuizScore = () => {
    if (!lesson?.content.quizQuestions) return 0;
    const correct = lesson.content.quizQuestions.filter(
      (q) => quizAnswers[q.id] === q.correctAnswer
    ).length;
    return Math.round((correct / lesson.content.quizQuestions.length) * 100);
  };

  const handleComplete = () => {
    // In production, save completion to database
    router.push(`/appx/programs/${programId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-palette-sky/15 via-palette-sea/10 to-palette-sand/15 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5BB5B0]" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-palette-sky/15 via-palette-sea/10 to-palette-sand/15 flex flex-col items-center justify-center p-4">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Lesson Not Found</h1>
        <Button onClick={() => router.back()} className="bg-[#5BB5B0] hover:bg-[#4A9A96]">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-palette-sky/15 via-palette-sea/10 to-palette-sand/15 flex flex-col">
      {/* Decorative glass orbs */}
      <div className="absolute top-40 -left-20 w-72 h-72 bg-palette-sea/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-40 -right-20 w-80 h-80 bg-palette-sky/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-xl border-b border-white/30 px-4 py-3 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-all"
          >
            <X className="h-5 w-5 text-gray-700" />
          </button>
          <div className="flex-1">
            <h1 className="font-semibold text-gray-900 truncate">{lesson.title}</h1>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {lesson.duration}
            </p>
          </div>
          {isCompleted && (
            <div className="flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full">
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-xs font-medium text-green-600">Complete</span>
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4 relative z-10">
        {lesson.type === "video" && (
          <div className="space-y-4">
            {/* Video Player Placeholder */}
            <div className="bg-gray-900 rounded-2xl aspect-video relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="h-20 w-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all"
                >
                  {isPlaying ? (
                    <Pause className="h-10 w-10 text-white" />
                  ) : (
                    <Play className="h-10 w-10 text-white ml-1" />
                  )}
                </button>
              </div>
              {/* Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#5BB5B0] transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Transcript */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-5 shadow-glass border border-white/40">
              <h3 className="font-semibold text-gray-900 mb-3">Transcript</h3>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                {lesson.content.transcript}
              </p>
            </div>
          </div>
        )}

        {lesson.type === "exercise" && lesson.content.exerciseSteps && (
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-5 shadow-glass border border-white/40">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-[#5BB5B0]" />
              <h2 className="font-bold text-gray-900">Exercise Steps</h2>
            </div>
            <div className="space-y-3">
              {lesson.content.exerciseSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-xl border transition-all ${
                    completedSteps.includes(index)
                      ? 'bg-green-50 border-green-200'
                      : currentStep === index
                        ? 'bg-[#5BB5B0]/10 border-[#5BB5B0]/30'
                        : 'bg-white/50 border-white/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleStepComplete(index)}
                      className={`h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        completedSteps.includes(index)
                          ? 'bg-green-500 text-white'
                          : 'border-2 border-gray-300'
                      }`}
                    >
                      {completedSteps.includes(index) && <Check className="h-4 w-4" />}
                    </button>
                    <p className={`text-sm ${completedSteps.includes(index) ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                      {step}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {lesson.type === "reflection" && lesson.content.reflectionPrompts && (
          <div className="space-y-4">
            {lesson.content.reflectionPrompts.map((prompt, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                className={`bg-white/70 backdrop-blur-xl rounded-2xl p-5 shadow-glass border border-white/40 ${
                  currentStep === index ? 'ring-2 ring-[#5BB5B0]' : ''
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="h-8 w-8 rounded-lg bg-[#5BB5B0]/10 flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-[#5BB5B0]" />
                  </div>
                  <p className="font-medium text-gray-900 flex-1">{prompt}</p>
                </div>
                <textarea
                  placeholder="Write your reflection here..."
                  className="w-full h-24 p-3 rounded-xl bg-white/50 border border-white/40 text-sm text-gray-700 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#5BB5B0]/50"
                />
                {currentStep === index && (
                  <Button
                    onClick={() => handleStepComplete(index)}
                    className="mt-3 bg-[#5BB5B0] hover:bg-[#4A9A96]"
                    size="sm"
                  >
                    Complete Reflection
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {lesson.type === "quiz" && lesson.content.quizQuestions && (
          <div className="space-y-4">
            {!showResults ? (
              <>
                {lesson.content.quizQuestions.map((question, qIndex) => (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: qIndex * 0.1 }}
                    className="bg-white/70 backdrop-blur-xl rounded-2xl p-5 shadow-glass border border-white/40"
                  >
                    <p className="font-medium text-gray-900 mb-4">
                      {qIndex + 1}. {question.question}
                    </p>
                    <div className="space-y-2">
                      {question.options.map((option, oIndex) => (
                        <button
                          key={oIndex}
                          onClick={() => handleQuizAnswer(question.id, oIndex)}
                          className={`w-full p-3 rounded-xl text-left text-sm transition-all ${
                            quizAnswers[question.id] === oIndex
                              ? 'bg-[#5BB5B0] text-white'
                              : 'bg-white/50 text-gray-700 hover:bg-white/70'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ))}
                <Button
                  onClick={handleQuizSubmit}
                  disabled={Object.keys(quizAnswers).length < lesson.content.quizQuestions.length}
                  className="w-full h-12 bg-[#5BB5B0] hover:bg-[#4A9A96] disabled:opacity-50"
                >
                  Submit Answers
                </Button>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-glass border border-white/40 text-center"
              >
                <div className={`h-20 w-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
                  getQuizScore() >= 70 ? 'bg-green-100' : 'bg-yellow-100'
                }`}>
                  {getQuizScore() >= 70 ? (
                    <Award className="h-10 w-10 text-green-600" />
                  ) : (
                    <Target className="h-10 w-10 text-yellow-600" />
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {getQuizScore()}% Score
                </h2>
                <p className="text-gray-600 mb-4">
                  {getQuizScore() >= 70
                    ? "Great job! You've passed this quiz."
                    : "Keep learning! Review the material and try again."}
                </p>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      {isCompleted && (
        <div className="p-4 bg-white/80 backdrop-blur-xl border-t border-white/30">
          <Button
            onClick={handleComplete}
            className="w-full h-12 bg-[#5BB5B0] hover:bg-[#4A9A96]"
          >
            <CheckCircle2 className="h-5 w-5 mr-2" />
            Mark Complete & Continue
          </Button>
        </div>
      )}
    </div>
  );
}
