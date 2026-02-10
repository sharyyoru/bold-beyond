"use client";

import { motion } from "framer-motion";
import { 
  Building2, 
  Users, 
  Globe,
  Target,
  Shield,
  TrendingUp,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  getDubaiVision2030Metrics, 
  getVision2030Goals,
  DUBAI_VISION_2030_MESSAGING 
} from "@/lib/human-os/health-map";
import Image from "next/image";

interface DubaiVision2030Props {
  variant?: "full" | "compact" | "stats";
  showPartnership?: boolean;
}

export function DubaiVision2030({ 
  variant = "full",
  showPartnership = true 
}: DubaiVision2030Props) {
  const metrics = getDubaiVision2030Metrics();
  const goals = getVision2030Goals();

  if (variant === "stats") {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-brand-gold">{metrics.workforceResilienceScore}%</p>
            <p className="text-xs text-muted-foreground">Workforce Resilience</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-brand-teal">{metrics.corporatePartnerships}</p>
            <p className="text-xs text-muted-foreground">Corporate Partners</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-brand-navy">{metrics.governmentAlignment}%</p>
            <p className="text-xs text-muted-foreground">Gov Alignment</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-brand-navy/10">
              <Building2 className="h-5 w-5 text-brand-navy" />
            </div>
            <div>
              <h3 className="font-semibold text-brand-navy">Dubai Vision 2030</h3>
              <p className="text-xs text-muted-foreground">Human Capital Optimization</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Government Alignment</span>
                <span className="font-semibold text-brand-navy">{metrics.governmentAlignment}%</span>
              </div>
              <Progress value={metrics.governmentAlignment} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Full variant
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-brand-navy via-brand-navy to-brand-navy-light relative overflow-hidden">
      {/* Background pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{ 
          backgroundImage: "url('/assets/b&b-diamond-pattern.svg')",
          backgroundSize: "200px",
        }}
      />

      <div className="container relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 bg-brand-gold/20 text-brand-gold px-4 py-2 rounded-full mb-6">
            <Building2 className="h-4 w-4" />
            <span className="text-sm font-medium">Regional Leadership</span>
          </span>
          
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
            {DUBAI_VISION_2030_MESSAGING.headline}
          </h2>
          
          <p className="text-xl text-brand-gold mb-6">
            {DUBAI_VISION_2030_MESSAGING.subheadline}
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            {DUBAI_VISION_2030_MESSAGING.keyMessages.map((message, i) => (
              <span 
                key={message}
                className="px-4 py-2 bg-white/10 rounded-full text-sm text-white"
              >
                {message}
              </span>
            ))}
          </div>
        </div>

        {/* Goals Progress */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {goals.map((goal, i) => (
            <motion.div
              key={goal.goal}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="bg-white/10 border-white/10 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white">{goal.goal}</h3>
                    <span className="text-brand-gold font-bold">
                      {goal.current}% / {goal.target}%
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-brand-gold to-brand-gold/70 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(goal.current / goal.target) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                      />
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-300">
                    <span className="text-brand-gold">Our contribution:</span> {goal.alignment}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Alignment Points */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-sm mb-12">
          <CardContent className="p-8">
            <h3 className="font-semibold text-xl text-white mb-6 text-center">
              Strategic Alignment with National Vision
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {DUBAI_VISION_2030_MESSAGING.alignmentPoints.map((point, i) => (
                <motion.div
                  key={point.vision}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex p-3 rounded-full bg-brand-gold/20 mb-4">
                    <Target className="h-6 w-6 text-brand-gold" />
                  </div>
                  <h4 className="font-semibold text-brand-gold mb-2">{point.vision}</h4>
                  <p className="text-sm text-gray-300">{point.contribution}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Partnership Section */}
        {showPartnership && (
          <Card className="bg-white overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="h-6 w-6 text-brand-navy" />
                    <h3 className="font-semibold text-xl text-brand-navy">
                      {DUBAI_VISION_2030_MESSAGING.partnership.title}
                    </h3>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    {DUBAI_VISION_2030_MESSAGING.partnership.points.map((point, i) => (
                      <motion.div
                        key={point}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: i * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <CheckCircle2 className="h-5 w-5 text-brand-teal flex-shrink-0" />
                        <span className="text-gray-700">{point}</span>
                      </motion.div>
                    ))}
                  </div>

                  <Button variant="gold" size="lg" className="group">
                    Partner With Us
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>

                <div className="flex justify-center">
                  <div className="relative">
                    <Image
                      src="/assets/mandala-logo.svg"
                      alt="Human OS"
                      width={200}
                      height={200}
                      className="opacity-20"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Globe className="h-12 w-12 text-brand-navy mx-auto mb-2" />
                        <p className="text-sm font-medium text-brand-navy">Dubai & UAE Ready</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Metrics Bar */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Workforce Resilience", value: `${metrics.workforceResilienceScore}%`, icon: Users },
            { label: "Wellbeing Adoption", value: `${metrics.wellbeingAdoptionRate}%`, icon: TrendingUp },
            { label: "Corporate Partners", value: metrics.corporatePartnerships, icon: Building2 },
            { label: "Gov Alignment", value: `${metrics.governmentAlignment}%`, icon: Shield },
          ].map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            >
              <Card className="bg-white/10 border-white/10">
                <CardContent className="p-4 text-center">
                  <metric.icon className="h-5 w-5 text-brand-gold mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{metric.value}</p>
                  <p className="text-xs text-gray-400">{metric.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default DubaiVision2030;
