"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  DollarSign, 
  Users, 
  XCircle, 
  TrendingDown,
  AlertTriangle,
  Zap,
  ArrowRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const BURNOUT_STATS = [
  {
    value: "$322B",
    numericValue: 322,
    label: "Annual cost of burnout globally",
    icon: DollarSign,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    value: "76%",
    numericValue: 76,
    label: "Employees experiencing workplace stress",
    icon: Users,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    value: "67%",
    numericValue: 67,
    label: "Generic wellness programs that fail",
    icon: XCircle,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  {
    value: "40%",
    numericValue: 40,
    label: "Productivity lost to mental health",
    icon: TrendingDown,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
];

interface StateOfHumanProps {
  variant?: "full" | "compact" | "hero";
  showCTA?: boolean;
  onCTAClick?: () => void;
}

export function StateOfHuman({ 
  variant = "full", 
  showCTA = true,
  onCTAClick 
}: StateOfHumanProps) {
  const [animatedValues, setAnimatedValues] = useState<number[]>([0, 0, 0, 0]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setAnimatedValues(BURNOUT_STATS.map(s => s.numericValue));
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (variant === "hero") {
    return (
      <section className="relative overflow-hidden py-16 md:py-24">
        {/* Background with brand pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-navy via-brand-navy to-brand-navy-light">
          <div 
            className="absolute inset-0 opacity-5"
            style={{ 
              backgroundImage: "url('/assets/b&b-diamond-pattern.svg')",
              backgroundSize: "200px",
            }}
          />
        </div>

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-400 px-4 py-2 rounded-full mb-6">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">System Failure Detected</span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
              The Human Operating System<br />
              <span className="text-red-400">Is Overloaded</span>
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Historically high levels of stress are causing system-wide failures. 
              Generic wellness programs aren't working. It's time for a new approach.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
            {BURNOUT_STATS.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                  <CardContent className="p-4 md:p-6 text-center">
                    <div className={`inline-flex p-3 rounded-full ${stat.bgColor} mb-3`}>
                      <stat.icon className={`h-5 w-5 md:h-6 md:w-6 ${stat.color}`} />
                    </div>
                    <motion.p
                      className={`text-2xl md:text-4xl font-bold ${stat.color} mb-2`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    >
                      {stat.value}
                    </motion.p>
                    <p className="text-gray-400 text-xs md:text-sm">
                      {stat.label}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {showCTA && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isVisible ? 1 : 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-3 bg-white/10 rounded-full px-6 py-3 mb-6">
                <Zap className="h-5 w-5 text-brand-gold" />
                <span className="text-white">
                  There's a better way. Meet the <span className="text-brand-gold font-semibold">Human OS</span>
                </span>
              </div>
              <br />
              <Button 
                variant="gold" 
                size="lg"
                onClick={onCTAClick}
                className="group"
              >
                Discover the Solution
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          )}
        </div>
      </section>
    );
  }

  if (variant === "compact") {
    return (
      <Card className="bg-gradient-to-br from-brand-navy to-brand-navy-light border-0 overflow-hidden">
        <CardContent className="p-6 relative">
          <div 
            className="absolute inset-0 opacity-5"
            style={{ 
              backgroundImage: "url('/assets/b&b-diamond-pattern.svg')",
              backgroundSize: "100px",
            }}
          />
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-red-400 mb-3">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">State of the Human</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {BURNOUT_STATS.slice(0, 2).map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-gray-400 text-xs">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Full variant
  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-full mb-4">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-medium">Critical Alert</span>
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-navy mb-4">
            The State of the Human
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            The cost of burnout and the failure of generic wellness programs 
            demands a new approach to human wellbeing.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {BURNOUT_STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className={`inline-flex p-4 rounded-full ${stat.bgColor} mb-4`}>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                  <p className={`text-4xl font-bold ${stat.color} mb-2`}>
                    {stat.value}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {stat.label}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="bg-brand-navy text-white overflow-hidden">
          <CardContent className="p-8 md:p-12 relative">
            <div 
              className="absolute inset-0 opacity-5"
              style={{ 
                backgroundImage: "url('/assets/b&b-pattern.svg')",
                backgroundSize: "300px",
              }}
            />
            <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="font-display text-2xl md:text-3xl font-bold mb-4">
                  Generic Wellness Doesn't Work
                </h3>
                <p className="text-gray-300 mb-6">
                  67% of wellness programs fail to show measurable ROI because they take a 
                  one-size-fits-all approach. The Human OS uses AI-powered routing to match 
                  each person with the right intervention at the right time.
                </p>
                <ul className="space-y-3">
                  {[
                    "Personalized, not generic",
                    "AI-powered, not guesswork",
                    "Vendor-neutral, not biased",
                  ].map((point) => (
                    <li key={point} className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-brand-gold" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-center">
                <div className="relative w-48 h-48">
                  <Image
                    src="/assets/mandala-logo.svg"
                    alt="Human OS"
                    fill
                    className="object-contain opacity-20"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-brand-gold">94.3%</p>
                      <p className="text-sm text-gray-400">Routing Accuracy</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default StateOfHuman;
