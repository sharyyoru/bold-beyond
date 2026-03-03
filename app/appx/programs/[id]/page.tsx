"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Play,
  Lock,
  Check,
  Clock,
  Star,
  ChevronRight,
  Sparkles,
  Target,
  Brain,
  Heart,
  Zap,
  TrendingUp,
  Award,
  BookOpen,
  Users,
  Calendar,
  CheckCircle2,
  Circle,
  PlayCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createAppClient } from "@/lib/supabase";

interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  isCompleted: boolean;
  isLocked: boolean;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: "video" | "exercise" | "reflection" | "quiz";
  isCompleted: boolean;
}

interface ProgramDetail {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  duration: string;
  totalModules: number;
  completedModules: number;
  category: string;
  icon: typeof Brain;
  color: string;
  instructor: {
    name: string;
    title: string;
    avatar: string;
  };
  benefits: string[];
  modules: Module[];
  enrolledUsers: number;
  rating: number;
  reviews: number;
}

const programsData: Record<string, ProgramDetail> = {
  "sustainable-leadership": {
    id: "sustainable-leadership",
    title: "Sustainable Leadership",
    description: "Build resilience and lead without burnout.",
    longDescription: "Transform your approach to leadership by developing sustainable practices that prevent burnout while maximizing impact. Learn to lead with clarity, resilience, and purpose through evidence-based techniques.",
    duration: "8 weeks",
    totalModules: 12,
    completedModules: 4,
    category: "Leadership",
    icon: Target,
    color: "#5BB5B0",
    instructor: {
      name: "Dr. Sarah Mitchell",
      title: "Executive Coach & Psychologist",
      avatar: "/assets/instructors/sarah.jpg",
    },
    benefits: [
      "Prevent leadership burnout",
      "Build lasting resilience",
      "Improve team performance",
      "Develop emotional intelligence",
      "Create sustainable habits",
    ],
    enrolledUsers: 2847,
    rating: 4.9,
    reviews: 312,
    modules: [
      {
        id: "m1",
        title: "Foundation of Sustainable Leadership",
        description: "Understanding the principles of leading without burning out",
        duration: "45 min",
        isCompleted: true,
        isLocked: false,
        lessons: [
          { id: "l1", title: "The Burnout Epidemic", duration: "12 min", type: "video", isCompleted: true },
          { id: "l2", title: "Self-Assessment", duration: "15 min", type: "exercise", isCompleted: true },
          { id: "l3", title: "Your Leadership Style", duration: "18 min", type: "reflection", isCompleted: true },
        ],
      },
      {
        id: "m2",
        title: "Energy Management",
        description: "Learn to manage your energy, not just your time",
        duration: "50 min",
        isCompleted: true,
        isLocked: false,
        lessons: [
          { id: "l4", title: "The Energy Audit", duration: "15 min", type: "video", isCompleted: true },
          { id: "l5", title: "Peak Performance Windows", duration: "20 min", type: "exercise", isCompleted: true },
          { id: "l6", title: "Recovery Rituals", duration: "15 min", type: "video", isCompleted: true },
        ],
      },
      {
        id: "m3",
        title: "Boundary Setting",
        description: "Create healthy boundaries that protect your wellbeing",
        duration: "40 min",
        isCompleted: true,
        isLocked: false,
        lessons: [
          { id: "l7", title: "The Art of Saying No", duration: "12 min", type: "video", isCompleted: true },
          { id: "l8", title: "Boundary Practice", duration: "15 min", type: "exercise", isCompleted: true },
          { id: "l9", title: "Weekly Review", duration: "13 min", type: "reflection", isCompleted: true },
        ],
      },
      {
        id: "m4",
        title: "Delegation Mastery",
        description: "Empower your team through effective delegation",
        duration: "55 min",
        isCompleted: true,
        isLocked: false,
        lessons: [
          { id: "l10", title: "Trust & Delegation", duration: "18 min", type: "video", isCompleted: true },
          { id: "l11", title: "Delegation Framework", duration: "20 min", type: "exercise", isCompleted: true },
          { id: "l12", title: "Module Quiz", duration: "17 min", type: "quiz", isCompleted: true },
        ],
      },
      {
        id: "m5",
        title: "Mindful Leadership",
        description: "Integrate mindfulness into your daily leadership practice",
        duration: "45 min",
        isCompleted: false,
        isLocked: false,
        lessons: [
          { id: "l13", title: "Present Moment Awareness", duration: "15 min", type: "video", isCompleted: false },
          { id: "l14", title: "Mindful Decision Making", duration: "15 min", type: "exercise", isCompleted: false },
          { id: "l15", title: "Daily Practice", duration: "15 min", type: "reflection", isCompleted: false },
        ],
      },
      {
        id: "m6",
        title: "Stress Transformation",
        description: "Transform stress from enemy to ally",
        duration: "50 min",
        isCompleted: false,
        isLocked: false,
        lessons: [
          { id: "l16", title: "Reframing Stress", duration: "18 min", type: "video", isCompleted: false },
          { id: "l17", title: "Stress Inoculation", duration: "17 min", type: "exercise", isCompleted: false },
          { id: "l18", title: "Building Antifragility", duration: "15 min", type: "video", isCompleted: false },
        ],
      },
    ],
  },
  "stress-mastery": {
    id: "stress-mastery",
    title: "Stress Mastery",
    description: "Regulate your nervous system and thrive under pressure.",
    longDescription: "Master evidence-based techniques to regulate your nervous system and transform your relationship with stress. Learn to thrive under pressure while maintaining inner calm and clarity.",
    duration: "6 weeks",
    totalModules: 8,
    completedModules: 0,
    category: "Wellness",
    icon: Brain,
    color: "#6B9BC3",
    instructor: {
      name: "Dr. James Chen",
      title: "Neuroscientist & Stress Expert",
      avatar: "/assets/instructors/james.jpg",
    },
    benefits: [
      "Master nervous system regulation",
      "Build stress resilience",
      "Improve sleep quality",
      "Enhance mental clarity",
      "Develop calm under pressure",
    ],
    enrolledUsers: 3156,
    rating: 4.8,
    reviews: 428,
    modules: [
      {
        id: "m1",
        title: "Understanding Your Nervous System",
        description: "Learn how your body responds to stress",
        duration: "40 min",
        isCompleted: false,
        isLocked: false,
        lessons: [
          { id: "l1", title: "The Stress Response", duration: "15 min", type: "video", isCompleted: false },
          { id: "l2", title: "Mapping Your Triggers", duration: "12 min", type: "exercise", isCompleted: false },
          { id: "l3", title: "Baseline Assessment", duration: "13 min", type: "reflection", isCompleted: false },
        ],
      },
      {
        id: "m2",
        title: "Breath as Medicine",
        description: "Master breathing techniques for instant calm",
        duration: "45 min",
        isCompleted: false,
        isLocked: false,
        lessons: [
          { id: "l4", title: "Science of Breath", duration: "12 min", type: "video", isCompleted: false },
          { id: "l5", title: "Box Breathing Mastery", duration: "18 min", type: "exercise", isCompleted: false },
          { id: "l6", title: "4-7-8 Technique", duration: "15 min", type: "exercise", isCompleted: false },
        ],
      },
    ],
  },
  "emotional-intelligence": {
    id: "emotional-intelligence",
    title: "Emotional Intelligence",
    description: "Develop deeper self-awareness and improve relationships.",
    longDescription: "Cultivate emotional intelligence to transform your personal and professional relationships. Develop self-awareness, empathy, and social skills that create lasting impact.",
    duration: "6 weeks",
    totalModules: 10,
    completedModules: 0,
    category: "Personal Growth",
    icon: Heart,
    color: "#E8A87C",
    instructor: {
      name: "Maya Rodriguez",
      title: "EQ Coach & Therapist",
      avatar: "/assets/instructors/maya.jpg",
    },
    benefits: [
      "Develop self-awareness",
      "Improve empathy skills",
      "Better relationship management",
      "Enhanced communication",
      "Conflict resolution mastery",
    ],
    enrolledUsers: 2234,
    rating: 4.9,
    reviews: 287,
    modules: [
      {
        id: "m1",
        title: "The EQ Foundation",
        description: "Understanding emotional intelligence fundamentals",
        duration: "35 min",
        isCompleted: false,
        isLocked: false,
        lessons: [
          { id: "l1", title: "What is EQ?", duration: "12 min", type: "video", isCompleted: false },
          { id: "l2", title: "EQ Assessment", duration: "15 min", type: "exercise", isCompleted: false },
          { id: "l3", title: "Your EQ Profile", duration: "8 min", type: "reflection", isCompleted: false },
        ],
      },
    ],
  },
  "energy-optimization": {
    id: "energy-optimization",
    title: "Energy Optimization",
    description: "Maximize your daily energy through holistic protocols.",
    longDescription: "Optimize your energy through sleep, nutrition, movement, and recovery protocols. Learn to sustain high performance throughout your day while building long-term vitality.",
    duration: "4 weeks",
    totalModules: 6,
    completedModules: 0,
    category: "Performance",
    icon: Zap,
    color: "#8B7355",
    instructor: {
      name: "Dr. Alex Turner",
      title: "Performance Medicine Specialist",
      avatar: "/assets/instructors/alex.jpg",
    },
    benefits: [
      "Optimize sleep quality",
      "Nutrition for energy",
      "Movement protocols",
      "Recovery strategies",
      "Sustained high performance",
    ],
    enrolledUsers: 1892,
    rating: 4.7,
    reviews: 198,
    modules: [
      {
        id: "m1",
        title: "Energy Audit",
        description: "Assess your current energy levels and patterns",
        duration: "30 min",
        isCompleted: false,
        isLocked: false,
        lessons: [
          { id: "l1", title: "The Energy Equation", duration: "10 min", type: "video", isCompleted: false },
          { id: "l2", title: "Energy Tracking", duration: "12 min", type: "exercise", isCompleted: false },
          { id: "l3", title: "Identifying Drains", duration: "8 min", type: "reflection", isCompleted: false },
        ],
      },
    ],
  },
  "peak-performance": {
    id: "peak-performance",
    title: "Peak Performance",
    description: "Unlock your full potential with mental training.",
    longDescription: "Access your peak performance state through advanced mental training and flow state techniques. Learn from elite performers to unlock your full human potential.",
    duration: "10 weeks",
    totalModules: 15,
    completedModules: 0,
    category: "Performance",
    icon: TrendingUp,
    color: "#C17767",
    instructor: {
      name: "Marcus Webb",
      title: "High Performance Coach",
      avatar: "/assets/instructors/marcus.jpg",
    },
    benefits: [
      "Access flow states",
      "Mental performance training",
      "Goal achievement systems",
      "Focus optimization",
      "Elite mindset development",
    ],
    enrolledUsers: 1456,
    rating: 4.8,
    reviews: 156,
    modules: [
      {
        id: "m1",
        title: "The Peak Performance Mindset",
        description: "Build the mental foundation for elite performance",
        duration: "50 min",
        isCompleted: false,
        isLocked: false,
        lessons: [
          { id: "l1", title: "What is Peak Performance?", duration: "15 min", type: "video", isCompleted: false },
          { id: "l2", title: "Mindset Assessment", duration: "20 min", type: "exercise", isCompleted: false },
          { id: "l3", title: "Vision Setting", duration: "15 min", type: "reflection", isCompleted: false },
        ],
      },
    ],
  },
};

export default function ProgramDetailPage() {
  const router = useRouter();
  const params = useParams();
  const programId = params.id as string;
  
  const [program, setProgram] = useState<ProgramDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const loadProgram = async () => {
      try {
        // Get program data
        const programData = programsData[programId];
        if (programData) {
          setProgram(programData);
          // Check if user has started this program
          if (programData.completedModules > 0) {
            setIsEnrolled(true);
          }
        }
      } catch (error) {
        console.error("Error loading program:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProgram();
  }, [programId]);

  const handleEnroll = () => {
    setIsEnrolled(true);
    // In production, save enrollment to database
  };

  const handleStartLesson = (moduleId: string, lessonId: string) => {
    // Navigate to lesson player
    router.push(`/appx/programs/${programId}/lesson/${lessonId}`);
  };

  const getProgressPercentage = () => {
    if (!program) return 0;
    return Math.round((program.completedModules / program.totalModules) * 100);
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video": return PlayCircle;
      case "exercise": return Target;
      case "reflection": return BookOpen;
      case "quiz": return Award;
      default: return PlayCircle;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-palette-sky/15 via-palette-sea/10 to-palette-sand/15 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5BB5B0]" />
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-palette-sky/15 via-palette-sea/10 to-palette-sand/15 flex flex-col items-center justify-center p-4">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Program Not Found</h1>
        <p className="text-gray-600 mb-4">This program doesn't exist or has been removed.</p>
        <Button onClick={() => router.push("/appx/programs")} className="bg-[#5BB5B0] hover:bg-[#4A9A96]">
          Browse Programs
        </Button>
      </div>
    );
  }

  const IconComponent = program.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-palette-sky/15 via-palette-sea/10 to-palette-sand/15 pb-24 relative overflow-hidden">
      {/* Decorative glass orbs */}
      <div className="absolute top-40 -left-20 w-72 h-72 bg-palette-sea/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-40 -right-20 w-80 h-80 bg-palette-sky/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Header - Glassmorphism */}
      <div 
        className="relative px-4 pt-4 pb-8 overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${program.color}ee, ${program.color}99)` }}
      >
        <div className="absolute inset-0 backdrop-blur-xl" />
        <div className="absolute inset-0 bg-white/5" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "url('/assets/b&b-diamond-pattern.svg')",
            backgroundSize: "80px",
          }}
        />
        
        <div className="relative z-10">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => router.back()}
              className="h-10 w-10 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/25 transition-all"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </button>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                <span className="text-xs font-medium text-white">{program.category}</span>
              </div>
            </div>
          </div>
          
          {/* Program Info */}
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
              <IconComponent className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white mb-1">{program.title}</h1>
              <p className="text-white/80 text-sm">{program.description}</p>
            </div>
          </div>
          
          {/* Stats Row */}
          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Clock className="h-4 w-4 text-white/80" />
              <span className="text-sm text-white">{program.duration}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <BookOpen className="h-4 w-4 text-white/80" />
              <span className="text-sm text-white">{program.totalModules} modules</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Star className="h-4 w-4 text-yellow-300" fill="currentColor" />
              <span className="text-sm text-white">{program.rating}</span>
            </div>
          </div>
          
          {/* Progress Bar (if enrolled) */}
          {isEnrolled && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/80">Your Progress</span>
                <span className="text-sm font-bold text-white">{getProgressPercentage()}%</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${getProgressPercentage()}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 -mt-4 relative z-10">
        {/* About Section - Glass Card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-5 shadow-glass border border-white/40 mb-4">
          <h2 className="font-bold text-gray-900 mb-3">About This Program</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">{program.longDescription}</p>
          
          {/* Benefits */}
          <h3 className="font-semibold text-gray-800 mb-2">What You'll Learn</h3>
          <div className="space-y-2">
            {program.benefits.map((benefit, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#5BB5B0]" />
                <span className="text-sm text-gray-600">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Instructor Card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 shadow-glass border border-white/40 mb-4">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[#5BB5B0] to-[#6B9BC3] flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {program.instructor.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{program.instructor.name}</h3>
              <p className="text-sm text-gray-500">{program.instructor.title}</p>
            </div>
          </div>
        </div>

        {/* Modules List */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-glass border border-white/40 overflow-hidden mb-4">
          <div className="p-4 border-b border-white/30">
            <h2 className="font-bold text-gray-900">Course Content</h2>
            <p className="text-sm text-gray-500">{program.totalModules} modules • {program.modules.reduce((acc, m) => acc + m.lessons.length, 0)} lessons</p>
          </div>
          
          <div className="divide-y divide-white/20">
            {program.modules.map((module, index) => (
              <div key={module.id}>
                <button
                  onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
                  className="w-full p-4 flex items-center gap-3 hover:bg-white/30 transition-all"
                >
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                    module.isCompleted 
                      ? 'bg-green-100' 
                      : module.isLocked 
                        ? 'bg-gray-100' 
                        : 'bg-[#5BB5B0]/10'
                  }`}>
                    {module.isCompleted ? (
                      <Check className="h-5 w-5 text-green-600" />
                    ) : module.isLocked ? (
                      <Lock className="h-5 w-5 text-gray-400" />
                    ) : (
                      <span className="font-bold text-[#5BB5B0]">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-medium text-gray-900">{module.title}</h3>
                    <p className="text-xs text-gray-500">{module.lessons.length} lessons • {module.duration}</p>
                  </div>
                  <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform ${
                    expandedModule === module.id ? 'rotate-90' : ''
                  }`} />
                </button>
                
                <AnimatePresence>
                  {expandedModule === module.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden bg-white/30"
                    >
                      <div className="px-4 pb-4 space-y-2">
                        {module.lessons.map((lesson) => {
                          const LessonIcon = getLessonIcon(lesson.type);
                          return (
                            <button
                              key={lesson.id}
                              onClick={() => !module.isLocked && handleStartLesson(module.id, lesson.id)}
                              disabled={module.isLocked}
                              className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/50 hover:bg-white/70 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                                lesson.isCompleted ? 'bg-green-100' : 'bg-gray-100'
                              }`}>
                                {lesson.isCompleted ? (
                                  <Check className="h-4 w-4 text-green-600" />
                                ) : (
                                  <LessonIcon className="h-4 w-4 text-gray-500" />
                                )}
                              </div>
                              <div className="flex-1 text-left">
                                <p className="text-sm font-medium text-gray-800">{lesson.title}</p>
                                <p className="text-xs text-gray-500">{lesson.duration}</p>
                              </div>
                              {!module.isLocked && !lesson.isCompleted && (
                                <Play className="h-4 w-4 text-[#5BB5B0]" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Community Stats */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 shadow-glass border border-white/40 mb-4">
          <div className="flex items-center justify-around">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Users className="h-4 w-4 text-[#5BB5B0]" />
                <span className="font-bold text-gray-900">{program.enrolledUsers.toLocaleString()}</span>
              </div>
              <p className="text-xs text-gray-500">Enrolled</p>
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="h-4 w-4 text-yellow-500" fill="currentColor" />
                <span className="font-bold text-gray-900">{program.rating}</span>
              </div>
              <p className="text-xs text-gray-500">{program.reviews} reviews</p>
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Award className="h-4 w-4 text-[#5BB5B0]" />
                <span className="font-bold text-gray-900">Certificate</span>
              </div>
              <p className="text-xs text-gray-500">On completion</p>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-white/30 z-20">
        {isEnrolled ? (
          <Button 
            onClick={() => {
              // Find next incomplete lesson
              const nextModule = program.modules.find(m => !m.isCompleted && !m.isLocked);
              if (nextModule) {
                const nextLesson = nextModule.lessons.find(l => !l.isCompleted);
                if (nextLesson) {
                  handleStartLesson(nextModule.id, nextLesson.id);
                }
              }
            }}
            className="w-full h-14 text-lg font-semibold rounded-2xl shadow-glass"
            style={{ backgroundColor: program.color }}
          >
            <Play className="h-5 w-5 mr-2" />
            Continue Learning
          </Button>
        ) : (
          <Button 
            onClick={handleEnroll}
            className="w-full h-14 text-lg font-semibold rounded-2xl shadow-glass"
            style={{ backgroundColor: program.color }}
          >
            <Sparkles className="h-5 w-5 mr-2" />
            Start Program
          </Button>
        )}
      </div>
    </div>
  );
}
