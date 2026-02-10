"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Lock, 
  TrendingUp, 
  Calendar,
  Brain,
  Heart,
  Shield,
  Award,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  DATA_MOAT_MESSAGING,
  calculateRetentionIncentives,
  getValueVisualizationData
} from "@/lib/human-os/data-moat";
import { DataMoatAnalysis } from "@/lib/human-os/types";
import Image from "next/image";

interface PersonalDataMoatProps {
  variant?: "dashboard" | "profile" | "compact";
  userTenureDays?: number;
  dataPoints?: number;
  showExportWarning?: boolean;
}

export function PersonalDataMoat({ 
  variant = "dashboard",
  userTenureDays = 45,
  dataPoints = 127,
  showExportWarning = false
}: PersonalDataMoatProps) {
  const [currentStage, setCurrentStage] = useState(0);
  
  const mockAnalysis: DataMoatAnalysis = {
    userId: "user-123",
    tenureDays: userTenureDays,
    dataPointsCollected: dataPoints,
    insightsGenerated: Math.floor(dataPoints * 0.3),
    personalizedRecommendations: Math.floor(dataPoints * 0.15),
    switchingCostEstimate: Math.log(userTenureDays + 1) * 10 + Math.log(dataPoints + 1) * 5,
    valueAccumulationRate: 0.5 + (userTenureDays / 365) * 0.3,
    uniquePatterns: ["Morning stress patterns", "Weekend recovery", "Work anxiety triggers"],
  };

  const retention = calculateRetentionIncentives(mockAnalysis);
  const valueData = getValueVisualizationData(userTenureDays);

  // Find current stage in value progression
  useEffect(() => {
    const stages = DATA_MOAT_MESSAGING.valueProposition;
    for (let i = stages.length - 1; i >= 0; i--) {
      if (valueData.currentValue >= stages[i].value) {
        setCurrentStage(i);
        break;
      }
    }
  }, [valueData.currentValue]);

  if (variant === "compact") {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-brand-gold/10">
              <Lock className="h-5 w-5 text-brand-gold" />
            </div>
            <div>
              <h3 className="font-semibold text-brand-navy">Your Data Moat</h3>
              <p className="text-xs text-muted-foreground">{retention.loyaltyTier}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Value Score</span>
                <span className="font-semibold text-brand-gold">{valueData.currentValue}</span>
              </div>
              <Progress value={(currentStage / 5) * 100} className="h-2" />
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                {retention.nextMilestone.daysAway} days to {retention.nextMilestone.name}
              </span>
              <ChevronRight className="h-4 w-4 text-brand-gold" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === "profile") {
    return (
      <div className="space-y-6">
        {/* Value Header */}
        <Card className="bg-gradient-to-br from-brand-gold/10 to-brand-gold/5 border-brand-gold/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-brand-gold/20">
                  <Award className="h-6 w-6 text-brand-gold" />
                </div>
                <div>
                  <h3 className="font-semibold text-brand-navy">{retention.loyaltyTier}</h3>
                  <p className="text-sm text-muted-foreground">{userTenureDays} days with Human OS</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-brand-gold">{valueData.currentValue}</p>
                <p className="text-xs text-muted-foreground">Personal Value Score</p>
              </div>
            </div>

            {/* Progress to next tier */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress to {retention.nextMilestone.name}</span>
                <span className="text-brand-gold font-medium">{retention.nextMilestone.daysAway} days</span>
              </div>
              <Progress 
                value={100 - (retention.nextMilestone.daysAway / 90) * 100} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card>
          <CardContent className="p-6">
            <h4 className="font-semibold text-brand-navy mb-4">Your Benefits</h4>
            <div className="space-y-3">
              {retention.benefits.map((benefit, i) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="h-2 w-2 rounded-full bg-brand-gold" />
                  <span className="text-sm">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Data Summary */}
        <Card>
          <CardContent className="p-6">
            <h4 className="font-semibold text-brand-navy mb-4">Your Data Intelligence</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Brain className="h-6 w-6 text-brand-teal mx-auto mb-2" />
                <p className="text-xl font-bold text-brand-navy">{mockAnalysis.dataPointsCollected}</p>
                <p className="text-xs text-muted-foreground">Data Points</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Heart className="h-6 w-6 text-brand-gold mx-auto mb-2" />
                <p className="text-xl font-bold text-brand-navy">{mockAnalysis.insightsGenerated}</p>
                <p className="text-xs text-muted-foreground">Insights</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-500 mx-auto mb-2" />
                <p className="text-xl font-bold text-brand-navy">{mockAnalysis.personalizedRecommendations}</p>
                <p className="text-xs text-muted-foreground">Recommendations</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Unique Patterns */}
        <Card>
          <CardContent className="p-6">
            <h4 className="font-semibold text-brand-navy mb-4">Discovered Patterns</h4>
            <div className="space-y-2">
              {mockAnalysis.uniquePatterns.map((pattern) => (
                <div 
                  key={pattern}
                  className="flex items-center gap-3 p-3 bg-brand-teal/5 rounded-lg"
                >
                  <Shield className="h-4 w-4 text-brand-teal" />
                  <span className="text-sm">{pattern}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Export Warning */}
        {showExportWarning && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-orange-800 mb-2">Before You Leave</h4>
                  <p className="text-sm text-orange-700 mb-4">
                    Leaving means losing {userTenureDays} days of learning. Your recommendations 
                    will take approximately {Math.ceil(userTenureDays * 0.7)} days to reach similar 
                    accuracy on any new platform.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Pause Instead</Button>
                    <Button variant="outline" size="sm">Export Summary</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Dashboard variant
  return (
    <section className="py-16 bg-white relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-5"
        style={{ 
          backgroundImage: "url('/assets/b&b-pattern.svg')",
          backgroundSize: "300px",
        }}
      />

      <div className="container relative z-10">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 bg-brand-gold/10 text-brand-gold px-4 py-2 rounded-full mb-4">
            <Lock className="h-4 w-4" />
            <span className="text-sm font-medium">{DATA_MOAT_MESSAGING.headline}</span>
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-navy mb-4">
            {DATA_MOAT_MESSAGING.subheadline}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {DATA_MOAT_MESSAGING.keyMessage}
          </p>
        </div>

        {/* Value Timeline */}
        <div className="mb-12">
          <Card>
            <CardContent className="p-8">
              <h3 className="font-semibold text-xl text-brand-navy mb-8 text-center">
                Your Value Grows Every Day
              </h3>
              
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 rounded-full" />
                <motion.div
                  className="absolute top-6 left-0 h-1 bg-brand-gold rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(currentStage / 5) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                />

                {/* Timeline stages */}
                <div className="relative flex justify-between">
                  {DATA_MOAT_MESSAGING.valueProposition.map((stage, i) => (
                    <motion.div
                      key={stage.stage}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className="flex flex-col items-center"
                      style={{ width: "16.66%" }}
                    >
                      <div 
                        className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-all ${
                          i <= currentStage 
                            ? "bg-brand-gold text-white" 
                            : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        <span className="font-bold">{stage.value}</span>
                      </div>
                      <p className="text-sm font-medium text-brand-navy text-center">
                        {stage.stage}
                      </p>
                      <p className="text-xs text-muted-foreground text-center mt-1 hidden md:block">
                        {stage.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Why Data Matters */}
        <Card className="bg-brand-navy text-white overflow-hidden">
          <CardContent className="p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="font-display text-2xl md:text-3xl font-bold mb-6">
                  {DATA_MOAT_MESSAGING.retention.title}
                </h3>
                <div className="space-y-4">
                  {DATA_MOAT_MESSAGING.retention.points.map((point, i) => (
                    <motion.div
                      key={point}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="h-6 w-6 rounded-full bg-brand-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Calendar className="h-3 w-3 text-brand-gold" />
                      </div>
                      <span className="text-gray-300">{point}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="relative"
                >
                  <div className="w-48 h-48 rounded-full bg-brand-gold/20 flex items-center justify-center">
                    <div className="w-36 h-36 rounded-full bg-brand-gold/30 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-4xl font-bold text-brand-gold">
                          +{(valueData.growthRate).toFixed(0)}%
                        </p>
                        <p className="text-sm text-gray-400">daily growth</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white text-brand-navy px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                    Value compounds daily
                  </div>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default PersonalDataMoat;
