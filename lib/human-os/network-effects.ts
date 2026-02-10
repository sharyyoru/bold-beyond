// Human OS Network Effects - Data Network Effects System
import { NetworkMetrics, NetworkGrowthImpact } from './types';

// Core network metrics - simulated real-time data
export function getNetworkMetrics(): NetworkMetrics {
  return {
    totalUsers: 47523,
    activeToday: 3847,
    totalInteractions: 1247893,
    routingAccuracy: 0.943, // 94.3% accuracy
    networkLearningRate: 0.0012, // 0.12% improvement per 1000 users
    dataPointsProcessed: 89247561,
  };
}

// Calculate the impact of new users on network accuracy
export function calculateNetworkGrowthImpact(newUsers: number): NetworkGrowthImpact {
  const baseAccuracyImprovement = 0.00001; // 0.001% per user
  const diminishingFactor = 0.9999; // Slight diminishing returns
  
  let totalImprovement = 0;
  for (let i = 0; i < newUsers; i++) {
    totalImprovement += baseAccuracyImprovement * Math.pow(diminishingFactor, i);
  }

  // Each new user's data helps the next 10,000 users
  const beneficiaryMultiplier = 10000;
  const beneficiaryCount = newUsers * beneficiaryMultiplier;

  // Collective insights generated from aggregated patterns
  const insightsPerUser = 2.5;
  const collectiveInsights = Math.floor(newUsers * insightsPerUser);

  return {
    usersAdded: newUsers,
    accuracyImprovement: totalImprovement,
    beneficiaryCount,
    collectiveInsights,
  };
}

// Real-time network effect visualization data
export function getNetworkEffectVisualization(): {
  nodes: { id: string; type: 'user' | 'insight' | 'provider'; value: number }[];
  connections: { from: string; to: string; strength: number }[];
  pulseRate: number;
} {
  // Generate sample network visualization data
  const nodes = [
    { id: 'core', type: 'insight' as const, value: 100 },
    ...Array.from({ length: 12 }, (_, i) => ({
      id: `user-${i}`,
      type: 'user' as const,
      value: 20 + Math.random() * 30,
    })),
    ...Array.from({ length: 6 }, (_, i) => ({
      id: `provider-${i}`,
      type: 'provider' as const,
      value: 40 + Math.random() * 20,
    })),
  ];

  const connections = nodes
    .filter(n => n.id !== 'core')
    .map(n => ({
      from: n.id,
      to: 'core',
      strength: 0.5 + Math.random() * 0.5,
    }));

  return {
    nodes,
    connections,
    pulseRate: 1.5, // Seconds between pulses
  };
}

// Network effect messaging for UI
export const NETWORK_EFFECT_MESSAGING = {
  headline: "Data Network Effects",
  subheadline: "Intelligence that compounds with every user",
  keyMessage: "Every new user makes the routing more accurate for the next 10,000 users.",
  metrics: [
    {
      label: "Routing Accuracy",
      value: "94.3%",
      trend: "+2.1% this month",
      icon: "target",
    },
    {
      label: "Learning Rate",
      value: "0.12%",
      trend: "per 1,000 new users",
      icon: "trending-up",
    },
    {
      label: "Data Points",
      value: "89M+",
      trend: "processed securely",
      icon: "database",
    },
    {
      label: "Collective Insights",
      value: "127K",
      trend: "patterns discovered",
      icon: "lightbulb",
    },
  ],
  explanation: [
    "Our AI learns from anonymized patterns across all users",
    "More users = more patterns = better recommendations for everyone",
    "Privacy-preserving federated learning keeps your data secure",
    "The network gets smarter every day, automatically",
  ],
};

// Calculate user's contribution to the network
export function calculateUserNetworkContribution(
  interactionCount: number,
  tenureDays: number,
  uniquePatterns: number
): {
  contributionScore: number;
  usersHelped: number;
  insightsContributed: number;
  rank: string;
} {
  const baseContribution = interactionCount * 0.1;
  const tenureBonus = tenureDays * 0.05;
  const patternBonus = uniquePatterns * 10;
  
  const contributionScore = baseContribution + tenureBonus + patternBonus;
  const usersHelped = Math.floor(contributionScore * 100);
  const insightsContributed = Math.floor(uniquePatterns * 1.5);

  let rank = 'Contributor';
  if (contributionScore > 500) rank = 'Network Champion';
  else if (contributionScore > 200) rank = 'Power Contributor';
  else if (contributionScore > 50) rank = 'Active Contributor';

  return {
    contributionScore,
    usersHelped,
    insightsContributed,
    rank,
  };
}

// Privacy-preserving aggregation explanation
export const PRIVACY_FRAMEWORK = {
  title: "Privacy-First Network Learning",
  principles: [
    {
      name: "Anonymization",
      description: "All data is stripped of personal identifiers before learning",
    },
    {
      name: "Aggregation",
      description: "Insights are only generated from groups of 20+ similar patterns",
    },
    {
      name: "Differential Privacy",
      description: "Mathematical guarantees prevent individual data extraction",
    },
    {
      name: "Local Processing",
      description: "Sensitive analysis happens on-device when possible",
    },
  ],
  compliance: ["GDPR", "HIPAA-aligned", "UAE Data Protection Law"],
};
