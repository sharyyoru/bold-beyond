"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Target, 
  Layers, 
  Shield, 
  Zap,
  ArrowRight,
  CheckCircle2,
  Network
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VENDOR_NEUTRAL_MESSAGING, WELLNESS_MODALITIES } from "@/lib/human-os/decision-engine";
import Image from "next/image";

interface DecisionEngineProps {
  variant?: "hero" | "feature" | "compact";
  showModalities?: boolean;
}

export function DecisionEngine({ 
  variant = "feature",
  showModalities = true 
}: DecisionEngineProps) {
  const [activeModality, setActiveModality] = useState(0);

  const features = [
    {
      icon: Layers,
      title: "Vendor-Neutral Routing",
      description: "We don't sell services. We route you to the right solution from 500+ providers.",
    },
    {
      icon: Target,
      title: "AI-Powered Matching",
      description: "94.3% accuracy in matching users with effective interventions.",
    },
    {
      icon: Shield,
      title: "No Conflicts of Interest",
      description: "Recommendations based on your outcomes, not partnership fees.",
    },
    {
      icon: Network,
      title: "50+ Wellness Modalities",
      description: "From psychotherapy to fitness, we cover the full spectrum of wellness.",
    },
  ];

  if (variant === "hero") {
    return (
      <section className="relative py-16 md:py-24 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-cream via-white to-brand-cream">
          <div 
            className="absolute inset-0 opacity-10"
            style={{ 
              backgroundImage: "url('/assets/b&b-pattern.svg')",
              backgroundSize: "400px",
            }}
          />
        </div>

        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 bg-brand-gold/10 text-brand-gold px-4 py-2 rounded-full mb-6">
                <Zap className="h-4 w-4" />
                <span className="text-sm font-medium">The Decision Engine</span>
              </span>
              
              <h2 className="font-display text-3xl md:text-5xl font-bold text-brand-navy mb-6">
                {VENDOR_NEUTRAL_MESSAGING.headline}
              </h2>
              
              <p className="text-xl text-muted-foreground mb-8">
                {VENDOR_NEUTRAL_MESSAGING.subheadline}
              </p>

              <div className="space-y-4 mb-8">
                {VENDOR_NEUTRAL_MESSAGING.points.map((point, i) => (
                  <motion.div
                    key={point}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="h-5 w-5 text-brand-gold mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{point}</span>
                  </motion.div>
                ))}
              </div>

              <div className="p-4 bg-brand-navy/5 rounded-xl border-l-4 border-brand-gold mb-8">
                <p className="text-brand-navy font-medium italic">
                  "{VENDOR_NEUTRAL_MESSAGING.differentiator}"
                </p>
              </div>

              <Button variant="gold" size="lg" className="group">
                Experience the Engine
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              {/* Visualization of routing */}
              <div className="relative bg-white rounded-2xl shadow-xl p-8 border">
                <div className="absolute -top-4 -right-4 bg-brand-gold text-white px-4 py-2 rounded-full text-sm font-medium">
                  Live Routing
                </div>
                
                <div className="text-center mb-8">
                  <div className="inline-flex p-4 rounded-full bg-brand-teal/10 mb-4">
                    <Image
                      src="/assets/mandala-logo.svg"
                      alt="Decision Engine"
                      width={64}
                      height={64}
                      className="animate-pulse"
                    />
                  </div>
                  <h3 className="font-semibold text-brand-navy">Decision Engine</h3>
                  <p className="text-sm text-muted-foreground">Processing your needs...</p>
                </div>

                {/* Modality routing visualization */}
                <div className="grid grid-cols-2 gap-3">
                  {WELLNESS_MODALITIES.slice(0, 6).map((modality, i) => (
                    <motion.div
                      key={modality.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
                      className={`p-3 rounded-lg border text-center text-sm transition-all cursor-pointer ${
                        i === activeModality 
                          ? "bg-brand-teal text-white border-brand-teal" 
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                      onMouseEnter={() => setActiveModality(i)}
                    >
                      {modality.name}
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-brand-teal/5 rounded-lg">
                  <p className="text-sm text-center text-brand-teal">
                    <span className="font-semibold">94.3%</span> match confidence for{" "}
                    <span className="font-semibold">{WELLNESS_MODALITIES[activeModality]?.name}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  if (variant === "compact") {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-brand-gold/10">
              <Zap className="h-5 w-5 text-brand-gold" />
            </div>
            <div>
              <h3 className="font-semibold text-brand-navy">Decision Engine</h3>
              <p className="text-xs text-muted-foreground">Vendor-neutral routing</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Routing accuracy</span>
            <span className="font-semibold text-brand-teal">94.3%</span>
          </div>
          <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "94.3%" }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-brand-teal rounded-full"
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Feature variant
  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 bg-brand-gold/10 text-brand-gold px-4 py-2 rounded-full mb-4">
            <Zap className="h-4 w-4" />
            <span className="text-sm font-medium">Decision Engine</span>
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-navy mb-4">
            The Routing Layer for Wellness
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We are not a coaching company. We are the operating system that routes you 
            to the right solution from across the entire wellness industry.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow border-2 border-transparent hover:border-brand-gold/20">
                <CardContent className="p-6">
                  <div className="inline-flex p-3 rounded-lg bg-brand-gold/10 text-brand-gold mb-4">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-brand-navy mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {showModalities && (
          <Card className="bg-brand-navy text-white overflow-hidden">
            <CardContent className="p-8">
              <h3 className="font-semibold text-xl mb-6 text-center">
                50+ Wellness Modalities, One Intelligent Layer
              </h3>
              <div className="flex flex-wrap justify-center gap-2">
                {WELLNESS_MODALITIES.map((modality) => (
                  <span
                    key={modality.id}
                    className="px-3 py-1.5 bg-white/10 rounded-full text-sm hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    {modality.name}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}

export default DecisionEngine;
