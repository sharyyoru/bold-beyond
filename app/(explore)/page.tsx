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

const HeroAnimation = dynamic(() => import("@/components/home/HeroAnimation"), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-lg aspect-square bg-white/10 rounded-3xl animate-pulse" />
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
    video: "/updated-assets/Psychotherapy.mp4",
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
    description: "Thought patterns, belief systems & cognitive reframing",
    features: ["Thought patterns", "Belief systems", "Cognitive distortions (CBT-based)"],
  },
  {
    name: "Emotion",
    icon: Heart,
    video: "/updated-assets/couplestherapy.mp4",
    color: "from-rose-500 to-pink-600",
    bgColor: "bg-rose-50",
    textColor: "text-rose-600",
    description: "Emotional states tracking, triggers & body awareness",
    features: ["Emotional states tracking", "Triggers", "Stored emotions (body awareness)"],
  },
  {
    name: "Energy",
    icon: Zap,
    video: "/updated-assets/Lifecoaching.mp4",
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-50",
    textColor: "text-amber-600",
    description: "Nervous system state, stress vs flow & recovery",
    features: ["Nervous system state", "Stress vs flow", "Recovery beyond sleep"],
  },
  {
    name: "Purpose",
    icon: Target,
    video: "/updated-assets/groupsessions.mp4",
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
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left - Text content */}
            <div className="text-center lg:text-left">
              {/* Category badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
                <Sparkles className="h-4 w-4 text-palette-sand" />
                <span className="text-sm text-white/90">Human Alignment System™</span>
              </div>

              {/* Main headline */}
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6">
                The Inside-out
                <span className="block text-palette-sand">Transformation System</span>
              </h1>

              {/* Subheadline */}
              <p className="text-xl text-white/70 max-w-xl mx-auto lg:mx-0 mb-10">
                Not a fitness app. Not a wellness tracker. Not a coaching platform. 
                <span className="text-white font-medium"> A system that tracks, understands, and aligns the human within.</span>
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

            {/* Right - Animation/Visual */}
            <div className="hidden lg:flex justify-center">
              <HeroAnimation />
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronDown className="h-8 w-8 text-white/40" />
          </div>
        </div>
      </section>

      {/* The 4 Pillars Section */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="container">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-flex items-center gap-2 bg-palette-sand/30 text-brand-navy px-4 py-2 rounded-full mb-6 text-sm font-medium">
                Your Unfair Advantage
              </span>
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-brand-navy mb-6">
                The 4 Pillars of Human Alignment
              </h2>
              <p className="text-lg text-gray-600">
                These are not generic wellness metrics. These are the dimensions that actually determine how aligned you are as a human.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar, index) => (
              <ScrollReveal key={pillar.name}>
                <div className="h-full bg-white/70 backdrop-blur-xl border border-white/50 shadow-glass rounded-2xl hover:shadow-xl transition-all group overflow-hidden">
                  {/* Video thumbnail */}
                  <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
                    <video
                      src={pillar.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-palette-sky/30 to-transparent" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{pillar.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{pillar.description}</p>
                    <ul className="space-y-2">
                      {pillar.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm text-gray-500">
                          <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0 text-palette-sky" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Signature Features Section - WHOOP Style Slider */}
      <section className="py-20 lg:py-32 bg-gradient-to-b from-palette-sky/10 to-white">
        <div className="container">
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

          {/* Slider Container - Full width overflow */}
          <div className="relative">
            {/* Navigation Arrow - Left (only shows after scroll) */}
            {showLeftArrow && (
              <button 
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center hover:scale-105 transition-all hidden lg:flex"
                onClick={() => {
                  const slider = document.getElementById('features-slider');
                  if (slider) slider.scrollBy({ left: -400, behavior: 'smooth' });
                }}
              >
                <ChevronLeft className="h-6 w-6 text-gray-700" />
              </button>
            )}

            {/* Navigation Arrow - Right */}
            <button 
              className="absolute -right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center hover:scale-105 transition-all hidden lg:flex"
              onClick={() => {
                const slider = document.getElementById('features-slider');
                if (slider) slider.scrollBy({ left: 400, behavior: 'smooth' });
              }}
            >
              <ChevronRight className="h-6 w-6 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Scrollable Cards - Aligned with container text, overflow to right edge */}
        <div 
          id="features-slider"
          className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            paddingLeft: 'max(2rem, calc((100vw - 1400px) / 2 + 2rem))',
            paddingRight: '2rem',
          }}
          onScroll={handleSliderScroll}
        >
          {signatureFeatures.map((feature, index) => (
            <div 
              key={feature.title}
              className="flex-shrink-0 w-[320px] lg:w-[380px] h-[480px] rounded-3xl overflow-hidden relative group snap-start"
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
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 leading-tight mb-auto">
                  {feature.title}
                </h3>

                {/* Description and example at bottom */}
                <div className="mt-auto">
                  <p className="text-gray-700 text-sm mb-4">{feature.description}</p>
                  <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 border border-white/50">
                    <p className="text-xs text-gray-600 italic">{feature.example}</p>
                  </div>
                </div>

                {/* Plus Button */}
                <button className="absolute bottom-6 right-6 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:scale-110 transition-all">
                  <Plus className="h-5 w-5 text-gray-700" />
                </button>
              </div>
            </div>
          ))}
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

      {/* AI Coach Section */}
      <section className="py-20 lg:py-32 bg-brand-navy text-white">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal>
              <div>
                <span className="inline-flex items-center gap-2 bg-white/10 text-palette-sand px-4 py-2 rounded-full mb-6 text-sm font-medium">
                  🧠 Your Secret Weapon
                </span>
                <h2 className="font-display text-4xl lg:text-5xl font-bold mb-6">
                  AI Coach That Gets It
                </h2>
                <p className="text-xl text-white/70 mb-8">
                  Not generic. <span className="text-white font-semibold">Deep, personalized, slightly confronting.</span>
                </p>

                <div className="space-y-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                    <p className="text-white/90 italic mb-2">
                      "You're avoiding this, not because it's hard... but because it challenges your identity."
                    </p>
                    <p className="text-sm text-palette-sand">— Your AI Coach</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                    <p className="text-white/90 italic mb-2">
                      "Your exhaustion is not physical. It's emotional suppression."
                    </p>
                    <p className="text-sm text-palette-sand">— Your AI Coach</p>
                  </div>
                </div>

                <div className="mt-10">
                  <Button 
                    size="lg" 
                    className="bg-palette-sand text-brand-navy hover:bg-palette-sand/90 rounded-full px-8"
                    asChild
                  >
                    <Link href="/download">
                      Experience the AI Coach
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="relative">
                {/* Meditating Lottie behind the card - 3x bigger with parallax float */}
                <div className="absolute -right-32 -bottom-32 w-[600px] h-[600px] opacity-40 z-0 animate-float-slow">
                  <ModuleLottie animationPath="/animations/Yoga.json" />
                </div>
                
                <div className="relative z-10 bg-gradient-to-br from-palette-sea/20 to-palette-sand/20 rounded-3xl p-8">
                  <div className="bg-white rounded-2xl shadow-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-palette-sea flex items-center justify-center">
                        <Lightbulb className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Alignment Insight</p>
                        <p className="text-xs text-gray-500">Based on your patterns</p>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      You're 73% aligned with your stated values, but there's a 27% gap between what you say matters and how you spend your time. This isn't failure—it's data.
                    </p>
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-xs text-gray-500 mb-2">Your Alignment Score</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full w-[73%] bg-gradient-to-r from-palette-sea to-palette-sky rounded-full" />
                        </div>
                        <span className="font-bold text-palette-sea">73%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
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
                  className="bg-black text-white hover:bg-gray-900 rounded-full px-10 gap-3 shadow-xl"
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
