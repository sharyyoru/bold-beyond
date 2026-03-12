"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  ChevronRight, 
  ChevronLeft,
  Target,
  Heart,
  HelpCircle,
  History,
  Compass,
  Check,
  Sparkles,
  Brain,
  Save,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createAppClient } from "@/lib/supabase";

// Types
interface ToolStep {
  id: string;
  question: string;
  subQuestions?: string[];
  placeholder?: string;
  category?: string;
}

interface DeepToolProps {
  onClose: () => void;
  onComplete: (responses: Record<string, string>, insights: string[]) => void;
  userName?: string;
}

// ========================================
// SET OUTCOMES TOOL (14 Steps)
// ========================================
const setOutcomesSteps: ToolStep[] = [
  {
    id: "positive_statement",
    question: "What specifically do you want?",
    placeholder: "State your outcome in positive terms - what you want TO have, not what you want to avoid...",
    category: "Stated in the positive"
  },
  {
    id: "present_situation",
    question: "Where are you now?",
    placeholder: "Describe your current situation. Be present with it, feel into where you are right now...",
    category: "Specify present situation"
  },
  {
    id: "outcome_sensory",
    question: "What will you see, hear, and feel when you have it?",
    placeholder: "Describe the outcome as if it's happening now. Make it vivid and compelling...",
    category: "Specify the outcome"
  },
  {
    id: "evidence_procedure",
    question: "How will you know when you have it?",
    placeholder: "What specific evidence will tell you that you've achieved your outcome?",
    category: "Evidence procedure"
  },
  {
    id: "congruent_desire",
    question: "What will this outcome get for you or allow you to do?",
    placeholder: "Explore the deeper benefits and possibilities this outcome opens up...",
    category: "Congruently desirable"
  },
  {
    id: "self_initiated",
    question: "Is it self-initiated and self-maintained? Is it only for you?",
    placeholder: "Confirm that this outcome is within your control and is truly for you...",
    category: "Self-initiated"
  },
  {
    id: "context",
    question: "Where, when, how, and with whom do you want it?",
    placeholder: "Be specific about the context - the place, time, manner, and people involved...",
    category: "Appropriately contextualized"
  },
  {
    id: "resources_have",
    question: "What resources do you have now?",
    placeholder: "List your current skills, knowledge, connections, and assets...",
    category: "Resources"
  },
  {
    id: "resources_need",
    question: "What do you need to get your outcome?",
    placeholder: "Identify the gaps - what additional resources, skills, or support do you need?",
    category: "Resources"
  },
  {
    id: "prior_experience",
    question: "Have you ever had or done this before? Do you know anyone who has?",
    placeholder: "Draw on past experiences and role models...",
    category: "Resources"
  },
  {
    id: "act_as_if",
    question: "Can you act as if you have it?",
    placeholder: "Imagine stepping into having achieved this outcome. How would you behave?",
    category: "Resources"
  },
  {
    id: "ecology_purpose",
    question: "For what purpose do you want this?",
    placeholder: "Explore the higher purpose behind this outcome...",
    category: "Ecology"
  },
  {
    id: "ecology_consequences",
    question: "What will you gain or lose if you have it? What will happen and what won't happen?",
    subQuestions: [
      "What will you gain if you have it?",
      "What will you lose if you have it?",
      "What will happen if you get it?",
      "What won't happen if you get it?",
      "What will happen if you don't get it?",
      "What won't happen if you don't get it?"
    ],
    placeholder: "Explore all the ecological consequences thoroughly...",
    category: "Ecology"
  },
  {
    id: "multiple_paths",
    question: "What are multiple ways you could achieve this outcome?",
    placeholder: "Generate at least 2-3 different paths to your outcome...",
    category: "Multiple pathways"
  },
];

export function SetOutcomesTool({ onClose, onComplete, userName }: DeepToolProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const startTime = useState(() => Date.now())[0];

  const currentQuestion = setOutcomesSteps[currentStep];
  const progress = ((currentStep + 1) / setOutcomesSteps.length) * 100;

  const handleNext = () => {
    if (currentStep < setOutcomesSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsSaving(true);
    const duration = Math.floor((Date.now() - startTime) / 1000);
    
    // Generate insights from responses
    const insights: string[] = [];
    if (responses.positive_statement) {
      insights.push(`Your core outcome: "${responses.positive_statement.slice(0, 100)}..."`);
    }
    if (responses.ecology_purpose) {
      insights.push(`Purpose: ${responses.ecology_purpose.slice(0, 80)}...`);
    }

    try {
      const supabase = createAppClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await fetch('/api/regulation-tools', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            toolType: 'set_outcomes',
            toolName: 'Set Outcomes',
            responses,
            completedSteps: setOutcomesSteps.length,
            totalSteps: setOutcomesSteps.length,
            isComplete: true,
            duration,
            insights,
          })
        });
      }
    } catch (error) {
      console.error('Error saving session:', error);
    }

    setIsSaving(false);
    onComplete(responses, insights);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-gradient-to-br from-[#1B365D] via-[#2A4A7F] to-[#0D9488] flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Target className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-white font-semibold">Set Outcomes</h2>
            <p className="text-white/60 text-xs">{currentQuestion.category}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <X className="h-5 w-5 text-white" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="px-4 pt-4">
        <div className="flex justify-between text-xs text-white/60 mb-2">
          <span>Step {currentStep + 1} of {setOutcomesSteps.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-[#5BB5B0] to-[#0D9488]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-bold text-white leading-relaxed">
            {currentQuestion.question}
          </h3>
          
          {currentQuestion.subQuestions && (
            <div className="space-y-1 text-white/70 text-sm">
              {currentQuestion.subQuestions.map((sq, i) => (
                <p key={i}>• {sq}</p>
              ))}
            </div>
          )}

          <Textarea
            value={responses[currentQuestion.id] || ""}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setResponses(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
            placeholder={currentQuestion.placeholder}
            className="min-h-[200px] bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-2xl p-4 text-base resize-none focus:border-[#5BB5B0] focus:ring-[#5BB5B0]"
          />
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="p-4 border-t border-white/10 flex justify-between gap-4">
        <Button
          onClick={handleBack}
          disabled={currentStep === 0}
          variant="ghost"
          className="text-white hover:bg-white/10 rounded-full px-6"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={!responses[currentQuestion.id]?.trim() || isSaving}
          className="bg-white text-[#1B365D] hover:bg-white/90 rounded-full px-8 flex-1 max-w-xs"
        >
          {isSaving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : currentStep === setOutcomesSteps.length - 1 ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Complete
            </>
          ) : (
            <>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}

// ========================================
// ELICIT VALUES TOOL (3 Steps)
// ========================================
const elicitValuesSteps: ToolStep[] = [
  {
    id: "direct_values",
    question: "What's important to you about this area of life?",
    subQuestions: [
      "What's important to you about this?",
      "What else is important?",
      "And what else?"
    ],
    placeholder: "List everything that's important to you. Keep asking 'what else?' until you feel complete...",
    category: "Direct elicitation"
  },
  {
    id: "motivation_state",
    question: "Remember a time when you were totally motivated in this context...",
    subQuestions: [
      "Go inside your body, looking through your own eyes",
      "See what you saw, hear what you heard",
      "Feel the feelings of motivation right now",
      "What was the feeling that was there, just before you got so motivated?"
    ],
    placeholder: "Describe the state and feeling that preceded your motivation...",
    category: "Motivation elicitation"
  },
  {
    id: "threshold_values",
    question: "With all these values present, what could spoil it? And what would make it even better?",
    subQuestions: [
      "What could we add that would spoil this context?",
      "What would make it better still, despite that away-from value?"
    ],
    placeholder: "Explore both what would diminish this and what would enhance it beyond...",
    category: "Threshold elicitation"
  },
];

export function ElicitValuesTool({ onClose, onComplete, userName }: DeepToolProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const startTime = useState(() => Date.now())[0];

  const currentQuestion = elicitValuesSteps[currentStep];
  const progress = ((currentStep + 1) / elicitValuesSteps.length) * 100;

  const handleNext = () => {
    if (currentStep < elicitValuesSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsSaving(true);
    const duration = Math.floor((Date.now() - startTime) / 1000);
    
    const insights: string[] = [];
    if (responses.direct_values) {
      const values = responses.direct_values.split('\n').filter(v => v.trim()).slice(0, 3);
      insights.push(`Core values identified: ${values.join(', ')}`);
    }

    try {
      const supabase = createAppClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await fetch('/api/regulation-tools', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            toolType: 'elicit_values',
            toolName: 'Elicit Values',
            responses,
            completedSteps: elicitValuesSteps.length,
            totalSteps: elicitValuesSteps.length,
            isComplete: true,
            duration,
            insights,
          })
        });
      }
    } catch (error) {
      console.error('Error saving session:', error);
    }

    setIsSaving(false);
    onComplete(responses, insights);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-gradient-to-br from-[#8B7355] via-[#A08060] to-[#5BB5B0] flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Heart className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-white font-semibold">Elicit Values</h2>
            <p className="text-white/60 text-xs">{currentQuestion.category}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <X className="h-5 w-5 text-white" />
        </button>
      </div>

      {/* Progress */}
      <div className="px-4 pt-4">
        <div className="flex justify-between text-xs text-white/60 mb-2">
          <span>Step {currentStep + 1} of {elicitValuesSteps.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-white/60 to-white"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-bold text-white leading-relaxed">
            {currentQuestion.question}
          </h3>
          
          {currentQuestion.subQuestions && (
            <div className="space-y-1 text-white/70 text-sm">
              {currentQuestion.subQuestions.map((sq, i) => (
                <p key={i}>• {sq}</p>
              ))}
            </div>
          )}

          <Textarea
            value={responses[currentQuestion.id] || ""}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setResponses(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
            placeholder={currentQuestion.placeholder}
            className="min-h-[200px] bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-2xl p-4 text-base resize-none focus:border-white/50"
          />
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="p-4 border-t border-white/10 flex justify-between gap-4">
        <Button
          onClick={handleBack}
          disabled={currentStep === 0}
          variant="ghost"
          className="text-white hover:bg-white/10 rounded-full px-6"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={!responses[currentQuestion.id]?.trim() || isSaving}
          className="bg-white text-[#8B7355] hover:bg-white/90 rounded-full px-8 flex-1 max-w-xs"
        >
          {isSaving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : currentStep === elicitValuesSteps.length - 1 ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Complete
            </>
          ) : (
            <>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}

// ========================================
// DRIVING QUESTION TOOL (6 Steps)
// ========================================
const drivingQuestionSteps: ToolStep[] = [
  {
    id: "main_focus",
    question: "What is your main focus in life? What is your Driving Question?",
    subQuestions: [
      "What do you constantly focus on?",
      "If you were to have one question, what do you consistently ask yourself?",
      "What is this question?"
    ],
    placeholder: "Discover the question that drives your thoughts and actions...",
    category: "Identify the question"
  },
  {
    id: "beliefs_behind",
    question: "What are the most powerful beliefs that cause you to ask this question?",
    placeholder: "Explore the beliefs that have shaped this driving question...",
    category: "Underlying beliefs"
  },
  {
    id: "positive_intent",
    question: "What is the positive intention behind your Driving Question?",
    subQuestions: [
      "How would achieving its aim impact you positively?",
      "How would it impact others positively?",
      "How would it empower you?",
      "How would you feel?"
    ],
    placeholder: "Explore all the positive intentions and impacts...",
    category: "Positive intent"
  },
  {
    id: "not_achieving_impact",
    question: "What do you believe is the impact of NOT achieving your Driving Question's aim?",
    subQuestions: [
      "On you emotionally?",
      "On people around you?"
    ],
    placeholder: "Honestly explore the perceived costs of not achieving this...",
    category: "Away-from motivation"
  },
  {
    id: "failure_consequences",
    question: "What would happen if you failed to achieve the aim of your Driving Question?",
    subQuestions: [
      "What would it mean?",
      "What would you lose?",
      "How would you feel?",
      "If you lived your life like that, what would ultimately happen?"
    ],
    placeholder: "Go deep into the consequences of failure...",
    category: "Failure analysis"
  },
  {
    id: "question_evaluation",
    question: "How does your Driving Question serve you? What would you change?",
    subQuestions: [
      "What are the benefits of how you formatted this question?",
      "What does it presuppose?",
      "Does it create positive emotions?",
      "Does it invite doubts or negative emotions?",
      "Is there anything you could change or add to make it better?"
    ],
    placeholder: "Evaluate and potentially reformulate your driving question...",
    category: "Question reformation"
  },
];

export function DrivingQuestionTool({ onClose, onComplete, userName }: DeepToolProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const startTime = useState(() => Date.now())[0];

  const currentQuestion = drivingQuestionSteps[currentStep];
  const progress = ((currentStep + 1) / drivingQuestionSteps.length) * 100;

  const handleNext = () => {
    if (currentStep < drivingQuestionSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsSaving(true);
    const duration = Math.floor((Date.now() - startTime) / 1000);
    
    const insights: string[] = [];
    if (responses.main_focus) {
      insights.push(`Driving Question: "${responses.main_focus.slice(0, 100)}"`);
    }
    if (responses.question_evaluation) {
      insights.push(`Reformation insight: ${responses.question_evaluation.slice(0, 80)}`);
    }

    try {
      const supabase = createAppClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await fetch('/api/regulation-tools', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            toolType: 'driving_question',
            toolName: 'Driving Question',
            responses,
            completedSteps: drivingQuestionSteps.length,
            totalSteps: drivingQuestionSteps.length,
            isComplete: true,
            duration,
            insights,
          })
        });
      }
    } catch (error) {
      console.error('Error saving session:', error);
    }

    setIsSaving(false);
    onComplete(responses, insights);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-gradient-to-br from-[#6B9BC3] via-[#5B8AB3] to-[#1B365D] flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
            <HelpCircle className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-white font-semibold">Driving Question</h2>
            <p className="text-white/60 text-xs">{currentQuestion.category}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"
        >
          <X className="h-5 w-5 text-white" />
        </button>
      </div>

      {/* Progress */}
      <div className="px-4 pt-4">
        <div className="flex justify-between text-xs text-white/60 mb-2">
          <span>Step {currentStep + 1} of {drivingQuestionSteps.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-white/60 to-white"
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-bold text-white leading-relaxed">
            {currentQuestion.question}
          </h3>
          
          {currentQuestion.subQuestions && (
            <div className="space-y-1 text-white/70 text-sm">
              {currentQuestion.subQuestions.map((sq, i) => (
                <p key={i}>• {sq}</p>
              ))}
            </div>
          )}

          <Textarea
            value={responses[currentQuestion.id] || ""}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setResponses(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
            placeholder={currentQuestion.placeholder}
            className="min-h-[200px] bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-2xl p-4 text-base resize-none"
          />
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="p-4 border-t border-white/10 flex justify-between gap-4">
        <Button
          onClick={handleBack}
          disabled={currentStep === 0}
          variant="ghost"
          className="text-white hover:bg-white/10 rounded-full px-6"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={!responses[currentQuestion.id]?.trim() || isSaving}
          className="bg-white text-[#6B9BC3] hover:bg-white/90 rounded-full px-8 flex-1 max-w-xs"
        >
          {isSaving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : currentStep === drivingQuestionSteps.length - 1 ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Complete
            </>
          ) : (
            <>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}

// ========================================
// THE WANT TOOL (6 Ecology Questions)
// ========================================
const theWantSteps: ToolStep[] = [
  {
    id: "purpose",
    question: "For what purpose do you want this?",
    placeholder: "Explore the deeper purpose behind what you want...",
    category: "Purpose"
  },
  {
    id: "gain_lose",
    question: "What will you gain or lose if you have it?",
    placeholder: "Consider both what you'll gain AND what you might lose...",
    category: "Gains & Losses"
  },
  {
    id: "will_happen",
    question: "What will happen if you get it?",
    placeholder: "Project forward - what unfolds when you achieve this?",
    category: "Positive consequences"
  },
  {
    id: "wont_happen_if_get",
    question: "What won't happen if you get it?",
    placeholder: "What possibilities close when you achieve this?",
    category: "Opportunity cost"
  },
  {
    id: "will_happen_if_dont",
    question: "What will happen if you don't get it?",
    placeholder: "What unfolds if you don't achieve this?",
    category: "Alternative future"
  },
  {
    id: "wont_happen_if_dont",
    question: "What won't happen if you don't get it?",
    placeholder: "What won't occur if you don't achieve this?",
    category: "Hidden benefits"
  },
];

export function TheWantTool({ onClose, onComplete, userName }: DeepToolProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const startTime = useState(() => Date.now())[0];

  const currentQuestion = theWantSteps[currentStep];
  const progress = ((currentStep + 1) / theWantSteps.length) * 100;

  const handleNext = () => {
    if (currentStep < theWantSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsSaving(true);
    const duration = Math.floor((Date.now() - startTime) / 1000);
    
    const insights: string[] = [];
    if (responses.purpose) {
      insights.push(`Purpose: ${responses.purpose.slice(0, 80)}`);
    }

    try {
      const supabase = createAppClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await fetch('/api/regulation-tools', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            toolType: 'the_want',
            toolName: 'The Want',
            responses,
            completedSteps: theWantSteps.length,
            totalSteps: theWantSteps.length,
            isComplete: true,
            duration,
            insights,
          })
        });
      }
    } catch (error) {
      console.error('Error saving session:', error);
    }

    setIsSaving(false);
    onComplete(responses, insights);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-gradient-to-br from-[#E8A87C] via-[#D4956A] to-[#C17767] flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Compass className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-white font-semibold">The Want</h2>
            <p className="text-white/60 text-xs">{currentQuestion.category}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"
        >
          <X className="h-5 w-5 text-white" />
        </button>
      </div>

      {/* Progress */}
      <div className="px-4 pt-4">
        <div className="flex justify-between text-xs text-white/60 mb-2">
          <span>Step {currentStep + 1} of {theWantSteps.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-white/60 to-white"
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-bold text-white leading-relaxed">
            {currentQuestion.question}
          </h3>

          <Textarea
            value={responses[currentQuestion.id] || ""}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setResponses(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
            placeholder={currentQuestion.placeholder}
            className="min-h-[200px] bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-2xl p-4 text-base resize-none"
          />
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="p-4 border-t border-white/10 flex justify-between gap-4">
        <Button
          onClick={handleBack}
          disabled={currentStep === 0}
          variant="ghost"
          className="text-white hover:bg-white/10 rounded-full px-6"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={!responses[currentQuestion.id]?.trim() || isSaving}
          className="bg-white text-[#E8A87C] hover:bg-white/90 rounded-full px-8 flex-1 max-w-xs"
        >
          {isSaving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : currentStep === theWantSteps.length - 1 ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Complete
            </>
          ) : (
            <>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}

// ========================================
// PERSONAL HISTORY TOOL (23 Steps - Chunked)
// ========================================
const personalHistorySteps: ToolStep[] = [
  { id: "why_here", question: "Why are you here? Why else? Why else?", placeholder: "Explore all the reasons that brought you to this moment...", category: "Present context" },
  { id: "problem_awareness", question: "How do you know you have this problem? How is that a problem?", placeholder: "Describe how you recognize this issue and why it's problematic...", category: "Problem identification" },
  { id: "problem_mechanism", question: "How do you do it? When do you do it?", placeholder: "Describe the pattern - how and when does this show up?", category: "Pattern recognition" },
  { id: "duration", question: "How long have you had it? Was there ever a time when you didn't?", placeholder: "Trace the timeline of this issue...", category: "Timeline" },
  { id: "first_time", question: "What happened the first time you had this? What emotions were present?", placeholder: "Go back to the origin - what was happening then?", category: "Origin" },
  { id: "subsequent_events", question: "What events have happened since? What emotions were present?", placeholder: "Trace the significant events that reinforced this pattern...", category: "Pattern reinforcement" },
  { id: "event_relationship", question: "What is the relationship between these events and your current situation?", placeholder: "Connect the dots between past and present...", category: "Connections" },
  { id: "family_relationship", question: "Tell me about your parents, siblings. What is their relationship to your current situation?", placeholder: "Explore family dynamics and their influence...", category: "Family system" },
  { id: "childhood", question: "Tell me about your childhood in relationship to this problem.", placeholder: "What childhood experiences connect to this?", category: "Childhood" },
  { id: "purpose_reason", question: "Is there a purpose or reason for this problem? Ask your unconscious mind.", placeholder: "What might be the hidden purpose of this issue?", category: "Purpose" },
  { id: "choice_point", question: "When did you choose to have this situation created? Why?", placeholder: "Identify the choice point - even if unconscious...", category: "Decision point" },
  { id: "unconscious_message", question: "Is there anything your unconscious mind wants you to know that would allow the problem to disappear?", placeholder: "Listen for the message from within...", category: "Unconscious wisdom" },
  { id: "unconscious_support", question: "Is it OK with your unconscious mind to support clearing this problem today?", placeholder: "Get permission from your unconscious...", category: "Permission" },
  { id: "evidence_cleared", question: "How will you know when this problem has totally disappeared?", placeholder: "Describe the evidence of resolution...", category: "Evidence" },
  { id: "confirmation", question: "When we get rid of this, will the presenting problem totally disappear?", placeholder: "Confirm the completeness of resolution...", category: "Confirmation" },
  { id: "must_do", question: "What do you need to do that you don't want to do?", placeholder: "Identify the avoided actions...", category: "Resistance" },
  { id: "secret", question: "What is it about this problem that you cannot tell anyone?", placeholder: "If safe, explore what's hidden...", category: "Hidden aspects" },
  { id: "related_problems", question: "What is the relationship between this problem and problems in other areas of your life?", placeholder: "See the systemic connections...", category: "Systems" },
  { id: "blockers", question: "Will any of those problems stop you from solving this problem?", placeholder: "Identify potential blockers...", category: "Obstacles" },
  { id: "specific_evidence", question: "How will you know specifically that the problem is gone?", placeholder: "Be very specific about the evidence...", category: "Specific evidence" },
  { id: "cause_effect", question: "When did you choose to have these symptoms? Why did your unconscious create this?", placeholder: "Explore secondary gain and purpose...", category: "Cause & effect" },
  { id: "models", question: "Who did you model in youth? Who did you model your life on?", placeholder: "Identify your early role models...", category: "Modeling" },
  { id: "willingness", question: "What are you willing to do to have this problem disappear? Are you willing to do ANYTHING?", placeholder: "Assess your true commitment to change...", category: "Commitment" },
];

export function PersonalHistoryTool({ onClose, onComplete, userName }: DeepToolProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const startTime = useState(() => Date.now())[0];

  const currentQuestion = personalHistorySteps[currentStep];
  const progress = ((currentStep + 1) / personalHistorySteps.length) * 100;

  const handleNext = () => {
    if (currentStep < personalHistorySteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsSaving(true);
    const duration = Math.floor((Date.now() - startTime) / 1000);
    
    const insights: string[] = [];
    const completedCount = Object.keys(responses).filter(k => responses[k]?.trim()).length;
    insights.push(`Completed ${completedCount} deep exploration questions`);
    if (responses.purpose_reason) {
      insights.push(`Purpose insight: ${responses.purpose_reason.slice(0, 60)}...`);
    }

    try {
      const supabase = createAppClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await fetch('/api/regulation-tools', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            toolType: 'personal_history',
            toolName: 'Personal History',
            responses,
            completedSteps: personalHistorySteps.length,
            totalSteps: personalHistorySteps.length,
            isComplete: true,
            duration,
            insights,
          })
        });
      }
    } catch (error) {
      console.error('Error saving session:', error);
    }

    setIsSaving(false);
    onComplete(responses, insights);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-gradient-to-br from-[#1B365D] via-[#2D4A6F] to-[#8B7355] flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
            <History className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-white font-semibold">Personal History</h2>
            <p className="text-white/60 text-xs">{currentQuestion.category}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"
        >
          <X className="h-5 w-5 text-white" />
        </button>
      </div>

      {/* Progress */}
      <div className="px-4 pt-4">
        <div className="flex justify-between text-xs text-white/60 mb-2">
          <span>Step {currentStep + 1} of {personalHistorySteps.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-[#5BB5B0] to-[#E8A87C]"
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-bold text-white leading-relaxed">
            {currentQuestion.question}
          </h3>

          <Textarea
            value={responses[currentQuestion.id] || ""}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setResponses(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
            placeholder={currentQuestion.placeholder}
            className="min-h-[200px] bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-2xl p-4 text-base resize-none"
          />
          
          {/* Skip option for sensitive questions */}
          <p className="text-white/40 text-xs text-center">
            Take your time. You can skip or return to any question.
          </p>
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="p-4 border-t border-white/10 flex justify-between gap-4">
        <Button
          onClick={handleBack}
          disabled={currentStep === 0}
          variant="ghost"
          className="text-white hover:bg-white/10 rounded-full px-6"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={isSaving}
          className="bg-white text-[#1B365D] hover:bg-white/90 rounded-full px-8 flex-1 max-w-xs"
        >
          {isSaving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : currentStep === personalHistorySteps.length - 1 ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Complete
            </>
          ) : (
            <>
              {responses[currentQuestion.id]?.trim() ? 'Next' : 'Skip'}
              <ChevronRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}

// ========================================
// COMPLETION SCREEN
// ========================================
export function ToolCompletionScreen({ 
  toolName, 
  insights, 
  onClose,
  accentColor = "#5BB5B0"
}: { 
  toolName: string; 
  insights: string[]; 
  onClose: () => void;
  accentColor?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6"
      style={{ background: `linear-gradient(to bottom right, ${accentColor}, ${accentColor}dd)` }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="h-24 w-24 rounded-full bg-white/20 flex items-center justify-center mb-6"
      >
        <Sparkles className="h-12 w-12 text-white" />
      </motion.div>
      
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-2xl font-bold text-white mb-2 text-center"
      >
        {toolName} Complete!
      </motion.h2>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-white/80 mb-6 text-center"
      >
        Your responses have been saved and your wellness score has been updated.
      </motion.p>

      {insights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/10 rounded-2xl p-4 mb-6 w-full max-w-sm"
        >
          <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Key Insights
          </h3>
          <ul className="space-y-1">
            {insights.map((insight, i) => (
              <li key={i} className="text-white/70 text-sm">• {insight}</li>
            ))}
          </ul>
        </motion.div>
      )}

      <Button
        onClick={onClose}
        className="bg-white text-gray-900 hover:bg-white/90 rounded-full px-8 py-3"
      >
        Return to Dashboard
      </Button>
    </motion.div>
  );
}

// Export all tools
export const deepRegulationTools = {
  set_outcomes: { name: "Set Outcomes", component: SetOutcomesTool, steps: 14, color: "#1B365D", icon: Target },
  elicit_values: { name: "Elicit Values", component: ElicitValuesTool, steps: 3, color: "#8B7355", icon: Heart },
  driving_question: { name: "Driving Question", component: DrivingQuestionTool, steps: 6, color: "#6B9BC3", icon: HelpCircle },
  personal_history: { name: "Personal History", component: PersonalHistoryTool, steps: 23, color: "#1B365D", icon: History },
  the_want: { name: "The Want", component: TheWantTool, steps: 6, color: "#E8A87C", icon: Compass },
};
