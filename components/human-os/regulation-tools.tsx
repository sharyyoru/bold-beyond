"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wind, 
  Eye, 
  Hand, 
  Waves, 
  X,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";

type ToolType = "breathing" | "grounding" | "tapping" | "wave";

interface RegulationTool {
  id: ToolType;
  name: string;
  duration: string;
  description: string;
  icon: typeof Wind;
  color: string;
}

const tools: RegulationTool[] = [
  {
    id: "breathing",
    name: "Box Breathing",
    duration: "3 min",
    description: "4-4-4-4 breathing pattern to calm your nervous system",
    icon: Wind,
    color: "#5BB5B0",
  },
  {
    id: "grounding",
    name: "5-4-3-2-1 Grounding",
    duration: "2 min",
    description: "Sensory awareness to bring you back to the present",
    icon: Eye,
    color: "#6B9BC3",
  },
  {
    id: "tapping",
    name: "EFT Tapping",
    duration: "5 min",
    description: "Meridian tapping to release emotional tension",
    icon: Hand,
    color: "#8B7355",
  },
  {
    id: "wave",
    name: "Vagal Reset",
    duration: "1 min",
    description: "Quick vagus nerve stimulation for instant calm",
    icon: Waves,
    color: "#E8A87C",
  },
];

interface RegulationToolsProps {
  onToolSelect?: (tool: RegulationTool) => void;
  activeTool?: ToolType | null;
}

// Breathing exercise component
function BreathingExercise({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<"inhale" | "hold1" | "exhale" | "hold2">("inhale");
  const [isRunning, setIsRunning] = useState(false);
  const [cycles, setCycles] = useState(0);
  const targetCycles = 4;

  const phaseLabels = {
    inhale: "Breathe In",
    hold1: "Hold",
    exhale: "Breathe Out",
    hold2: "Hold",
  };

  const phaseDurations = {
    inhale: 4000,
    hold1: 4000,
    exhale: 4000,
    hold2: 4000,
  };

  const startExercise = () => {
    setIsRunning(true);
    setCycles(0);
    runCycle();
  };

  const runCycle = () => {
    const phases: Array<"inhale" | "hold1" | "exhale" | "hold2"> = ["inhale", "hold1", "exhale", "hold2"];
    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex++;
      if (currentIndex >= phases.length) {
        currentIndex = 0;
        setCycles(prev => {
          if (prev + 1 >= targetCycles) {
            clearInterval(interval);
            setIsRunning(false);
            return prev + 1;
          }
          return prev + 1;
        });
      }
      setPhase(phases[currentIndex]);
    }, 4000);

    return () => clearInterval(interval);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-gradient-to-b from-[#5BB5B0] to-[#4A9A96] flex flex-col items-center justify-center"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/20 flex items-center justify-center"
      >
        <X className="h-5 w-5 text-white" />
      </button>

      {/* Progress */}
      <div className="absolute top-4 left-4 text-white/60 text-sm">
        Cycle {cycles + 1} of {targetCycles}
      </div>

      {/* Breathing circle */}
      <motion.div
        className="h-48 w-48 rounded-full bg-white/20 flex items-center justify-center mb-8"
        animate={{
          scale: phase === "inhale" ? 1.3 : phase === "exhale" ? 0.8 : 1,
        }}
        transition={{ duration: 4, ease: "easeInOut" }}
      >
        <motion.div
          className="h-32 w-32 rounded-full bg-white/30 flex items-center justify-center"
          animate={{
            scale: phase === "inhale" ? 1.2 : phase === "exhale" ? 0.9 : 1,
          }}
          transition={{ duration: 4, ease: "easeInOut" }}
        >
          <span className="text-2xl font-bold text-white">
            {isRunning ? phaseLabels[phase] : "Ready"}
          </span>
        </motion.div>
      </motion.div>

      {/* Timer display */}
      <p className="text-white/80 text-lg mb-8">
        {isRunning ? "Follow the rhythm" : "4 seconds for each phase"}
      </p>

      {/* Controls */}
      {!isRunning ? (
        <Button
          onClick={startExercise}
          className="bg-white text-[#5BB5B0] hover:bg-white/90 rounded-full px-8 py-6 text-lg font-semibold"
        >
          <Play className="mr-2 h-5 w-5" /> Start Breathing
        </Button>
      ) : (
        <Button
          onClick={() => setIsRunning(false)}
          className="bg-white/20 text-white hover:bg-white/30 rounded-full px-8 py-6 text-lg font-semibold"
        >
          <Pause className="mr-2 h-5 w-5" /> Pause
        </Button>
      )}

      {cycles >= targetCycles && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 text-center"
        >
          <p className="text-2xl font-bold text-white mb-2">Well done!</p>
          <p className="text-white/80 mb-4">Your nervous system is more regulated now.</p>
          <Button
            onClick={onClose}
            className="bg-white text-[#5BB5B0] hover:bg-white/90 rounded-full"
          >
            Return to Dashboard
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}

export function RegulationTools({ onToolSelect, activeTool }: RegulationToolsProps) {
  const [selectedTool, setSelectedTool] = useState<ToolType | null>(activeTool || null);

  const handleToolClick = (tool: RegulationTool) => {
    setSelectedTool(tool.id);
    onToolSelect?.(tool);
  };

  return (
    <>
      {/* Tool selector */}
      <div className="bg-white rounded-3xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">Regulation Tools</h3>
            <p className="text-xs text-gray-500">Quick nervous system reset</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {tools.map((tool) => (
            <motion.button
              key={tool.id}
              onClick={() => handleToolClick(tool)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 rounded-2xl text-left transition-all"
              style={{ backgroundColor: `${tool.color}15` }}
            >
              <div
                className="h-10 w-10 rounded-xl flex items-center justify-center mb-2"
                style={{ backgroundColor: `${tool.color}25` }}
              >
                <tool.icon className="h-5 w-5" style={{ color: tool.color }} />
              </div>
              <p className="font-medium text-gray-900 text-sm">{tool.name}</p>
              <p className="text-xs text-gray-500">{tool.duration}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Active tool modal */}
      <AnimatePresence>
        {selectedTool === "breathing" && (
          <BreathingExercise onClose={() => setSelectedTool(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

export { tools };
export type { RegulationTool, ToolType };
