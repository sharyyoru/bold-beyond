"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { 
  ArrowRight, 
  Brain, 
  Heart, 
  Zap,
  Target,
  Sparkles,
  Apple,
  Play,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Activity,
  RefreshCw,
  TrendingUp,
  Lightbulb,
  CheckCircle2
} from "lucide-react";

const Hero3DBand = dynamic(() => import("@/components/home/Hero3DBand"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] lg:h-[600px] bg-white/10 rounded-3xl animate-pulse" />
  ),
});

const ScrollReveal = dynamic(() => import("@/components/ui/ScrollReveal"), {
  ssr: false,
});

const ModuleLottie = dynamic(() => import("@/components/ui/ModuleLottie"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-100 animate-pulse rounded-xl" />,
});

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const pillars = [
  {
    name: "Mind",
    icon: Brain,
    video: "/updated-assets/Psychotherapy.mp4#t=0.1",
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
    description: "Thought patterns, belief systems & cognitive reframing",
    features: ["Thought patterns", "Belief systems", "Cognitive distortions (CBT-based)"],
  },
  {
    name: "Emotion",
    icon: Heart,
    video: "/updated-assets/couplestherapy.mp4#t=0.1",
    color: "from-rose-500 to-pink-600",
    bgColor: "bg-rose-50",
    textColor: "text-rose-600",
    description: "Emotional states tracking, triggers & body awareness",
    features: ["Emotional states tracking", "Triggers", "Stored emotions (body awareness)"],
  },
  {
    name: "Energy",
    icon: Zap,
    video: "/updated-assets/Lifecoaching.mp4#t=0.1",
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-50",
    textColor: "text-amber-600",
    description: "Nervous system state, stress vs flow & recovery",
    features: ["Nervous system state", "Stress vs flow", "Recovery beyond sleep"],
  },
  {
    name: "Purpose",
    icon: Target,
    video: "/updated-assets/groupsessions.mp4#t=0.1",
    color: "from-teal-500 to-emerald-600",
    bgColor: "bg-teal-50",
    textColor: "text-teal-600",
    description: "Alignment with life direction, meaning & identity",
    features: ["Alignment with life direction", "Meaning tracking", "Identity evolution"],
  },
];

const signatureFeatures = [
  {
    title: "Emotional Pattern Mapping",
    description: "Track recurring emotions, triggers, and behaviors. See patterns over time.",
    example: '"You feel anxious every Sunday night → work anticipation"',
    lottie: "/animations/modules/PersonalHistory.json",
    bgColor: "bg-palette-sand/30",
  },
  {
    title: "Thought Reframe Engine",
    description: "CBT + NLP powered reframing. Input your thought, get a new perspective.",
    example: '"I\'m not good enough" → "You\'re interpreting uncertainty as failure"',
    lottie: "/animations/modules/DrivingQuestion.json",
    bgColor: "bg-palette-sky/20",
  },
  {
    title: "Nervous System Tracker",
    description: "Not just HRV. Detect sympathetic vs parasympathetic states.",
    example: "Detects: fight/flight, freeze, flow",
    lottie: "/animations/modules/Vagal.json",
    bgColor: "bg-amber-100/50",
  },
  {
    title: "Alignment Actions",
    description: "Instead of 'walk 10,000 steps', get actions that actually matter.",
    example: '"Have a difficult conversation" • "Rest without guilt" • "Say no today"',
    lottie: "/animations/modules/SetOutcomes.json",
    bgColor: "bg-palette-sea/20",
  },
  {
    title: "Identity Shift Engine",
    description: "Track old patterns vs new patterns. See your growth over time.",
    example: '"You reacted differently today. This is growth."',
    lottie: "/animations/modules/ElicitValues.json",
    bgColor: "bg-purple-100/50",
  },
];

export default function HomePage() {
  const [showLeftArrow, setShowLeftArrow] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerLeft, setContainerLeft] = React.useState(0);

  React.useEffect(() => {
    const updateContainerLeft = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerLeft(rect.left);
      }
    };
    updateContainerLeft();
    window.addEventListener('resize', updateContainerLeft);
    return () => window.removeEventListener('resize', updateContainerLeft);
  }, []);

  const handleSliderScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setShowLeftArrow(target.scrollLeft > 50);
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section - WHOOP-inspired dark, bold design with parallax */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-brand-navy">
        {/* Background elements with floating parallax */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-navy via-brand-navy to-palette-sky/20" />
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-palette-sea/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 animate-float-slow" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-palette-sand/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 animate-float" style={{ animationDelay: '2s' }} />
          {/* Rotating big icon with parallax */}
          <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/3 w-[700px] h-[700px] opacity-5 animate-float-slow" style={{ animationDelay: '1s' }}>
            <Image
              src="/new-assets/big-icon.png"
              alt=""
              fill
              className="object-contain animate-spin-slower"
            />
          </div>
        </div>

        <div className="container relative z-10 py-20 lg:py-32">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left - Text content */}
            <div className="text-center lg:text-left w-full">
              {/* Category badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
                <Sparkles className="h-4 w-4 text-palette-sand" />
                <span className="text-sm text-white/90">HUMAN ALIGNMENT SYSTEM™</span>
              </div>

              {/* Main headline */}
              <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6 px-4 sm:px-0">
                Upgrade your <span className="text-palette-sand">Human OS.</span>
                <span className="block mt-2">Take control of your life.</span>
              </h1>

              {/* Subheadline */}
              <p className="text-xl text-white/70 max-w-xl mx-auto lg:mx-0 mb-10 px-4 sm:px-0">
                Understand what's driving your thoughts, emotions, and decisions — so stress, overthinking, and confusion stop controlling you.
              </p>

              {/* CTA Buttons - Glassmorphism */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  size="xl" 
                  className="bg-white/20 backdrop-blur-xl border border-white/30 text-white hover:bg-white/30 rounded-full px-8 gap-3 shadow-lg"
                  asChild
                >
                  <Link href="/download">
                    <Apple className="h-5 w-5" />
                    Download on App Store
                  </Link>
                </Button>
                <Button 
                  size="xl" 
                  className="bg-palette-sea/80 backdrop-blur-xl border border-palette-sea/50 text-white hover:bg-palette-sea rounded-full px-8 gap-3"
                  asChild
                >
                  <Link href="/download">
                    <Play className="h-5 w-5 fill-current" />
                    Get on Google Play
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right - 3D Rotating Band */}
            <div className="hidden lg:flex justify-center items-center">
              <Hero3DBand />
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronDown className="h-8 w-8 text-white/40" />
          </div>
        </div>
      </section>

      {/* The 4 Pillars Section - Apple Style Bold Cards */}
      <section className="py-20 lg:py-32 bg-[#f5f5f7]">
        <div className="container">
          <ScrollReveal>
            <div className="mb-12">
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-brand-navy">
                The 4 Pillars. <span className="text-gray-500">Your alignment dimensions.</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {pillars.map((pillar, index) => (
              <ScrollReveal key={pillar.name}>
                <div className="relative h-[500px] rounded-3xl overflow-hidden group cursor-pointer transition-transform hover:scale-[1.02]">
                  {/* Video Background with sand fallback */}
                  <div className="absolute inset-0 bg-palette-sand">
                    <video
                      src={pillar.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="auto"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Sand Color Overlay - consistent across all cards */}
                  <div className="absolute inset-0 bg-gradient-to-t from-palette-sand/90 via-palette-sand/40 to-palette-sand/20" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-between text-white">
                    <div>
                      <pillar.icon className="h-10 w-10 mb-4 opacity-90" />
                      <h3 className="text-3xl font-bold mb-2">{pillar.name}</h3>
                      <p className="text-white/80 text-sm">{pillar.description}</p>
                    </div>
                    
                    <div className="space-y-2">
                      {pillar.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-sm text-white/90">
                          <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Signature Features Section - WHOOP Style Slider */}
      <section className="py-20 lg:py-32 bg-gradient-to-b from-palette-sky/10 to-white overflow-hidden">
        <div className="container" ref={containerRef}>
          <ScrollReveal>
            <div className="max-w-3xl mb-12">
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-brand-navy mb-6">
                Features that actually
                <span className="block text-palette-sand">Transform You</span>
              </h2>
              <p className="text-lg text-gray-600">
                Not surface-level metrics. Deep insights that help you understand and realign who you are — so you can make smarter decisions every day.
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* Slider with proper container alignment */}
        <div className="relative">
          {/* Navigation Arrows */}
          <div className="container">
            <div className="relative">
              {showLeftArrow && (
                <button 
                  className="absolute -left-6 top-[240px] z-20 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center hover:scale-105 transition-all hidden lg:flex"
                  onClick={() => {
                    const slider = document.getElementById('features-slider');
                    if (slider) slider.scrollBy({ left: -400, behavior: 'smooth' });
                  }}
                >
                  <ChevronLeft className="h-6 w-6 text-gray-700" />
                </button>
              )}
              <button 
                className="absolute -right-6 top-[240px] z-20 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center hover:scale-105 transition-all hidden lg:flex"
                onClick={() => {
                  const slider = document.getElementById('features-slider');
                  if (slider) slider.scrollBy({ left: 400, behavior: 'smooth' });
                }}
              >
                <ChevronRight className="h-6 w-6 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Scrollable Cards - aligned with container left edge */}
          <div 
            id="features-slider"
            className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              paddingLeft: containerLeft > 0 ? `${containerLeft}px` : '2rem',
              paddingRight: '2rem',
            }}
            onScroll={handleSliderScroll}
          >
          {signatureFeatures.map((feature, index) => (
            <div 
              key={feature.title}
              className="flex-shrink-0 w-[400px] lg:w-[500px] h-[520px] rounded-3xl overflow-hidden relative group snap-start"
            >
              {/* Lottie Background - Light on top */}
              <div className="absolute inset-0 bg-gradient-to-b from-palette-sky/30 via-palette-sea/40 to-brand-navy/70">
                <div className="absolute inset-0 flex items-center justify-center opacity-80">
                  <div className="w-full h-full">
                    <ModuleLottie animationPath={feature.lottie} />
                  </div>
                </div>
              </div>

              {/* Glassmorphism Overlay - dark at bottom */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-white/90" />

              {/* Content */}
              <div className="relative h-full flex flex-col p-6">
                {/* Title at top */}
                <h3 className="text-xl lg:text-2xl font-bold text-brand-navy leading-tight mb-auto">
                  {feature.title}
                </h3>

                {/* Description and example at bottom */}
                <div className="mt-auto">
                  <p className="text-gray-700 text-sm mb-4">{feature.description}</p>
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 border border-white/50">
                    <p className="text-xs text-gray-600 italic">{feature.example}</p>
                  </div>
                </div>

                              </div>
            </div>
          ))}
          </div>
        </div>

        {/* Dots Navigation */}
        <div className="container">
          <div className="flex justify-center gap-2 mt-6">
            {signatureFeatures.map((_, index) => (
              <button 
                key={index}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${index === 0 ? 'bg-brand-navy' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* AI Coach Section - Apple Store Difference Style */}
      <section className="py-20 lg:py-32 bg-[#f5f5f7]">
        <div className="container">
          <ScrollReveal>
            <div className="mb-12">
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-brand-navy">
                AI Coach That Gets It. <span className="text-gray-500">Your personal breakthrough partner.</span>
              </h2>
            </div>
          </ScrollReveal>

          {/* 2-Column Layout: Lottie Left, 2x2 Grid Right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Large Lottie Card - Full Height Left */}
            <ScrollReveal>
              <div className="bg-brand-navy rounded-3xl p-8 h-full min-h-[500px] relative overflow-hidden group hover:shadow-xl transition-shadow flex flex-col">
                <div className="relative z-10 mb-4">
                  <span className="inline-flex items-center gap-2 bg-white/20 text-palette-sand px-3 py-1 rounded-full text-xs font-medium mb-4">
                    🧠 YOUR SECRET WEAPON
                  </span>
                  <h3 className="text-2xl font-bold text-white mb-2">Deep, personalized insights</h3>
                  <p className="text-white/70 text-sm">Not generic advice. Confronting truths that actually move you forward.</p>
                </div>
                
                {/* Lottie - centered and sized to fit */}
                <div className="flex-1 flex items-center justify-center min-h-[250px]">
                  <div className="w-[280px] h-[280px] opacity-90 animate-float-slow">
                    <ModuleLottie animationPath="/animations/Yoga.json" />
                  </div>
                </div>
                
                <div className="relative z-10 mt-auto">
                  <Button 
                    size="lg" 
                    className="bg-palette-sand text-brand-navy hover:bg-palette-sand/90 rounded-full px-6 w-full"
                    asChild
                  >
                    <Link href="/download">
                      Experience AI Coach
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </ScrollReveal>

            {/* 2x2 Grid of Cards - Right Side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ScrollReveal>
                <div className="bg-white rounded-3xl p-6 hover:shadow-xl transition-shadow h-full">
                  <div className="w-12 h-12 rounded-2xl bg-palette-sea/10 flex items-center justify-center mb-4">
                    <Brain className="h-6 w-6 text-palette-sea" />
                  </div>
                  <p className="text-brand-navy font-medium mb-1">
                    <span className="text-palette-sea">Identity</span> challenges that unlock growth.
                  </p>
                  <p className="text-sm text-gray-500 italic mt-3">
                    "You're avoiding this, not because it's hard... but because it challenges your identity."
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal>
                <div className="bg-white rounded-3xl p-6 hover:shadow-xl transition-shadow h-full">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
                    <Heart className="h-6 w-6 text-rose-500" />
                  </div>
                  <p className="text-brand-navy font-medium mb-1">
                    <span className="text-rose-500">Emotional</span> patterns decoded.
                  </p>
                  <p className="text-sm text-gray-500 italic mt-3">
                    "Your exhaustion is not physical. It's emotional suppression."
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal>
                <div className="bg-white rounded-3xl p-6 hover:shadow-xl transition-shadow h-full">
                  <div className="w-12 h-12 rounded-2xl bg-palette-sky/10 flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-palette-sky" />
                  </div>
                  <p className="text-brand-navy font-medium mb-1">
                    <span className="text-palette-sky">Track</span> your alignment score over time.
                  </p>
                  <div className="mt-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full w-[73%] bg-gradient-to-r from-palette-sea to-palette-sky rounded-full" />
                      </div>
                      <span className="font-bold text-palette-sea text-sm">73%</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal>
                <div className="bg-white rounded-3xl p-6 hover:shadow-xl transition-shadow h-full">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
                    <Lightbulb className="h-6 w-6 text-emerald-600" />
                  </div>
                  <p className="text-brand-navy font-medium mb-1">
                    <span className="text-emerald-600">Insights</span> based on your actual patterns.
                  </p>
                  <p className="text-sm text-gray-500 mt-3">
                    Not surface-level metrics. Deep understanding of who you really are.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Download Section with parallax */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-palette-sand/50 to-white overflow-hidden">
        {/* Animated Mandala Background with parallax */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] opacity-10 animate-spin-slow animate-float" style={{ animationDuration: '60s' }}>
            <Image
              src="/assets/mandala-outline.svg"
              alt=""
              fill
              className="object-contain"
            />
          </div>
        </div>
        {/* Additional floating orbs for depth */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-palette-sea/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-palette-sky/5 rounded-full blur-2xl animate-float-slow" />
        
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <ScrollReveal>
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-brand-navy mb-6">
                Ready to align?
              </h2>
              <p className="text-xl text-gray-600 mb-10">
                Join thousands transforming from inside → out
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button 
                  size="xl" 
                  className="bg-brand-navy text-white hover:bg-brand-navy/90 rounded-full px-10 gap-3 shadow-xl"
                  asChild
                >
                  <Link href="/download">
                    <Apple className="h-6 w-6" />
                    <div className="text-left">
                      <span className="text-xs opacity-70 block">Download on the</span>
                      <span className="font-semibold">App Store</span>
                    </div>
                  </Link>
                </Button>
                <Button 
                  size="xl" 
                  className="bg-palette-sea text-white hover:bg-palette-sea-dark rounded-full px-10 gap-3 shadow-xl"
                  asChild
                >
                  <Link href="/download">
                    <Play className="h-6 w-6 fill-current" />
                    <div className="text-left">
                      <span className="text-xs opacity-70 block">Get it on</span>
                      <span className="font-semibold">Google Play</span>
                    </div>
                  </Link>
                </Button>
              </div>

              <p className="text-sm text-gray-500">
                Free to start • No credit card required • Transform in 7 days
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
