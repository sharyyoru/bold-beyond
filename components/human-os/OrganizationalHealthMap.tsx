"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Building2, 
  Users, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Shield,
  Activity,
  BarChart3,
  Eye,
  Lock
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  generateOrganizationHealthMap,
  CORPORATE_LICENSING_MESSAGING 
} from "@/lib/human-os/health-map";
import { DepartmentHealth, HealthAlert } from "@/lib/human-os/types";
import Image from "next/image";

// Sample departments for demo
const sampleDepartments = [
  { id: "eng", name: "Engineering", userCount: 45 },
  { id: "sales", name: "Sales", userCount: 32 },
  { id: "marketing", name: "Marketing", userCount: 28 },
  { id: "hr", name: "Human Resources", userCount: 22 },
  { id: "finance", name: "Finance", userCount: 25 },
  { id: "ops", name: "Operations", userCount: 38 },
];

interface OrganizationalHealthMapProps {
  variant?: "dashboard" | "preview" | "feature";
  organizationId?: string;
}

export function OrganizationalHealthMap({ 
  variant = "dashboard",
  organizationId = "demo-org"
}: OrganizationalHealthMapProps) {
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const healthMap = generateOrganizationHealthMap(organizationId, sampleDepartments);

  const getStressColor = (level: DepartmentHealth['stressLevel']) => {
    switch (level) {
      case 'low': return 'bg-green-500';
      case 'moderate': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStressBadgeVariant = (level: DepartmentHealth['stressLevel']) => {
    switch (level) {
      case 'low': return 'default';
      case 'moderate': return 'secondary';
      case 'high': return 'destructive';
      case 'critical': return 'destructive';
      default: return 'default';
    }
  };

  const getTrendIcon = (trend: DepartmentHealth['trend']) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining': return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'stable': return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  if (variant === "preview") {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-brand-navy/10">
                <BarChart3 className="h-5 w-5 text-brand-navy" />
              </div>
              <div>
                <h3 className="font-semibold text-brand-navy">Health Map</h3>
                <p className="text-xs text-muted-foreground">Organizational wellness</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Lock className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Anonymized</span>
            </div>
          </div>

          {/* Mini visualization */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {healthMap.departments.slice(0, 6).map((dept) => (
              <div 
                key={dept.departmentId}
                className="p-2 rounded-lg bg-gray-50 text-center"
              >
                <div className={`w-3 h-3 rounded-full ${getStressColor(dept.stressLevel)} mx-auto mb-1`} />
                <p className="text-[10px] text-muted-foreground truncate">{dept.departmentName}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall Score</span>
            <span className="font-semibold text-brand-teal">{healthMap.overallScore.toFixed(0)}%</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === "feature") {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 bg-brand-navy/10 text-brand-navy px-4 py-2 rounded-full mb-4">
              <BarChart3 className="h-4 w-4" />
              <span className="text-sm font-medium">Corporate Licensing</span>
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-navy mb-4">
              {CORPORATE_LICENSING_MESSAGING.headline}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {CORPORATE_LICENSING_MESSAGING.subheadline}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {CORPORATE_LICENSING_MESSAGING.features.map((feature, i) => {
              const icons: Record<string, typeof Activity> = {
                activity: Activity,
                shield: Shield,
                "alert-triangle": AlertTriangle,
                "trending-up": TrendingUp,
              };
              const IconComponent = icons[feature.icon] || Activity;
              
              return (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="inline-flex p-3 rounded-lg bg-brand-navy/10 text-brand-navy mb-4">
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <h3 className="font-semibold text-brand-navy mb-2">{feature.name}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Demo Health Map */}
          <Card className="overflow-hidden">
            <div className="bg-brand-navy p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="h-5 w-5 text-brand-gold" />
                <span className="text-white font-medium">Live Demo: Organizational Health Map</span>
              </div>
              <Badge variant="outline" className="border-white/30 text-white">
                <Lock className="h-3 w-3 mr-1" /> Anonymized Data
              </Badge>
            </div>
            
            <CardContent className="p-6">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Department List */}
                <div className="lg:col-span-2">
                  <h4 className="font-semibold text-brand-navy mb-4">Department Wellness</h4>
                  <div className="space-y-3">
                    {healthMap.departments.map((dept, i) => (
                      <motion.div
                        key={dept.departmentId}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedDepartment === dept.departmentId 
                            ? "border-brand-teal bg-brand-teal/5" 
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedDepartment(dept.departmentId)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${getStressColor(dept.stressLevel)}`} />
                            <span className="font-medium">{dept.departmentName}</span>
                            <span className="text-sm text-muted-foreground">
                              ({dept.employeeCount} employees)
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant={getStressBadgeVariant(dept.stressLevel)}>
                              {dept.stressLevel}
                            </Badge>
                            {getTrendIcon(dept.trend)}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex-1 mr-4">
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-brand-teal rounded-full"
                                initial={{ width: 0 }}
                                whileInView={{ width: `${dept.anonymizedScore}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.05 }}
                              />
                            </div>
                          </div>
                          <span className="text-sm font-medium text-brand-teal">
                            {dept.anonymizedScore.toFixed(0)}%
                          </span>
                        </div>

                        {selectedDepartment === dept.departmentId && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-4 pt-4 border-t"
                          >
                            <p className="text-sm text-muted-foreground mb-2">Top Concerns:</p>
                            <div className="flex flex-wrap gap-2">
                              {dept.topConcerns.map((concern) => (
                                <span 
                                  key={concern}
                                  className="px-2 py-1 bg-gray-100 rounded-full text-xs"
                                >
                                  {concern}
                                </span>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Alerts & Score */}
                <div className="space-y-6">
                  <Card className="bg-brand-navy text-white">
                    <CardContent className="p-6 text-center">
                      <p className="text-sm text-gray-400 mb-2">Overall Health Score</p>
                      <p className="text-5xl font-bold text-brand-gold mb-2">
                        {healthMap.overallScore.toFixed(0)}
                      </p>
                      <p className="text-sm text-gray-400">out of 100</p>
                    </CardContent>
                  </Card>

                  <div>
                    <h4 className="font-semibold text-brand-navy mb-3 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      Active Alerts
                    </h4>
                    <div className="space-y-2">
                      {healthMap.alerts.slice(0, 3).map((alert, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: i * 0.1 }}
                          className={`p-3 rounded-lg text-sm ${
                            alert.severity === 'critical' 
                              ? "bg-red-50 border border-red-200" 
                              : alert.severity === 'warning'
                                ? "bg-orange-50 border border-orange-200"
                                : "bg-blue-50 border border-blue-200"
                          }`}
                        >
                          <p className="font-medium">{alert.department}</p>
                          <p className="text-muted-foreground text-xs">{alert.message}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-brand-teal/10 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-brand-teal" />
                      <span className="text-sm font-medium text-brand-teal">Privacy Guaranteed</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      All data anonymized from cohorts of 20+ employees. 
                      Individual data is never exposed.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Tiers */}
          <div className="mt-12">
            <h3 className="text-xl font-semibold text-brand-navy text-center mb-6">
              Corporate Licensing Plans
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {CORPORATE_LICENSING_MESSAGING.pricing.tiers.map((tier, i) => (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Card className={`h-full ${i === 1 ? "border-brand-gold border-2" : ""}`}>
                    {i === 1 && (
                      <div className="bg-brand-gold text-white text-center py-1 text-sm font-medium">
                        Most Popular
                      </div>
                    )}
                    <CardContent className="p-6">
                      <h4 className="font-semibold text-xl text-brand-navy mb-1">{tier.name}</h4>
                      <p className="text-sm text-muted-foreground mb-4">{tier.employees} employees</p>
                      
                      <ul className="space-y-2 mb-6">
                        {tier.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-sm">
                            <div className="h-1.5 w-1.5 rounded-full bg-brand-teal" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      
                      <Button 
                        variant={i === 1 ? "gold" : "outline"} 
                        className="w-full"
                      >
                        Get Started
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Dashboard variant - full health map
  return (
    <div className="space-y-6">
      {/* Overall Score Card */}
      <Card className="bg-gradient-to-br from-brand-navy to-brand-navy-light text-white overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Organizational Health Score</p>
              <p className="text-4xl font-bold text-brand-gold">{healthMap.overallScore.toFixed(0)}%</p>
              <p className="text-sm text-gray-400 mt-1">
                Last updated: {healthMap.lastUpdated.toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-brand-gold" />
              <span className="text-sm">Anonymized</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Departments Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {healthMap.departments.map((dept) => (
          <Card key={dept.departmentId} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-brand-navy" />
                  <span className="font-medium">{dept.departmentName}</span>
                </div>
                <Badge variant={getStressBadgeVariant(dept.stressLevel)}>
                  {dept.stressLevel}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{dept.employeeCount} employees</span>
                {getTrendIcon(dept.trend)}
              </div>

              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brand-teal rounded-full transition-all"
                  style={{ width: `${dept.anonymizedScore}%` }}
                />
              </div>
              <p className="text-right text-sm text-brand-teal mt-1">
                {dept.anonymizedScore.toFixed(0)}%
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alerts */}
      {healthMap.alerts.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-brand-navy mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Active Alerts ({healthMap.alerts.length})
            </h3>
            <div className="space-y-3">
              {healthMap.alerts.map((alert, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-lg ${
                    alert.severity === 'critical' 
                      ? "bg-red-50 border-l-4 border-red-500" 
                      : alert.severity === 'warning'
                        ? "bg-orange-50 border-l-4 border-orange-500"
                        : "bg-blue-50 border-l-4 border-blue-500"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{alert.department}</span>
                    <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                      {alert.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                  <p className="text-sm text-brand-teal">
                    <strong>Recommendation:</strong> {alert.recommendation}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default OrganizationalHealthMap;
