"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createAppClient } from "@/lib/supabase";

interface Program {
  id: string;
  title: string;
  description: string;
  duration: string;
  modules: number;
  completedModules: number;
  category: string;
  icon: typeof Brain;
  color: string;
  isLocked: boolean;
  isActive: boolean;
}

const availablePrograms: Program[] = [
  {
    id: "sustainable-leadership",
    title: "Sustainable Leadership",
    description: "Build resilience and lead without burnout. Transform your approach to high performance.",
    duration: "8 weeks",
    modules: 12,
    completedModules: 4,
    category: "Leadership",
    icon: Target,
    color: "#5BB5B0",
    isLocked: false,
    isActive: true,
  },
  {
    id: "stress-mastery",
    title: "Stress Mastery",
    description: "Learn evidence-based techniques to regulate your nervous system and thrive under pressure.",
    duration: "6 weeks",
    modules: 8,
    completedModules: 0,
    category: "Wellness",
    icon: Brain,
    color: "#6B9BC3",
    isLocked: false,
    isActive: false,
  },
  {
    id: "emotional-intelligence",
    title: "Emotional Intelligence",
    description: "Develop deeper self-awareness and improve your relationships at work and home.",
    duration: "6 weeks",
    modules: 10,
    completedModules: 0,
    category: "Personal Growth",
    icon: Heart,
    color: "#E8A87C",
    isLocked: false,
    isActive: false,
  },
  {
    id: "energy-optimization",
    title: "Energy Optimization",
    description: "Maximize your daily energy through sleep, nutrition, movement, and recovery protocols.",
    duration: "4 weeks",
    modules: 6,
    completedModules: 0,
    category: "Performance",
    icon: Zap,
    color: "#8B7355",
    isLocked: true,
    isActive: false,
  },
  {
    id: "peak-performance",
    title: "Peak Performance",
    description: "Unlock your full potential with advanced mental training and flow state techniques.",
    duration: "10 weeks",
    modules: 15,
    completedModules: 0,
    category: "Performance",
    icon: TrendingUp,
    color: "#C17767",
    isLocked: true,
    isActive: false,
  },
];

export default function ProgramsPage() {
  const router = useRouter();
  const [programs, setPrograms] = useState<Program[]>(availablePrograms);
  const [activeProgram, setActiveProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserPrograms = async () => {
      try {
        const supabase = createAppClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // In production, fetch user's enrolled programs from database
          // For now, use default programs
          const active = programs.find(p => p.isActive);
          if (active) {
            setActiveProgram(active);
          }
        }
      } catch (error) {
        console.error("Error loading programs:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserPrograms();
  }, []);

  const handleStartProgram = (program: Program) => {
    if (program.isLocked) {
      // Show upgrade modal or redirect to subscription
      router.push("/appx/wallet");
      return;
    }
    // Navigate to program detail/start
    router.push(`/appx/programs/${program.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5BB5B0]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1B365D] to-[#0D9488] px-4 pt-4 pb-6 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "url('/assets/b&b-diamond-pattern.svg')",
            backgroundSize: "80px",
          }}
        />
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.back()}
              className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-white">Transformation Programs</h1>
              <p className="text-white/70 text-sm">Prescribed journeys for lasting change</p>
            </div>
          </div>

          {/* Active Program Card */}
          {activeProgram && (
            <div className="bg-white/10 backdrop-blur rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-brand-gold" />
                <span className="text-xs text-white/80 font-medium">Currently Active</span>
              </div>
              <div className="flex items-center gap-3">
                <div 
                  className="h-12 w-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${activeProgram.color}40` }}
                >
                  <activeProgram.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white">{activeProgram.title}</p>
                  <p className="text-xs text-white/60">
                    {activeProgram.completedModules}/{activeProgram.modules} modules complete
                  </p>
                </div>
                <Link href={`/appx/programs/${activeProgram.id}`}>
                  <Button size="sm" className="bg-white text-[#1B365D] hover:bg-white/90 rounded-full">
                    Continue
                  </Button>
                </Link>
              </div>
              {/* Progress bar */}
              <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-brand-gold rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(activeProgram.completedModules / activeProgram.modules) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Programs List */}
      <div className="px-4 py-4">
        <h3 className="font-semibold text-gray-900 mb-4">Available Programs</h3>
        
        <div className="space-y-4">
          {programs.map((program) => (
            <motion.div
              key={program.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Card 
                className={`border-0 shadow-md overflow-hidden cursor-pointer ${
                  program.isLocked ? "opacity-70" : ""
                }`}
                onClick={() => handleStartProgram(program)}
              >
                <CardContent className="p-0">
                  <div className="flex">
                    {/* Icon */}
                    <div 
                      className="w-20 flex items-center justify-center"
                      style={{ backgroundColor: `${program.color}20` }}
                    >
                      <program.icon className="h-8 w-8" style={{ color: program.color }} />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-900">{program.title}</h4>
                            {program.isActive && (
                              <span className="text-xs bg-[#5BB5B0] text-white px-2 py-0.5 rounded-full">
                                Active
                              </span>
                            )}
                            {program.isLocked && (
                              <Lock className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                          <p className="text-xs text-gray-500">{program.category}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-300" />
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {program.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {program.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Play className="h-3 w-3" />
                          {program.modules} modules
                        </span>
                        {program.completedModules > 0 && (
                          <span className="flex items-center gap-1 text-[#5BB5B0]">
                            <Check className="h-3 w-3" />
                            {program.completedModules} done
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Upgrade CTA */}
      <div className="px-4 mt-4">
        <div className="bg-gradient-to-r from-[#8B7355] to-[#6B5344] rounded-2xl p-5 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-5 w-5 text-brand-gold" />
            <h4 className="font-semibold">Unlock All Programs</h4>
          </div>
          <p className="text-sm text-white/80 mb-4">
            Get unlimited access to all transformation programs with Bold+ membership.
          </p>
          <Link href="/appx/wallet">
            <Button className="w-full bg-white text-[#8B7355] hover:bg-white/90 rounded-full">
              Upgrade to Bold+ →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
