// Human OS Core Types

export interface UserWellnessProfile {
  userId: string;
  tenureDays: number;
  totalInteractions: number;
  emotionalHistory: EmotionalDataPoint[];
  cognitivePatterns: CognitivePattern[];
  preferredModalities: string[];
  successfulInterventions: Intervention[];
  dataMoatValue: number; // Calculated value of personal data
}

export interface EmotionalDataPoint {
  timestamp: Date;
  mood: 'excellent' | 'great' | 'neutral' | 'bad' | 'very-low';
  context: string;
  triggers?: string[];
}

export interface CognitivePattern {
  patternType: string;
  frequency: number;
  lastObserved: Date;
  recommendation?: string;
}

export interface Intervention {
  id: string;
  type: string;
  provider: string;
  effectivenessScore: number;
  timestamp: Date;
}

// Decision Engine Types
export interface WellnessProvider {
  id: string;
  name: string;
  modality: WellnessModality;
  specializations: string[];
  rating: number;
  availability: boolean;
  matchScore?: number;
}

export type WellnessModality = 
  | 'psychotherapy'
  | 'life-coaching'
  | 'meditation'
  | 'fitness'
  | 'nutrition'
  | 'sleep'
  | 'stress-management'
  | 'couples-therapy'
  | 'group-sessions'
  | 'holistic-wellness';

export interface RoutingDecision {
  recommendedProviders: WellnessProvider[];
  matchingFactors: MatchingFactor[];
  confidenceScore: number;
  networkLearningContribution: number;
}

export interface MatchingFactor {
  factor: string;
  weight: number;
  userValue: string;
  providerValue: string;
}

// Network Effects Types
export interface NetworkMetrics {
  totalUsers: number;
  activeToday: number;
  totalInteractions: number;
  routingAccuracy: number;
  networkLearningRate: number;
  dataPointsProcessed: number;
}

export interface NetworkGrowthImpact {
  usersAdded: number;
  accuracyImprovement: number;
  beneficiaryCount: number;
  collectiveInsights: number;
}

// Organizational Health Map Types
export interface OrganizationHealthMap {
  organizationId: string;
  departments: DepartmentHealth[];
  overallScore: number;
  trends: HealthTrend[];
  alerts: HealthAlert[];
  lastUpdated: Date;
}

export interface DepartmentHealth {
  departmentId: string;
  departmentName: string;
  employeeCount: number;
  anonymizedScore: number;
  stressLevel: 'low' | 'moderate' | 'high' | 'critical';
  topConcerns: string[];
  trend: 'improving' | 'stable' | 'declining';
}

export interface HealthTrend {
  metric: string;
  values: { date: Date; value: number }[];
  direction: 'up' | 'down' | 'stable';
}

export interface HealthAlert {
  severity: 'info' | 'warning' | 'critical';
  department: string;
  message: string;
  recommendation: string;
  timestamp: Date;
}

// State of Human Statistics
export interface BurnoutStatistics {
  globalCostBillions: number;
  workplaceStressPercentage: number;
  wellnessProgramFailureRate: number;
  productivityLossPercentage: number;
  yearlyWorkdaysLost: number;
  averageRecoveryMonths: number;
}

// Dubai Vision 2030 Types
export interface HumanCapitalMetrics {
  workforceResilienceScore: number;
  wellbeingAdoptionRate: number;
  nationalProductivityIndex: number;
  mentalHealthAccessibility: number;
  corporatePartnerships: number;
  governmentAlignment: number;
}

export interface Vision2030Goals {
  goal: string;
  target: number;
  current: number;
  alignment: string;
}

// Personal Data Moat Types
export interface DataMoatAnalysis {
  userId: string;
  tenureDays: number;
  dataPointsCollected: number;
  insightsGenerated: number;
  personalizedRecommendations: number;
  switchingCostEstimate: number;
  valueAccumulationRate: number;
  uniquePatterns: string[];
}

export interface DataExportWarning {
  dataCategories: string[];
  estimatedLoss: string;
  alternativeActions: string[];
}
