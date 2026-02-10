"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, ArrowRight, X, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createAppClient } from "@/lib/supabase";

// Voice intake prompts - conversational, non-linear
const intakePrompts = [
  {
    id: "welcome",
    prompt: "Welcome. Take a breath. There are no right or wrong answers here.",
    subtext: "This is just for you.",
    duration: 4000,
    isIntro: true,
  },
  {
    id: "feeling",
    prompt: "How are you really feeling right now?",
    subtext: "Speak freely. Take your time.",
    listenFor: ["stress", "tired", "anxious", "good", "fine", "overwhelmed", "happy", "sad"],
  },
  {
    id: "sleep",
    prompt: "Tell me about your sleep lately.",
    subtext: "Quality, not just quantity.",
    listenFor: ["hours", "restless", "deep", "dreams", "insomnia", "tired"],
  },
  {
    id: "energy",
    prompt: "Where does your energy go during the day?",
    subtext: "What drains you? What fills you?",
    listenFor: ["work", "family", "exercise", "nothing", "everything", "meetings"],
  },
  {
    id: "needs",
    prompt: "What do you need most right now?",
    subtext: "Not what you should need. What you actually need.",
    listenFor: ["rest", "clarity", "support", "motivation", "peace", "energy", "help"],
  },
  {
    id: "closing",
    prompt: "Thank you for sharing.",
    subtext: "Your Human OS is now calibrating...",
    duration: 3000,
    isOutro: true,
  },
];

// Breathing animation component
function BreathingOrb({ isListening, isPulsing }: { isListening: boolean; isPulsing: boolean }) {
  return (
    <div className="relative h-48 w-48">
      {/* Outer glow */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-[#5BB5B0]/30 to-[#6B9BC3]/30"
        animate={{
          scale: isPulsing ? [1, 1.2, 1] : 1,
          opacity: isPulsing ? [0.3, 0.6, 0.3] : 0.3,
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Middle ring */}
      <motion.div
        className="absolute inset-4 rounded-full bg-gradient-to-br from-[#5BB5B0]/50 to-[#6B9BC3]/50"
        animate={{
          scale: isPulsing ? [1, 1.1, 1] : 1,
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />
      
      {/* Center orb */}
      <motion.div
        className={`absolute inset-8 rounded-full flex items-center justify-center ${
          isListening 
            ? "bg-gradient-to-br from-[#5BB5B0] to-[#4A9A96]" 
            : "bg-gradient-to-br from-[#6B9BC3] to-[#5A8AB2]"
        }`}
        animate={{
          scale: isListening ? [1, 1.05, 1] : 1,
        }}
        transition={{
          duration: 1,
          repeat: isListening ? Infinity : 0,
          ease: "easeInOut",
        }}
      >
        {isListening ? (
          <Mic className="h-12 w-12 text-white" />
        ) : (
          <Volume2 className="h-12 w-12 text-white" />
        )}
      </motion.div>
      
      {/* Listening indicator rings */}
      {isListening && (
        <>
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-[#5BB5B0]"
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-[#5BB5B0]"
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
          />
        </>
      )}
    </div>
  );
}

export default function IntakePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [alignmentScore, setAlignmentScore] = useState(0);
  const recognitionRef = useRef<any>(null);

  const currentPrompt = intakePrompts[currentStep];
  const progress = ((currentStep + 1) / intakePrompts.length) * 100;

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(prev => prev + " " + finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Auto-advance for intro/outro prompts
  useEffect(() => {
    if (currentPrompt?.isIntro || currentPrompt?.isOutro) {
      const timer = setTimeout(() => {
        if (currentPrompt.isOutro) {
          processIntake();
        } else {
          handleNext();
        }
      }, currentPrompt.duration);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const startListening = () => {
    if (recognitionRef.current) {
      setTranscript("");
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      
      // Save response
      if (transcript.trim()) {
        setResponses(prev => ({
          ...prev,
          [currentPrompt.id]: transcript.trim(),
        }));
      }
    }
  };

  const handleNext = () => {
    stopListening();
    if (currentStep < intakePrompts.length - 1) {
      setCurrentStep(currentStep + 1);
      setTranscript("");
    }
  };

  const handleSkip = () => {
    stopListening();
    handleNext();
  };

  const processIntake = async () => {
    setIsProcessing(true);
    
    // Analyze responses and calculate alignment score
    // This would connect to the AI analysis backend
    try {
      const supabase = createAppClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      // Calculate basic alignment score from responses
      let score = 50; // Base score
      
      // Analyze sentiment (simplified - in production, use AI)
      const allText = Object.values(responses).join(" ").toLowerCase();
      
      if (allText.includes("good") || allText.includes("great") || allText.includes("happy")) {
        score += 15;
      }
      if (allText.includes("stressed") || allText.includes("anxious") || allText.includes("overwhelmed")) {
        score -= 10;
      }
      if (allText.includes("tired") || allText.includes("exhausted")) {
        score -= 5;
      }
      if (allText.includes("rest") || allText.includes("peace") || allText.includes("clarity")) {
        score += 5; // Self-awareness bonus
      }
      
      // Normalize score
      score = Math.max(20, Math.min(95, score));
      setAlignmentScore(score);
      
      if (user) {
        // Save intake data
        await supabase.from("voice_intakes").insert({
          user_id: user.id,
          responses: responses,
          alignment_score: score,
          created_at: new Date().toISOString(),
        });
        
        // Update user profile
        await supabase.from("profiles").update({
          alignment_score: score,
          intake_completed: true,
          last_assessment: new Date().toISOString(),
        }).eq("id", user.id);
      }
      
      setAnalysisComplete(true);
    } catch (error) {
      console.error("Error processing intake:", error);
      setAlignmentScore(65);
      setAnalysisComplete(true);
    } finally {
      setIsProcessing(false);
    }
  };

  // Processing/Results screen
  if (isProcessing || analysisComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1B365D] to-[#0D9488] flex flex-col items-center justify-center px-6">
        {/* Subtle pattern */}
        <div 
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: "url('/assets/b&b-pattern.svg')",
            backgroundSize: "100px",
          }}
        />
        
        <div className="relative z-10 text-center">
          {isProcessing ? (
            <>
              <motion.div
                className="h-32 w-32 mx-auto mb-8 rounded-full border-4 border-white/20 border-t-white"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <h2 className="text-2xl font-bold text-white mb-2">Calibrating Your Human OS</h2>
              <p className="text-white/70">Analyzing patterns and building your profile...</p>
            </>
          ) : (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="mb-8"
              >
                <Image
                  src="/assets/mandala-orange.svg"
                  alt="Human OS"
                  width={80}
                  height={80}
                  className="mx-auto mb-4"
                />
                <div className="h-40 w-40 mx-auto rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-5xl font-bold text-white">{alignmentScore}</p>
                    <p className="text-sm text-white/70">Alignment Score™</p>
                  </div>
                </div>
              </motion.div>
              
              <h2 className="text-2xl font-bold text-white mb-2">Your OS is Ready</h2>
              <p className="text-white/70 mb-8 max-w-xs mx-auto">
                {alignmentScore >= 70 
                  ? "You're in a good place. Let's maintain your balance."
                  : alignmentScore >= 50
                  ? "There's room for alignment. Let's work together."
                  : "Your system needs attention. We're here to help."}
              </p>
              
              <Button
                onClick={() => router.push("/appx/human-os")}
                className="bg-white text-[#1B365D] hover:bg-white/90 rounded-full px-8 py-6 text-lg font-semibold"
              >
                Enter Your Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1B365D] to-[#0D9488] flex flex-col">
      {/* Subtle breathing background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-[#1B365D]/50 to-[#0D9488]/50"
        animate={{
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Close button */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => router.back()}
          className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center"
        >
          <X className="h-5 w-5 text-white" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="absolute top-4 left-4 right-16 z-20">
        <div className="h-1 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-white rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Image
            src="/assets/mandala-orange.svg"
            alt="Human OS"
            width={48}
            height={48}
          />
        </motion.div>

        {/* Breathing orb */}
        <BreathingOrb 
          isListening={isListening} 
          isPulsing={!isListening && !currentPrompt?.isIntro && !currentPrompt?.isOutro} 
        />

        {/* Prompt text */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center mt-8 mb-8"
          >
            <h1 className="text-2xl font-bold text-white mb-3 max-w-xs mx-auto">
              {currentPrompt.prompt}
            </h1>
            <p className="text-white/60 text-sm">
              {currentPrompt.subtext}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Transcript display */}
        {transcript && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/10 backdrop-blur rounded-2xl p-4 mb-6 max-w-sm"
          >
            <p className="text-white/80 text-sm italic">"{transcript}"</p>
          </motion.div>
        )}

        {/* Controls */}
        {!currentPrompt?.isIntro && !currentPrompt?.isOutro && (
          <div className="flex items-center gap-4">
            {!isListening ? (
              <Button
                onClick={startListening}
                className="bg-white text-[#1B365D] hover:bg-white/90 rounded-full px-8 py-6 text-lg font-semibold"
              >
                <Mic className="mr-2 h-5 w-5" />
                Start Speaking
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="bg-[#5BB5B0] text-white hover:bg-[#4A9A96] rounded-full px-8 py-6 text-lg font-semibold"
              >
                Done
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
          </div>
        )}

        {/* Skip option */}
        {!currentPrompt?.isIntro && !currentPrompt?.isOutro && !isListening && (
          <button
            onClick={handleSkip}
            className="mt-4 text-white/50 text-sm hover:text-white/70 transition-colors"
          >
            Skip this question
          </button>
        )}
      </div>
    </div>
  );
}
