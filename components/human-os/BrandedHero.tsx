"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

interface BrandedHeroProps {
  variant?: "home" | "platform" | "corporate";
  showVideo?: boolean;
}

export function BrandedHero({ 
  variant = "home",
  showVideo = false 
}: BrandedHeroProps) {
  if (variant === "platform") {
    return (
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        {/* Background with brand assets */}
        <div className="absolute inset-0">
          <Image
            src="/assets/blue-gradient-hero-bg.png"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
          <div 
            className="absolute inset-0 opacity-10"
            style={{ 
              backgroundImage: "url('/assets/b&b-pattern.svg')",
              backgroundSize: "300px",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/90 to-brand-navy/70" />
        </div>

        <div className="container relative z-10 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 bg-brand-gold/20 text-brand-gold px-4 py-2 rounded-full mb-6">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">The Human Operating System</span>
              </span>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Your Wellness,{" "}
                <span className="text-brand-gold">Intelligently Routed</span>
              </h1>

              <p className="text-xl text-gray-300 mb-8 max-w-lg">
                The vendor-neutral platform that learns what works for you 
                and routes you to the right solution, every time.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button variant="gold" size="lg" asChild className="group">
                  <Link href="/signup">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                {showVideo && (
                  <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                    <Play className="mr-2 h-5 w-5" />
                    Watch Demo
                  </Button>
                )}
              </div>

              {/* Trust indicators */}
              <div className="mt-12 flex items-center gap-8">
                <div className="text-center">
                  <p className="text-3xl font-bold text-brand-gold">94.3%</p>
                  <p className="text-sm text-gray-400">Routing Accuracy</p>
                </div>
                <div className="h-12 w-px bg-white/20" />
                <div className="text-center">
                  <p className="text-3xl font-bold text-brand-gold">50+</p>
                  <p className="text-sm text-gray-400">Wellness Modalities</p>
                </div>
                <div className="h-12 w-px bg-white/20" />
                <div className="text-center">
                  <p className="text-3xl font-bold text-brand-gold">47K+</p>
                  <p className="text-sm text-gray-400">Users Helped</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:flex justify-center"
            >
              <div className="relative">
                {/* Mandala animation */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0"
                >
                  <Image
                    src="/assets/mandala-outline.svg"
                    alt="Mandala"
                    width={400}
                    height={400}
                    className="opacity-20"
                  />
                </motion.div>
                
                <div className="relative z-10 w-80 h-80 flex items-center justify-center">
                  <Image
                    src="/assets/mandala-logo.svg"
                    alt="Human OS"
                    width={200}
                    height={200}
                    className="animate-pulse"
                  />
                </div>

                {/* Floating elements */}
                {[
                  { icon: "excellent-emoticon", pos: "top-0 left-0", delay: 0 },
                  { icon: "great-emoticon", pos: "top-0 right-0", delay: 0.2 },
                  { icon: "neutral-emoticon", pos: "bottom-0 left-0", delay: 0.4 },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className={`absolute ${item.pos} w-12 h-12`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 + item.delay }}
                  >
                    <Image
                      src={`/assets/${item.icon}.svg`}
                      alt="Emoticon"
                      width={48}
                      height={48}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  if (variant === "corporate") {
    return (
      <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-brand-navy">
        {/* Background pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{ 
            backgroundImage: "url('/assets/b&b-diamond-pattern.svg')",
            backgroundSize: "150px",
          }}
        />

        <div className="container relative z-10 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 bg-brand-gold/20 text-brand-gold px-4 py-2 rounded-full mb-6">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">Enterprise Solutions</span>
              </span>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Human Capital{" "}
                <span className="text-brand-gold">Optimization</span>
              </h1>

              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Anonymized organizational health insights that help you build 
                a resilient workforce, aligned with Dubai Wellbeing Vision 2030.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <Button variant="gold" size="lg" asChild className="group">
                  <Link href="/partners">
                    Partner With Us
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                  Request Demo
                </Button>
              </div>

              {/* Enterprise stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { value: "127", label: "Corporate Partners" },
                  { value: "89%", label: "Gov Alignment" },
                  { value: "78%", label: "Workforce Resilience" },
                  { value: "40K+", label: "Employees Covered" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                    className="text-center p-4 bg-white/5 rounded-xl"
                  >
                    <p className="text-3xl font-bold text-brand-gold">{stat.value}</p>
                    <p className="text-sm text-gray-400">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>
    );
  }

  // Home variant (default)
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background with brand assets */}
      <div className="absolute inset-0">
        <Image
          src="/assets/blue-gradient-hero-bg.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div 
          className="absolute inset-0 opacity-10"
          style={{ 
            backgroundImage: "url('/assets/b&b-pattern.svg')",
            backgroundSize: "400px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-navy/80 via-brand-navy/60 to-transparent" />
      </div>

      <div className="container relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 bg-brand-gold/20 text-brand-gold px-4 py-2 rounded-full mb-6">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">The Human Operating System</span>
            </span>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Bold Steps to a{" "}
              <span className="text-brand-gold">Better You</span>
            </h1>

            <p className="text-xl text-gray-200 mb-8 max-w-lg">
              We're not a wellness app. We're the intelligent routing layer 
              that connects you with exactly what you need, when you need it.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Button variant="gold" size="xl" asChild className="group">
                <Link href="/signup">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" className="border-white/30 text-white hover:bg-white/10" asChild>
                <Link href="/about">Learn More</Link>
              </Button>
            </div>

            {/* Key differentiators */}
            <div className="grid grid-cols-3 gap-6">
              {[
                { label: "Vendor Neutral", desc: "No conflicts of interest" },
                { label: "AI-Powered", desc: "94.3% accuracy" },
                { label: "Data Network", desc: "Gets smarter daily" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                >
                  <p className="text-brand-gold font-semibold">{item.label}</p>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Hero asset */}
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <Image
                  src="/assets/female-sports-model.png"
                  alt="Wellness"
                  fill
                  className="object-contain"
                />
                
                {/* Floating cards */}
                <motion.div
                  className="absolute -left-8 top-1/4 bg-white rounded-xl shadow-xl p-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src="/assets/excellent-emoticon.svg"
                      alt="Excellent"
                      width={40}
                      height={40}
                    />
                    <div>
                      <p className="font-semibold text-brand-navy">Feeling Great!</p>
                      <p className="text-xs text-muted-foreground">Wellness Score: 87%</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute -right-8 bottom-1/4 bg-white rounded-xl shadow-xl p-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-brand-teal/10">
                      <Image
                        src="/assets/mandala-filled.svg"
                        alt="AI"
                        width={32}
                        height={32}
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-brand-navy">AI Match Found</p>
                      <p className="text-xs text-brand-teal">94.3% confidence</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
          <div className="w-1 h-2 bg-white/50 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}

export default BrandedHero;
