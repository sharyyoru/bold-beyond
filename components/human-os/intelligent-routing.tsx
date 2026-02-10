"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  ArrowRight, 
  Brain, 
  Sparkles, 
  MessageCircle, 
  Clock,
  Zap,
  Moon,
  Heart,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";

type RoutingScenario = "regulate" | "program" | "coach" | "maintain";

interface RoutingDecision {
  scenario: RoutingScenario;
  title: string;
  description: string;
  action: string;
  actionLink: string;
  icon: typeof Brain;
  duration?: string;
  priority: "high" | "medium" | "low";
}

interface IntelligentRoutingProps {
  userState: {
    nervousSystemStatus: "regulated" | "elevated" | "dysregulated";
    alignmentScore: number;
    burnoutRisk: "low" | "moderate" | "high";
    lastCheckin?: Date;
    currentProgram?: string;
  };
  onActionClick?: (decision: RoutingDecision) => void;
}

// Decision engine logic
function determineRouting(state: IntelligentRoutingProps["userState"]): RoutingDecision {
  const { nervousSystemStatus, alignmentScore, burnoutRisk, currentProgram } = state;

  // Scenario 1: System overactive - needs regulation
  if (nervousSystemStatus === "dysregulated" || burnoutRisk === "high") {
    return {
      scenario: "regulate",
      title: "Your system is overactive",
      description: "Let's bring you back to baseline with a quick regulation exercise.",
      action: "Start 3-minute Regulation",
      actionLink: "/appx/human-os?tool=breathing",
      icon: Brain,
      duration: "3 min",
      priority: "high",
    };
  }

  // Scenario 2: Elevated but manageable
  if (nervousSystemStatus === "elevated" || burnoutRisk === "moderate") {
    return {
      scenario: "regulate",
      title: "Elevated state detected",
      description: "A short grounding exercise will help restore balance.",
      action: "Start Grounding Tool",
      actionLink: "/appx/human-os?tool=grounding",
      icon: Activity,
      duration: "5 min",
      priority: "medium",
    };
  }

  // Scenario 3: Good alignment - continue program
  if (alignmentScore >= 60 && currentProgram) {
    return {
      scenario: "program",
      title: "Alignment detected",
      description: `Continue your transformation journey with ${currentProgram}.`,
      action: "Continue Program",
      actionLink: "/appx/programs",
      icon: Sparkles,
      priority: "medium",
    };
  }

  // Scenario 4: Low alignment - coach recommended
  if (alignmentScore < 50) {
    return {
      scenario: "coach",
      title: "Support recommended",
      description: "Connecting with a coach could provide the clarity you need right now.",
      action: "Connect with Coach",
      actionLink: "/appx/wellness-chat",
      icon: MessageCircle,
      priority: "high",
    };
  }

  // Default: Maintain current state
  return {
    scenario: "maintain",
    title: "You're in a good place",
    description: "Maintain your alignment with today's recommended practice.",
    action: "Daily Practice",
    actionLink: "/appx/human-os",
    icon: Heart,
    duration: "10 min",
    priority: "low",
  };
}

export function IntelligentRouting({ userState, onActionClick }: IntelligentRoutingProps) {
  const [decision, setDecision] = useState<RoutingDecision | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    // Simulate AI processing
    const timer = setTimeout(() => {
      setDecision(determineRouting(userState));
      setIsProcessing(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [userState]);

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-gradient-to-br from-[#C17767] to-[#A65D4D] border-red-400/30";
      case "medium":
        return "bg-gradient-to-br from-[#E8A87C] to-[#D4956A] border-orange-400/30";
      default:
        return "bg-gradient-to-br from-[#5BB5B0] to-[#4A9A96] border-teal-400/30";
    }
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {isProcessing ? (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-3xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#5BB5B0]/20 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-5 w-5 text-[#5BB5B0]" />
                </motion.div>
              </div>
              <div>
                <p className="font-medium text-gray-900">Analyzing your state...</p>
                <p className="text-sm text-gray-500">The OS is determining your path</p>
              </div>
            </div>
          </motion.div>
        ) : decision ? (
          <motion.div
            key="decision"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`rounded-3xl p-6 shadow-lg border ${getPriorityStyles(decision.priority)}`}
          >
            {/* Priority indicator */}
            {decision.priority === "high" && (
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                <span className="text-xs text-white/80 font-medium uppercase tracking-wide">
                  Priority Action
                </span>
              </div>
            )}

            {/* Icon and title */}
            <div className="flex items-start gap-4 mb-4">
              <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <decision.icon className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-1">
                  {decision.title}
                </h3>
                <p className="text-white/80 text-sm">
                  {decision.description}
                </p>
              </div>
            </div>

            {/* Action button */}
            <Link href={decision.actionLink}>
              <Button
                onClick={() => onActionClick?.(decision)}
                className="w-full bg-white text-gray-900 hover:bg-white/90 rounded-2xl py-6 text-lg font-semibold shadow-lg"
              >
                <span className="flex items-center justify-center gap-2">
                  {decision.action}
                  {decision.duration && (
                    <span className="flex items-center gap-1 text-sm font-normal text-gray-500">
                      <Clock className="h-4 w-4" />
                      {decision.duration}
                    </span>
                  )}
                  <ArrowRight className="h-5 w-5 ml-1" />
                </span>
              </Button>
            </Link>

            {/* Alternative actions */}
            <div className="flex items-center justify-center gap-4 mt-4">
              <button className="text-white/60 text-sm hover:text-white transition-colors">
                Not now
              </button>
              <span className="text-white/30">|</span>
              <button className="text-white/60 text-sm hover:text-white transition-colors">
                Show alternatives
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export { determineRouting };
export type { RoutingDecision, RoutingScenario };
