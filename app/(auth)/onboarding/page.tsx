"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createSupabaseClient } from "@/lib/supabase";

// 5-question onboarding flow
const onboardingQuestions = [
  {
    id: 1,
    question: "What's your main wellness goal right now?",
    options: [
      "Engaging in mindfulness practices",
      "Exploring the benefits of meditation",
      "Incorporating yoga into daily routines",
      "Understanding the science behind stress reduction",
      "Developing a gratitude journaling habit",
    ],
  },
  {
    id: 2,
    question: "How often do you make time for self-care or relaxation?",
    options: [
      "Engaging in mindfulness practices",
      "Incorporating physical activity into daily routines",
      "Exploring creative hobbies for personal growth",
      "Establishing a consistent sleep schedule for better health",
    ],
  },
  {
    id: 3,
    question: "What kind of support are you most interested in?",
    options: [
      "Engaging in mindfulness practices",
      "Journaling thoughts and experiences",
      "Participating in peer support groups",
      "Reading self-help literature",
      "Exploring creative outlets like art or music",
    ],
  },
  {
    id: 4,
    question: "How do you usually manage stress?",
    options: [
      { label: "Struggling", emoji: "😔" },
      { label: "Unsure", emoji: "😐" },
      { label: "Content", emoji: "😊" },
      { label: "Thriving", emoji: "😄" },
    ],
  },
  {
    id: 5,
    question: "How are you feeling overall these days?",
    options: [
      { label: "Struggling", emoji: "😔" },
      { label: "Struggling", emoji: "😔" },
      { label: "Doing okay", emoji: "😐" },
      { label: "Feeling good", emoji: "😊" },
      { label: "Doing great", emoji: "😄" },
    ],
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const supabase = createSupabaseClient();
  const question = onboardingQuestions[currentQuestion];
  const isLastQuestion = currentQuestion === onboardingQuestions.length - 1;
  const progress = ((currentQuestion + 1) / onboardingQuestions.length) * 100;

  const handleOptionSelect = (option: string | { label: string; emoji: string }) => {
    const value = typeof option === "string" ? option : option.label;
    setSelectedOption(value);
  };

  const handleContinue = async () => {
    if (!selectedOption) return;

    const newAnswers = { ...answers, [question.id]: selectedOption };
    setAnswers(newAnswers);
    setSelectedOption(null);

    if (isLastQuestion) {
      // Save to database and go to calibrating page
      setIsSaving(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Save onboarding responses
          await supabase.from("onboarding_responses").upsert({
            user_id: user.id,
            wellness_goal: newAnswers[1],
            self_care_frequency: newAnswers[2],
            support_interest: newAnswers[3],
            stress_management: newAnswers[4],
            overall_feeling: newAnswers[5],
            completed_at: new Date().toISOString(),
          });

          // Update profile to mark onboarding complete
          await supabase.from("profiles").update({
            onboarding_complete: true,
          }).eq("id", user.id);
        }
      } catch (error) {
        console.error("Error saving onboarding:", error);
      }
      
      // Store in localStorage as backup
      localStorage.setItem("onboarding_complete", "true");
      localStorage.setItem("onboarding_answers", JSON.stringify(newAnswers));
      
      router.push("/onboarding/calibrating");
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleSkip = async () => {
    // Mark as skipped but not complete
    localStorage.setItem("onboarding_skipped", "true");
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("profiles").update({
          onboarding_skipped: true,
        }).eq("id", user.id);
      }
    } catch (error) {
      console.error("Error marking skip:", error);
    }
    
    router.push("/appx");
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
      {/* Header with Skip */}
      <div className="flex justify-end p-4">
        <button
          onClick={handleSkip}
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
        >
          SKIP
        </button>
      </div>

      {/* Title */}
      <div className="px-6 mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Let's get you started</h1>
      </div>

      {/* Progress bar */}
      <div className="px-6 mb-6">
        <div className="relative">
          {/* Brown decorative element */}
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-12 h-16 bg-[#8B6F47] rounded-r-full" />
          
          {/* Progress container */}
          <div className="bg-[#F5F0EA] rounded-3xl p-6 ml-6">
            {/* Progress indicator */}
            <div className="flex justify-center mb-4">
              <span className="px-4 py-1 bg-[#8B6F47] text-white text-sm font-medium rounded-full">
                {currentQuestion + 1} OF {onboardingQuestions.length}
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1 bg-[#E8E0D5] rounded-full mb-6 overflow-hidden">
              <div 
                className="h-full bg-[#8B6F47] rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Question */}
            <h2 className="text-xl font-bold text-gray-900 text-center mb-6">
              {question.question}
            </h2>
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="flex-1 px-6 space-y-3 overflow-y-auto pb-32">
        {question.options.map((option, index) => {
          const isObject = typeof option === "object";
          const label = isObject ? option.label : option;
          const emoji = isObject ? option.emoji : null;
          const isSelected = selectedOption === label;

          return (
            <button
              key={index}
              onClick={() => handleOptionSelect(option)}
              className={`w-full p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                isSelected
                  ? "border-[#7DD3D3] bg-[#E8F8F8]"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <span className="flex items-center gap-3">
                {emoji && <span className="text-xl">{emoji}</span>}
                <span className="text-gray-800 font-medium">{label}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Continue Button - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#FDFBF7] via-[#FDFBF7] to-transparent pt-12">
        <Button
          onClick={handleContinue}
          disabled={!selectedOption || isSaving}
          className="w-full h-14 bg-[#7DD3D3] hover:bg-[#6BC4C4] text-white font-medium text-lg rounded-2xl disabled:opacity-50"
        >
          {isSaving ? (
            "Saving..."
          ) : (
            <>
              {isLastQuestion ? "Complete" : "Continue"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
