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

// 5-4-3-2-1 Grounding Exercise
function GroundingExercise({ onClose }: { onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const steps = [
    { count: 5, sense: "SEE", instruction: "Name 5 things you can see around you", color: "#6B9BC3" },
    { count: 4, sense: "TOUCH", instruction: "Name 4 things you can physically feel", color: "#5BB5B0" },
    { count: 3, sense: "HEAR", instruction: "Name 3 things you can hear right now", color: "#8B7355" },
    { count: 2, sense: "SMELL", instruction: "Name 2 things you can smell", color: "#E8A87C" },
    { count: 1, sense: "TASTE", instruction: "Name 1 thing you can taste", color: "#C17767" },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsComplete(true);
    }
  };

  const current = steps[currentStep];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: `linear-gradient(to bottom, ${current.color}, ${current.color}dd)` }}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/20 flex items-center justify-center"
      >
        <X className="h-5 w-5 text-white" />
      </button>

      <div className="absolute top-4 left-4 text-white/60 text-sm">
        Step {currentStep + 1} of {steps.length}
      </div>

      {!isComplete ? (
        <>
          <motion.div
            key={currentStep}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <div className="h-32 w-32 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6">
              <span className="text-6xl font-bold text-white">{current.count}</span>
            </div>
            <p className="text-2xl font-bold text-white mb-2">{current.sense}</p>
            <p className="text-white/80 text-lg mb-8 max-w-xs mx-auto px-4">
              {current.instruction}
            </p>
          </motion.div>

          <Button
            onClick={handleNext}
            className="bg-white text-gray-900 hover:bg-white/90 rounded-full px-8 py-6 text-lg font-semibold"
          >
            {currentStep < steps.length - 1 ? "Next" : "Complete"}
          </Button>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
            <Eye className="h-10 w-10 text-white" />
          </div>
          <p className="text-2xl font-bold text-white mb-2">You're grounded!</p>
          <p className="text-white/80 mb-6">You're back in the present moment.</p>
          <Button
            onClick={onClose}
            className="bg-white text-gray-900 hover:bg-white/90 rounded-full"
          >
            Return to Dashboard
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}

// EFT Tapping Exercise
function TappingExercise({ onClose }: { onClose: () => void }) {
  const [currentPoint, setCurrentPoint] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [rounds, setRounds] = useState(0);
  const targetRounds = 2;

  const tappingPoints = [
    { name: "Karate Chop", instruction: "Tap the side of your hand", duration: 5 },
    { name: "Eyebrow", instruction: "Tap the inner edge of your eyebrow", duration: 5 },
    { name: "Side of Eye", instruction: "Tap the bone beside your eye", duration: 5 },
    { name: "Under Eye", instruction: "Tap the bone under your eye", duration: 5 },
    { name: "Under Nose", instruction: "Tap between nose and upper lip", duration: 5 },
    { name: "Chin", instruction: "Tap the crease between lip and chin", duration: 5 },
    { name: "Collarbone", instruction: "Tap just below your collarbone", duration: 5 },
    { name: "Under Arm", instruction: "Tap about 4 inches below armpit", duration: 5 },
    { name: "Top of Head", instruction: "Tap the crown of your head", duration: 5 },
  ];

  const handleNext = () => {
    if (currentPoint < tappingPoints.length - 1) {
      setCurrentPoint(currentPoint + 1);
    } else {
      if (rounds + 1 >= targetRounds) {
        setIsComplete(true);
      } else {
        setRounds(rounds + 1);
        setCurrentPoint(0);
      }
    }
  };

  const current = tappingPoints[currentPoint];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-gradient-to-b from-[#8B7355] to-[#6B5344] flex flex-col items-center justify-center"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/20 flex items-center justify-center"
      >
        <X className="h-5 w-5 text-white" />
      </button>

      <div className="absolute top-4 left-4 text-white/60 text-sm">
        Round {rounds + 1} of {targetRounds} • Point {currentPoint + 1}/{tappingPoints.length}
      </div>

      {!isComplete ? (
        <>
          <motion.div
            key={`${rounds}-${currentPoint}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <motion.div
              className="h-24 w-24 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <Hand className="h-12 w-12 text-white" />
            </motion.div>
            <p className="text-2xl font-bold text-white mb-2">{current.name}</p>
            <p className="text-white/80 text-lg mb-4 max-w-xs mx-auto px-4">
              {current.instruction}
            </p>
            <p className="text-white/60 text-sm mb-8">Tap 5-7 times while breathing deeply</p>
          </motion.div>

          <Button
            onClick={handleNext}
            className="bg-white text-[#8B7355] hover:bg-white/90 rounded-full px-8 py-6 text-lg font-semibold"
          >
            Next Point
          </Button>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
            <Hand className="h-10 w-10 text-white" />
          </div>
          <p className="text-2xl font-bold text-white mb-2">Tension Released!</p>
          <p className="text-white/80 mb-6">Your energy is flowing more freely now.</p>
          <Button
            onClick={onClose}
            className="bg-white text-[#8B7355] hover:bg-white/90 rounded-full"
          >
            Return to Dashboard
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}

// Vagal Reset Exercise
function VagalResetExercise({ onClose }: { onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const steps = [
    { 
      name: "Cold Water", 
      instruction: "Splash cold water on your face or hold ice cubes", 
      duration: 15,
      tip: "This activates the dive reflex"
    },
    { 
      name: "Humming", 
      instruction: "Hum deeply for the full duration", 
      duration: 15,
      tip: "Vibrations stimulate the vagus nerve"
    },
    { 
      name: "Long Exhale", 
      instruction: "Breathe in for 4, out for 8 seconds", 
      duration: 24,
      tip: "Long exhales activate parasympathetic response"
    },
  ];

  const startStep = () => {
    const duration = steps[currentStep].duration;
    setCountdown(duration);
    
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
          } else {
            setIsComplete(true);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const current = steps[currentStep];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-gradient-to-b from-[#E8A87C] to-[#D4956A] flex flex-col items-center justify-center"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/20 flex items-center justify-center"
      >
        <X className="h-5 w-5 text-white" />
      </button>

      <div className="absolute top-4 left-4 text-white/60 text-sm">
        Step {currentStep + 1} of {steps.length}
      </div>

      {!isComplete ? (
        <>
          <motion.div
            key={currentStep}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            {countdown > 0 ? (
              <motion.div
                className="h-32 w-32 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-5xl font-bold text-white">{countdown}</span>
              </motion.div>
            ) : (
              <div className="h-32 w-32 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6">
                <Waves className="h-16 w-16 text-white" />
              </div>
            )}
            <p className="text-2xl font-bold text-white mb-2">{current.name}</p>
            <p className="text-white/80 text-lg mb-2 max-w-xs mx-auto px-4">
              {current.instruction}
            </p>
            <p className="text-white/60 text-sm mb-8">{current.tip}</p>
          </motion.div>

          {countdown === 0 && (
            <Button
              onClick={startStep}
              className="bg-white text-[#E8A87C] hover:bg-white/90 rounded-full px-8 py-6 text-lg font-semibold"
            >
              <Play className="mr-2 h-5 w-5" /> Start ({current.duration}s)
            </Button>
          )}
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
            <Waves className="h-10 w-10 text-white" />
          </div>
          <p className="text-2xl font-bold text-white mb-2">Vagus Activated!</p>
          <p className="text-white/80 mb-6">Your nervous system is resetting.</p>
          <Button
            onClick={onClose}
            className="bg-white text-[#E8A87C] hover:bg-white/90 rounded-full"
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
        {selectedTool === "grounding" && (
          <GroundingExercise onClose={() => setSelectedTool(null)} />
        )}
        {selectedTool === "tapping" && (
          <TappingExercise onClose={() => setSelectedTool(null)} />
        )}
        {selectedTool === "wave" && (
          <VagalResetExercise onClose={() => setSelectedTool(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

export { tools };
export type { RegulationTool, ToolType };
