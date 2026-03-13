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
import Link from "next/link";
import { VENDOR_NEUTRAL_MESSAGING, WELLNESS_MODALITIES } from "@/lib/human-os/decision-engine";

import Image from "next/image";

const MODALITY_MATCH_RATES: Record<string, number> = {
  'Psychotherapy': 89.2,
  'Life Coaching': 87.5,
  'Meditation & Mindfulness': 91.8,
  'Physical Fitness': 93.4,
  'Nutrition & Diet': 88.7,
  'Sleep Optimization': 85.3,
  'Stress Management': 90.1,
  'Couples Therapy': 82.6,
  'Group Sessions': 86.9,
  'Holistic Wellbeing': 84.2,
};

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
      description: "85-93% accuracy in matching users with effective interventions.",
    },
    {
      icon: Shield,
      title: "No Conflicts of Interest",
      description: "Recommendations based on your outcomes, not partnership fees.",
    },
    {
      icon: Network,
      title: "50+ Wellbeing Modalities",
      description: "From psychotherapy to fitness, we cover the full spectrum of wellness.",
    },
  ];

  if (variant === "hero") {
    return (
      <section className="relative py-16 md:py-24 overflow-hidden bg-brand-navy">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 opacity-10"
            style={{ 
              backgroundImage: "url('/assets/b&b-diamond-pattern.svg')",
              backgroundSize: "300px",
            }}
          />
        </div>

        <div className="container relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.span 
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-brand-gold/20 text-brand-gold px-4 py-2 rounded-full mb-6"
            >
              <Zap className="h-4 w-4" />
              <span className="text-sm font-medium">Decision Engine</span>
            </motion.span>
            
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-3xl md:text-5xl font-bold text-white mb-4"
            >
              {VENDOR_NEUTRAL_MESSAGING.headline}
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-white/70 max-w-2xl mx-auto"
            >
              {VENDOR_NEUTRAL_MESSAGING.subheadline}
            </motion.p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
              >
                <feature.icon className="h-8 w-8 text-brand-gold mb-3" />
                <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                <p className="text-sm text-white/60">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Modalities Section */}
          {showModalities && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-8 max-w-4xl mx-auto"
            >
              <h3 className="font-semibold text-brand-navy text-center mb-6">
                50+ Wellbeing Modalities, One Intelligent Layer
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {WELLNESS_MODALITIES.map((modality, i) => (
                  <motion.div
                    key={modality.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
                    className={`px-4 py-2 rounded-full text-sm transition-all cursor-pointer ${
                      i === activeModality 
                        ? "bg-brand-navy text-white" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onMouseEnter={() => setActiveModality(i)}
                  >
                    {modality.name}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* CTA */}
          <div className="text-center mt-10">
            <Button variant="gold" size="lg" className="group" asChild>
              <Link href="/download">
                Experience the Engine
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
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
            <span className="font-semibold text-brand-teal">88.5%</span>
          </div>
          <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "88.5%" }}
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
            The Routing Layer for Wellbeing
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
                50+ Wellbeing Modalities, One Intelligent Layer
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
