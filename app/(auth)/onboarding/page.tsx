"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronRight, ChevronLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const onboardingSlides = [
  {
    id: 1,
    title: "Welcome to Bold & Beyond",
    description: "Your journey to wellness starts here. Discover expert coaching, therapy, and personalized wellness solutions.",
    image: "/images/onboarding-1.jpg",
    gradient: "from-[#0D9488] to-[#0D4F4F]",
  },
  {
    id: 2,
    title: "Expert Guidance",
    description: "Connect with certified coaches, therapists, and wellness experts who understand your unique needs.",
    image: "/images/onboarding-2.jpg",
    gradient: "from-[#6B9BC3] to-[#0D4F4F]",
  },
  {
    id: 3,
    title: "Track Your Progress",
    description: "Monitor your wellness journey with personalized insights, charts, and recommendations.",
    image: "/images/onboarding-3.jpg",
    gradient: "from-[#D4AF37] to-[#8B7355]",
  },
  {
    id: 4,
    title: "One app for everything",
    description: "AI guidance, expert coaching, and exclusive wellness perks—all in one place.",
    image: "/images/onboarding-4.jpg",
    gradient: "from-[#7DD3D3] to-[#0D9488]",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      completeOnboarding();
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const completeOnboarding = () => {
    // Mark onboarding as complete in localStorage
    localStorage.setItem("onboarding_complete", "true");
    router.push("/appx");
  };

  const slide = onboardingSlides[currentSlide];
  const isLastSlide = currentSlide === onboardingSlides.length - 1;

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-b ${slide.gradient} transition-all duration-500`} />
      
      {/* Background image placeholder */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[url('/images/pattern-bg.png')] bg-cover bg-center" />
      </div>

      {/* Skip button */}
      <div className="relative z-10 flex justify-end p-4">
        <button
          onClick={handleSkip}
          className="flex items-center gap-1 text-white/80 hover:text-white text-sm font-medium transition-colors"
        >
          Skip
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 relative z-10 flex flex-col items-center justify-center px-6">
        {/* Illustration area */}
        <div className="w-full max-w-sm h-64 mb-8 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <Image
                src="/images/bold-beyond-logo.png"
                alt="Bold & Beyond"
                width={120}
                height={120}
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="flex items-center gap-2 mb-6">
          {onboardingSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "w-8 bg-white"
                  : "w-2 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>

        {/* Text content */}
        <div className="text-center max-w-sm">
          <h1 className="text-2xl font-bold text-white mb-3 transition-all duration-300">
            {slide.title}
          </h1>
          <p className="text-white/80 text-sm leading-relaxed">
            {slide.description}
          </p>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="relative z-10 p-6 pb-12">
        <div className="flex items-center gap-4">
          {currentSlide > 0 && (
            <Button
              variant="outline"
              size="lg"
              onClick={handlePrev}
              className="flex-1 bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back
            </Button>
          )}
          <Button
            variant="default"
            size="lg"
            onClick={handleNext}
            className={`${currentSlide === 0 ? "w-full" : "flex-1"} bg-white text-gray-900 hover:bg-white/90`}
          >
            {isLastSlide ? "Get Started" : "Next"}
            {!isLastSlide && <ChevronRight className="h-5 w-5 ml-1" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
