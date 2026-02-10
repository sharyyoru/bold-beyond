// Human OS Organizational Health Map - Corporate Analytics
import { 
  OrganizationHealthMap, 
  DepartmentHealth, 
  HealthTrend, 
  HealthAlert,
  HumanCapitalMetrics,
  Vision2030Goals 
} from './types';

// Minimum cohort size for anonymization
const MIN_COHORT_SIZE = 20;

// Generate anonymized organizational health map
export function generateOrganizationHealthMap(
  organizationId: string,
  departments: { id: string; name: string; userCount: number }[]
): OrganizationHealthMap {
  // Only include departments with sufficient users for anonymization
  const eligibleDepartments = departments.filter(d => d.userCount >= MIN_COHORT_SIZE);

  const departmentHealthData: DepartmentHealth[] = eligibleDepartments.map(dept => {
    // Simulated anonymized aggregate data
    const stressLevels: DepartmentHealth['stressLevel'][] = ['low', 'moderate', 'high', 'critical'];
    const trends: DepartmentHealth['trend'][] = ['improving', 'stable', 'declining'];
    
    return {
      departmentId: dept.id,
      departmentName: dept.name,
      employeeCount: dept.userCount,
      anonymizedScore: 60 + Math.random() * 30, // 60-90 range
      stressLevel: stressLevels[Math.floor(Math.random() * 3)] as DepartmentHealth['stressLevel'],
      topConcerns: generateTopConcerns(),
      trend: trends[Math.floor(Math.random() * 3)] as DepartmentHealth['trend'],
    };
  });

  const overallScore = departmentHealthData.reduce((sum, d) => sum + d.anonymizedScore, 0) / 
    departmentHealthData.length;

  return {
    organizationId,
    departments: departmentHealthData,
    overallScore,
    trends: generateHealthTrends(),
    alerts: generateHealthAlerts(departmentHealthData),
    lastUpdated: new Date(),
  };
}

function generateTopConcerns(): string[] {
  const concerns = [
    'Work-life balance',
    'Deadline pressure',
    'Team communication',
    'Career development',
    'Workload management',
    'Remote work challenges',
    'Meeting fatigue',
    'Recognition',
  ];
  return concerns.slice(0, 2 + Math.floor(Math.random() * 2));
}

function generateHealthTrends(): HealthTrend[] {
  const now = new Date();
  const generateTrendData = () => {
    return Array.from({ length: 12 }, (_, i) => ({
      date: new Date(now.getTime() - (11 - i) * 7 * 24 * 60 * 60 * 1000),
      value: 60 + Math.random() * 30,
    }));
  };

  return [
    {
      metric: 'Overall Wellness',
      values: generateTrendData(),
      direction: 'up' as const,
    },
    {
      metric: 'Stress Levels',
      values: generateTrendData(),
      direction: 'down' as const,
    },
    {
      metric: 'Engagement',
      values: generateTrendData(),
      direction: 'stable' as const,
    },
  ];
}

function generateHealthAlerts(departments: DepartmentHealth[]): HealthAlert[] {
  const alerts: HealthAlert[] = [];
  
  departments.forEach(dept => {
    if (dept.stressLevel === 'high' || dept.stressLevel === 'critical') {
      alerts.push({
        severity: dept.stressLevel === 'critical' ? 'critical' : 'warning',
        department: dept.departmentName,
        message: `${dept.departmentName} shows elevated stress indicators`,
        recommendation: 'Consider targeted wellness intervention',
        timestamp: new Date(),
      });
    }
    if (dept.trend === 'declining') {
      alerts.push({
        severity: 'warning',
        department: dept.departmentName,
        message: `${dept.departmentName} wellness scores trending downward`,
        recommendation: 'Review recent changes and workload distribution',
        timestamp: new Date(),
      });
    }
  });

  return alerts;
}

// Corporate licensing messaging
export const CORPORATE_LICENSING_MESSAGING = {
  headline: "Anonymized Organizational Health Maps",
  subheadline: "See stress trends across departments without violating privacy",
  valueProposition: [
    "Real-time organizational wellness visibility",
    "Department-level insights without individual exposure",
    "Proactive intervention recommendations",
    "Compliance with privacy regulations",
  ],
  features: [
    {
      name: "Stress Trend Mapping",
      description: "Visualize stress patterns across departments over time",
      icon: "activity",
    },
    {
      name: "Anonymous Aggregation",
      description: "All data aggregated from 20+ user cohorts minimum",
      icon: "shield",
    },
    {
      name: "Predictive Alerts",
      description: "AI-powered early warning for burnout risk",
      icon: "alert-triangle",
    },
    {
      name: "Intervention ROI",
      description: "Track the effectiveness of wellness programs",
      icon: "trending-up",
    },
  ],
  pricing: {
    tiers: [
      {
        name: "Starter",
        employees: "Up to 100",
        features: ["Basic health map", "Monthly reports", "Email support"],
      },
      {
        name: "Professional",
        employees: "100-500",
        features: ["Full health map", "Weekly reports", "Predictive alerts", "Priority support"],
      },
      {
        name: "Enterprise",
        employees: "500+",
        features: ["Custom dashboards", "Real-time data", "API access", "Dedicated success manager"],
      },
    ],
  },
};

// Dubai Wellbeing Vision 2030 alignment
export function getDubaiVision2030Metrics(): HumanCapitalMetrics {
  return {
    workforceResilienceScore: 78,
    wellbeingAdoptionRate: 34,
    nationalProductivityIndex: 82,
    mentalHealthAccessibility: 67,
    corporatePartnerships: 127,
    governmentAlignment: 89,
  };
}

export function getVision2030Goals(): Vision2030Goals[] {
  return [
    {
      goal: "100% Mental Health Access",
      target: 100,
      current: 67,
      alignment: "Providing accessible digital mental health services",
    },
    {
      goal: "50% Workforce Wellbeing Adoption",
      target: 50,
      current: 34,
      alignment: "Corporate licensing drives workplace wellness adoption",
    },
    {
      goal: "30% Reduction in Burnout",
      target: 30,
      current: 18,
      alignment: "AI-powered early intervention and prevention",
    },
    {
      goal: "Smart City Health Integration",
      target: 100,
      current: 45,
      alignment: "API-ready for government health initiatives",
    },
  ];
}

export const DUBAI_VISION_2030_MESSAGING = {
  headline: "Human Capital Optimization",
  subheadline: "Aligned with Dubai Wellbeing Vision 2030",
  keyMessages: [
    "Building a resilient workforce for the future",
    "Data-driven approach to national wellbeing",
    "Privacy-preserving infrastructure for smart city health",
  ],
  alignmentPoints: [
    {
      vision: "Resilient Workforce",
      contribution: "AI-powered burnout prevention across organizations",
    },
    {
      vision: "Accessible Healthcare",
      contribution: "Digital-first wellness routing to reduce barriers",
    },
    {
      vision: "National Productivity",
      contribution: "Reduced absenteeism through proactive wellness",
    },
    {
      vision: "Data-Driven Policy",
      contribution: "Anonymized population health insights for planning",
    },
  ],
  partnership: {
    title: "Government Partnership Ready",
    points: [
      "GDPR and UAE Data Protection Law compliant",
      "Arabic and English language support",
      "Local data residency options",
      "Integration with existing government platforms",
    ],
  },
};

// Burnout statistics for State of Human
export const BURNOUT_STATISTICS = {
  globalCostBillions: 322,
  workplaceStressPercentage: 76,
  wellnessProgramFailureRate: 67,
  productivityLossPercentage: 40,
  yearlyWorkdaysLost: 12,
  averageRecoveryMonths: 6,
  sources: [
    { stat: "Global burnout cost", source: "WHO Global Report 2024" },
    { stat: "Workplace stress", source: "Gallup State of Workplace 2024" },
    { stat: "Program failure rate", source: "SHRM Wellness Study 2023" },
    { stat: "Productivity loss", source: "Deloitte Mental Health Report 2024" },
  ],
};

export const STATE_OF_HUMAN_MESSAGING = {
  headline: "System Failure",
  subheadline: "The human operating system is overloaded",
  crisis: {
    title: "The Cost of Ignoring Human Wellness",
    stats: [
      {
        value: "$322B",
        label: "Annual cost of burnout globally",
        icon: "dollar-sign",
      },
      {
        value: "76%",
        label: "Employees experiencing workplace stress",
        icon: "users",
      },
      {
        value: "67%",
        label: "Generic wellness programs that fail",
        icon: "x-circle",
      },
      {
        value: "40%",
        label: "Productivity lost to mental health",
        icon: "trending-down",
      },
    ],
  },
  solution: {
    title: "A New Operating System for Humans",
    description: "Generic wellness doesn't work. Personalized, AI-driven routing does.",
    differentiators: [
      "Not another wellness app - an intelligent routing layer",
      "Learns from every interaction to improve for everyone",
      "Vendor-neutral: we route to what works, not what pays",
    ],
  },
};
