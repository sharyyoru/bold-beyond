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
  return (
    <div className="flex flex-col">
      {/* Hero Section - WHOOP-inspired dark, bold design */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-brand-navy">
        {/* Background elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-navy via-brand-navy to-palette-sky/20" />
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-palette-sea/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-palette-sand/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
          {/* Rotating big icon */}
          <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/3 w-[700px] h-[700px] opacity-5">
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

              {/* Main headline - WHOOP style */}
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6">
                The system that transforms you
                <span className="block text-palette-sand">from inside → out</span>
              </h1>

              {/* Subheadline */}
              <p className="text-xl text-white/70 max-w-xl mx-auto lg:mx-0 mb-8">
                Not a fitness app. Not a wellness tracker. Not a coaching platform. 
                <span className="text-white font-medium"> A system that tracks, understands, and aligns the human.</span>
              </p>

              {/* CTA Buttons - Prominent download */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                <Button 
                  size="xl" 
                  className="bg-white text-brand-navy hover:bg-white/90 rounded-full px-8 gap-3 shadow-lg"
                  asChild
                >
                  <Link href="/download">
                    <Apple className="h-5 w-5" />
                    Download on App Store
                  </Link>
                </Button>
                <Button 
                  size="xl" 
                  className="bg-palette-sea text-white hover:bg-palette-sea-dark rounded-full px-8 gap-3"
                  asChild
                >
                  <Link href="/download">
                    <Play className="h-5 w-5 fill-current" />
                    Get on Google Play
                  </Link>
                </Button>
              </div>

              {/* What we're NOT */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-white/50">
                <span className="flex items-center gap-2">
                  <span className="text-red-400">✗</span> Fitness app
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-red-400">✗</span> Wellness tracker
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-red-400">✗</span> Coaching platform
                </span>
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
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow group overflow-hidden">
                  {/* Video thumbnail */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <video
                      src={pillar.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${pillar.color} opacity-20`} />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{pillar.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{pillar.description}</p>
                    <ul className="space-y-2">
                      {pillar.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm text-gray-500">
                          <CheckCircle2 className={`h-4 w-4 mt-0.5 flex-shrink-0 ${pillar.textColor}`} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Signature Features Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="container">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-flex items-center gap-2 bg-brand-navy/10 text-brand-navy px-4 py-2 rounded-full mb-6 text-sm font-medium">
                🔥 No One Has This
              </span>
              <h2 className="font-display text-4xl lg:text-5xl font-bold text-brand-navy mb-6">
                Signature Features
              </h2>
              <p className="text-lg text-gray-600">
                Features that go beyond tracking. Features that transform.
              </p>
            </div>
          </ScrollReveal>

          <div className="space-y-6">
            {signatureFeatures.map((feature, index) => (
              <ScrollReveal key={feature.title}>
                <Card className="border-0 shadow-lg overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col lg:flex-row">
                      <div className={`${feature.bgColor} p-6 lg:w-72 flex items-center justify-center`}>
                        <div className="w-32 h-32">
                          <ModuleLottie animationPath={feature.lottie} />
                        </div>
                      </div>
                      <div className="flex-1 p-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                        <p className="text-gray-600 mb-4">{feature.description}</p>
                        <div className="bg-gray-100 rounded-xl p-4 border-l-4 border-palette-sea">
                          <p className="text-sm text-gray-700 italic">👉 {feature.example}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
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
                <div className="bg-gradient-to-br from-palette-sea/20 to-palette-sand/20 rounded-3xl p-8">
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

      {/* Final CTA - Download Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-palette-sand/50 to-white">
        <div className="container">
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
