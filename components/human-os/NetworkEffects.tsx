"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  TrendingUp, 
  Database, 
  Lightbulb,
  Target,
  Shield,
  Zap,
  Activity
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  getNetworkMetrics, 
  NETWORK_EFFECT_MESSAGING,
  PRIVACY_FRAMEWORK,
  calculateUserNetworkContribution
} from "@/lib/human-os/network-effects";
import Image from "next/image";

const iconMap = {
  target: Target,
  "trending-up": TrendingUp,
  database: Database,
  lightbulb: Lightbulb,
};

interface NetworkEffectsProps {
  variant?: "full" | "visualization" | "compact";
  showPrivacy?: boolean;
}

export function NetworkEffects({ 
  variant = "full",
  showPrivacy = true 
}: NetworkEffectsProps) {
  const [metrics, setMetrics] = useState(getNetworkMetrics());
  const [pulseActive, setPulseActive] = useState(false);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setPulseActive(true);
      setTimeout(() => setPulseActive(false), 500);
      
      setMetrics(prev => ({
        ...prev,
        activeToday: prev.activeToday + Math.floor(Math.random() * 5),
        totalInteractions: prev.totalInteractions + Math.floor(Math.random() * 10),
        dataPointsProcessed: prev.dataPointsProcessed + Math.floor(Math.random() * 100),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Network visualization nodes
  const nodes = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    angle: (i / 12) * 360,
    distance: 80 + Math.random() * 40,
  }));

  if (variant === "visualization") {
    return (
      <div className="relative w-full aspect-square max-w-md mx-auto">
        {/* Center node */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
          animate={{ scale: pulseActive ? 1.1 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-24 h-24 rounded-full bg-brand-teal flex items-center justify-center shadow-lg">
            <Image
              src="/assets/mandala-logo.svg"
              alt="Network Core"
              width={48}
              height={48}
              className="opacity-80"
            />
          </div>
        </motion.div>

        {/* Connecting lines and nodes */}
        {nodes.map((node, i) => {
          const x = 50 + Math.cos((node.angle * Math.PI) / 180) * node.distance / 2;
          const y = 50 + Math.sin((node.angle * Math.PI) / 180) * node.distance / 2;
          
          return (
            <motion.div
              key={node.id}
              className="absolute"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {/* Connection line */}
              <svg
                className="absolute"
                style={{
                  width: "100px",
                  height: "100px",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  pointerEvents: "none",
                }}
              >
                <line
                  x1="50"
                  y1="50"
                  x2="50"
                  y2="50"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-brand-teal/30"
                />
              </svg>
              
              {/* Node */}
              <motion.div
                className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
                  i % 3 === 0 
                    ? "bg-brand-gold" 
                    : i % 3 === 1 
                      ? "bg-brand-teal" 
                      : "bg-brand-navy"
                }`}
                animate={{ 
                  scale: pulseActive ? [1, 1.2, 1] : 1,
                }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <Users className="h-4 w-4 text-white" />
              </motion.div>
            </motion.div>
          );
        })}

        {/* Pulse rings */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          animate={{ 
            scale: pulseActive ? [1, 2] : 1,
            opacity: pulseActive ? [0.5, 0] : 0,
          }}
          transition={{ duration: 1 }}
        >
          <div className="w-24 h-24 rounded-full border-2 border-brand-teal" />
        </motion.div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <div className="p-2 rounded-lg bg-brand-teal/10">
                <Activity className="h-5 w-5 text-brand-teal" />
              </div>
              {pulseActive && (
                <span className="absolute top-0 right-0 h-2 w-2 bg-green-500 rounded-full animate-ping" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-brand-navy">Network Effects</h3>
              <p className="text-xs text-muted-foreground">Intelligence that compounds</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Active Today</p>
              <p className="font-semibold text-brand-teal">{metrics.activeToday.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Accuracy</p>
              <p className="font-semibold text-brand-gold">{(metrics.routingAccuracy * 100).toFixed(1)}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Full variant
  return (
    <section className="py-16 bg-gradient-to-br from-brand-cream via-white to-brand-cream relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-5"
        style={{ 
          backgroundImage: "url('/assets/b&b-diamond-pattern.svg')",
          backgroundSize: "150px",
        }}
      />

      <div className="container relative z-10">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 bg-brand-teal/10 text-brand-teal px-4 py-2 rounded-full mb-4">
            <Activity className="h-4 w-4" />
            <span className="text-sm font-medium">{NETWORK_EFFECT_MESSAGING.headline}</span>
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-navy mb-4">
            {NETWORK_EFFECT_MESSAGING.subheadline}
          </h2>
          <p className="text-xl text-brand-teal font-medium max-w-2xl mx-auto">
            {NETWORK_EFFECT_MESSAGING.keyMessage}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
          {/* Visualization */}
          <div className="order-2 lg:order-1">
            <NetworkEffects variant="visualization" />
          </div>

          {/* Metrics */}
          <div className="order-1 lg:order-2">
            <div className="grid grid-cols-2 gap-4">
              {NETWORK_EFFECT_MESSAGING.metrics.map((metric, i) => {
                const IconComponent = iconMap[metric.icon as keyof typeof iconMap] || Target;
                return (
                  <motion.div
                    key={metric.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <Card className="h-full">
                      <CardContent className="p-5">
                        <IconComponent className="h-6 w-6 text-brand-teal mb-3" />
                        <p className="text-2xl font-bold text-brand-navy mb-1">{metric.value}</p>
                        <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
                        <p className="text-xs text-brand-teal">{metric.trend}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-6 space-y-3">
              {NETWORK_EFFECT_MESSAGING.explanation.map((point, i) => (
                <motion.div
                  key={point}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <Zap className="h-4 w-4 text-brand-gold mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{point}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Privacy Section */}
        {showPrivacy && (
          <Card className="bg-brand-navy text-white overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="h-6 w-6 text-brand-gold" />
                <h3 className="font-semibold text-xl">{PRIVACY_FRAMEWORK.title}</h3>
              </div>
              
              <div className="grid md:grid-cols-4 gap-6 mb-6">
                {PRIVACY_FRAMEWORK.principles.map((principle, i) => (
                  <motion.div
                    key={principle.name}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                  >
                    <h4 className="font-medium text-brand-gold mb-2">{principle.name}</h4>
                    <p className="text-sm text-gray-300">{principle.description}</p>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                {PRIVACY_FRAMEWORK.compliance.map((cert) => (
                  <span 
                    key={cert}
                    className="px-3 py-1 bg-white/10 rounded-full text-xs"
                  >
                    {cert}
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

export default NetworkEffects;
