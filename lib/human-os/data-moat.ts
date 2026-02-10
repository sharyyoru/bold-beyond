// Human OS Personal Data Moat - Switching Cost System
import { DataMoatAnalysis, DataExportWarning, UserWellnessProfile } from './types';

// Calculate the personal data moat value for a user
export function calculateDataMoatValue(profile: UserWellnessProfile): DataMoatAnalysis {
  const tenureDays = profile.tenureDays;
  const dataPointsCollected = profile.emotionalHistory.length + 
    profile.cognitivePatterns.length * 10 +
    profile.successfulInterventions.length * 5;
  
  // Insights generated from the data
  const insightsGenerated = Math.floor(dataPointsCollected * 0.3);
  
  // Personalized recommendations based on history
  const personalizedRecommendations = profile.successfulInterventions.length * 3 +
    profile.preferredModalities.length * 5;

  // Switching cost increases with tenure and data
  const tenureFactor = Math.log(tenureDays + 1) * 10;
  const dataFactor = Math.log(dataPointsCollected + 1) * 5;
  const insightFactor = insightsGenerated * 0.5;
  
  const switchingCostEstimate = tenureFactor + dataFactor + insightFactor;

  // Value accumulation rate (percentage increase per day)
  const valueAccumulationRate = 0.5 + (tenureDays / 365) * 0.3;

  // Unique patterns discovered about this user
  const uniquePatterns = profile.cognitivePatterns.map(p => p.patternType);

  return {
    userId: profile.userId,
    tenureDays,
    dataPointsCollected,
    insightsGenerated,
    personalizedRecommendations,
    switchingCostEstimate,
    valueAccumulationRate,
    uniquePatterns,
  };
}

// Generate warning when user considers leaving
export function generateExportWarning(analysis: DataMoatAnalysis): DataExportWarning {
  const dataCategories = [
    `${analysis.dataPointsCollected} emotional data points`,
    `${analysis.insightsGenerated} personalized insights`,
    `${analysis.uniquePatterns.length} unique behavioral patterns`,
    `${analysis.personalizedRecommendations} tailored recommendations`,
    `${analysis.tenureDays} days of wellness history`,
  ];

  const estimatedLoss = `Leaving means losing ${analysis.tenureDays} days of learning. ` +
    `Your recommendations will take approximately ${Math.ceil(analysis.tenureDays * 0.7)} days ` +
    `to reach similar accuracy on any new platform.`;

  const alternativeActions = [
    "Pause your account instead - keep your data safe",
    "Export a summary report for your records",
    "Reduce activity level instead of leaving",
    "Schedule a call with our team to discuss concerns",
  ];

  return {
    dataCategories,
    estimatedLoss,
    alternativeActions,
  };
}

// Personal Data Moat messaging for UI
export const DATA_MOAT_MESSAGING = {
  headline: "Your Personal Data Moat",
  subheadline: "The system becomes an externalized hard drive for your emotional and cognitive history",
  keyMessage: "The longer you stay, the more valuable your personal intelligence becomes.",
  valueProposition: [
    {
      stage: "Day 1",
      description: "Basic preferences captured",
      value: 10,
    },
    {
      stage: "Week 1",
      description: "Initial patterns emerging",
      value: 35,
    },
    {
      stage: "Month 1",
      description: "Personalized recommendations active",
      value: 100,
    },
    {
      stage: "Month 3",
      description: "Deep behavioral insights available",
      value: 250,
    },
    {
      stage: "Month 6",
      description: "Predictive wellness alerts enabled",
      value: 500,
    },
    {
      stage: "Year 1",
      description: "Complete wellness intelligence profile",
      value: 1000,
    },
  ],
  retention: {
    title: "Why Your Data Matters",
    points: [
      "Your emotional patterns help predict and prevent burnout",
      "Historical data enables increasingly accurate recommendations",
      "Your cognitive history becomes a personal wellness journal",
      "Intervention success data guides future decisions",
    ],
  },
};

// Calculate retention incentives based on data moat
export function calculateRetentionIncentives(analysis: DataMoatAnalysis): {
  loyaltyTier: string;
  benefits: string[];
  nextMilestone: { name: string; daysAway: number };
} {
  let loyaltyTier = 'Explorer';
  let benefits: string[] = ['Basic recommendations'];

  if (analysis.tenureDays >= 365) {
    loyaltyTier = 'Wellness Champion';
    benefits = [
      'Priority provider matching',
      'Advanced predictive insights',
      'Exclusive wellness content',
      'Personal wellness advisor access',
      'Annual wellness report',
    ];
  } else if (analysis.tenureDays >= 180) {
    loyaltyTier = 'Wellness Advocate';
    benefits = [
      'Enhanced recommendations',
      'Predictive wellness alerts',
      'Premium content access',
      'Quarterly wellness reviews',
    ];
  } else if (analysis.tenureDays >= 90) {
    loyaltyTier = 'Wellness Seeker';
    benefits = [
      'Personalized recommendations',
      'Pattern recognition active',
      'Monthly wellness summaries',
    ];
  } else if (analysis.tenureDays >= 30) {
    loyaltyTier = 'Wellness Starter';
    benefits = [
      'Basic personalization',
      'Initial patterns tracked',
      'Weekly check-in insights',
    ];
  }

  // Calculate next milestone
  const milestones = [30, 90, 180, 365];
  const nextMilestoneDay = milestones.find(m => m > analysis.tenureDays) || 730;
  const milestoneNames: Record<number, string> = {
    30: 'Wellness Starter',
    90: 'Wellness Seeker',
    180: 'Wellness Advocate',
    365: 'Wellness Champion',
    730: 'Wellness Legend',
  };

  return {
    loyaltyTier,
    benefits,
    nextMilestone: {
      name: milestoneNames[nextMilestoneDay],
      daysAway: nextMilestoneDay - analysis.tenureDays,
    },
  };
}

// Value visualization for UI
export function getValueVisualizationData(tenureDays: number): {
  currentValue: number;
  projectedValue30Days: number;
  projectedValue90Days: number;
  growthRate: number;
} {
  const baseValue = 10;
  const growthRate = 0.03; // 3% daily compound growth (simplified)
  
  const currentValue = baseValue * Math.pow(1 + growthRate, tenureDays);
  const projectedValue30Days = baseValue * Math.pow(1 + growthRate, tenureDays + 30);
  const projectedValue90Days = baseValue * Math.pow(1 + growthRate, tenureDays + 90);

  return {
    currentValue: Math.round(currentValue),
    projectedValue30Days: Math.round(projectedValue30Days),
    projectedValue90Days: Math.round(projectedValue90Days),
    growthRate: growthRate * 100,
  };
}
