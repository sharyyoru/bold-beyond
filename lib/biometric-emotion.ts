// Biometric-Emotion Intelligence Engine
// Maps wearable biometrics, self-reported check-ins, and behavior into a live emotional snapshot.

import {
  UserWellbeingProfile,
  WellbeingProvider,
  RoutingDecision,
} from "@/lib/human-os/types";
import { routeToProviders } from "@/lib/human-os/decision-engine";

export interface BandMetricReading {
  type: "hr" | "hrv" | "sleep" | "steps" | "spo2" | "temperature" | "stress" | "ecg" | "battery";
  value: number | Record<string, unknown>;
  recordedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface NormalizedMetrics {
  hrAvg?: number; // resting/average heart rate
  hrvRmssd?: number; // HRV in ms
  sleepScore?: number; // 0-1
  steps?: number; // raw steps count
  stepsScore?: number; // 0-1 relative to goal
  spo2?: number; // %
  temperature?: number; // celsius
  stress?: number; // 0-1
  selfReportedMood?: number; // 0-1 from wellness check-in
  selfReportedStress?: number; // 0-1 inverted so 1 = calm
  recentCheckinId?: string;
  missedCheckins?: number;
  lastCheckinAt?: string;
}

export interface EmotionalDimensions {
  valence: number; // 0 unpleasant - 1 pleasant
  activation: number; // 0 low - 1 high
  regulation: number; // 0 dysregulated - 1 regulated
  fatigue: number; // 0 recovered - 1 exhausted
}

export interface Suggestion {
  id: string;
  title: string;
  reason: string;
  type: "program" | "provider" | "activity" | "content" | "coach";
  link?: string;
  urgency: "low" | "medium" | "high";
}

export interface EmotionalSnapshot {
  eliScore: number; // 0-100 Emotional Load Index
  dimensions: EmotionalDimensions;
  label: string;
  inputs: NormalizedMetrics & { deviceId?: string; syncedAt?: string };
  suggestions: Suggestion[];
  providerMatches?: RoutingDecision;
  generatedAt: string;
}

// --- Normalization helpers ---

function clamp(num: number, min = 0, max = 1): number {
  return Math.max(min, Math.min(max, num));
}

function inferHRV(reading: Record<string, unknown>): number | undefined {
  if (typeof reading.hrv === "number") return reading.hrv;
  if (typeof reading.rmssd === "number") return reading.rmssd;
  if (typeof reading.HeartRateVariability === "number") return reading.HeartRateVariability;
  return undefined;
}

function inferHeartRate(reading: Record<string, unknown>): number | undefined {
  if (typeof reading.heartRate === "number") return reading.heartRate;
  if (typeof reading.hr === "number") return reading.hr;
  if (typeof reading.HeartRate === "number") return reading.HeartRate;
  if (typeof reading.bpm === "number") return reading.bpm;
  return undefined;
}

function inferSleepScore(reading: Record<string, unknown>): number | undefined {
  const total = Number(reading.totalSleep ?? reading.sleepTime ?? reading.total ?? 0);
  const deep = Number(reading.deepSleep ?? reading.deep ?? 0);
  const awake = Number(reading.awake ?? 0);
  if (total <= 0) return undefined;
  // Normalize total sleep to 6-9h ideal range, penalize awake time
  const hours = total / 60;
  const ideal = 8;
  const durationScore = 1 - Math.min(1, Math.abs(hours - ideal) / 3);
  const wakePenalty = awake / Math.max(total, 1);
  const deepScore = Math.min(1, (deep / Math.max(total, 1)) * 4); // ~25% deep is ideal
  return clamp((durationScore * 0.5 + deepScore * 0.3 + (1 - wakePenalty) * 0.2));
}

export function normalizeBandReadings(
  readings: BandMetricReading[],
  profile?: { dailyStepGoal?: number }
): NormalizedMetrics {
  const result: NormalizedMetrics = {};
  const stepGoal = profile?.dailyStepGoal ?? 8000;

  for (const reading of readings) {
    const r = typeof reading.value === "number" ? { value: reading.value } : (reading.value as Record<string, unknown>);

    switch (reading.type) {
      case "hr": {
        const v = inferHeartRate(r) ?? (typeof reading.value === "number" ? reading.value : undefined);
        if (typeof v === "number") result.hrAvg = v;
        break;
      }
      case "hrv": {
        const v = inferHRV(r) ?? (typeof reading.value === "number" ? reading.value : undefined);
        if (typeof v === "number") result.hrvRmssd = v;
        break;
      }
      case "stress": {
        const v = typeof reading.value === "number" ? reading.value : Number(r.stress ?? r.hrv ?? NaN);
        if (!Number.isNaN(v)) result.stress = clamp(v / 100);
        break;
      }
      case "sleep": {
        result.sleepScore = inferSleepScore(r);
        break;
      }
      case "steps": {
        const v = Number(r.steps ?? r.step ?? r.value ?? reading.value ?? 0);
        result.steps = v;
        result.stepsScore = clamp(v / stepGoal);
        break;
      }
      case "spo2": {
        const v = Number(r.spo2 ?? r.SpO2 ?? reading.value ?? 0);
        if (v > 0) result.spo2 = v;
        break;
      }
      case "temperature": {
        const v = Number(r.temperature ?? r.Temperature ?? reading.value ?? 0);
        if (v > 0) result.temperature = v;
        break;
      }
      default:
        break;
    }
  }

  return result;
}

// --- Snapshot computation ---

function computeActivation(metrics: NormalizedMetrics): number {
  let activation = 0.5;
  if (metrics.hrAvg !== undefined) {
    // Higher HR relative to typical resting range increases activation
    const normalizedHR = clamp((metrics.hrAvg - 50) / 80); // 50 -> 0, 130 -> 1
    activation = activation * 0.4 + normalizedHR * 0.6;
  }
  if (metrics.stress !== undefined) {
    activation = activation * 0.6 + metrics.stress * 0.4;
  }
  return clamp(activation);
}

function computeRegulation(metrics: NormalizedMetrics): number {
  let regulation = 0.5;
  if (metrics.hrvRmssd !== undefined) {
    // Healthy adult RMSSD ~25-45ms average; >50 is good, <20 is poor
    const hrvScore = clamp((metrics.hrvRmssd - 15) / 45);
    regulation = regulation * 0.3 + hrvScore * 0.7;
  }
  if (metrics.spo2 !== undefined) {
    // SpO2 below 95% reduces regulation/health signal
    const spo2Score = metrics.spo2 >= 95 ? 1 : clamp((metrics.spo2 - 85) / 10);
    regulation = regulation * 0.7 + spo2Score * 0.3;
  }
  return clamp(regulation);
}

function computeFatigue(metrics: NormalizedMetrics): number {
  let fatigue = 0.5;
  if (metrics.sleepScore !== undefined) {
    fatigue = fatigue * 0.3 + (1 - metrics.sleepScore) * 0.7;
  }
  if (metrics.stepsScore !== undefined) {
    // Very low movement can increase fatigue perception, but very high can too
    const movementScore = metrics.stepsScore < 0.15 ? 0.8 : metrics.stepsScore > 1.2 ? 0.4 : 0.2;
    fatigue = fatigue * 0.6 + movementScore * 0.4;
  }
  if (metrics.temperature !== undefined) {
    // Feverish temp (>37.8) increases fatigue signal
    const tempFatigue = metrics.temperature > 37.8 ? clamp((metrics.temperature - 37.8) / 2) : 0;
    fatigue = clamp(fatigue * 0.8 + tempFatigue * 0.2);
  }
  return clamp(fatigue);
}

function computeValence(metrics: NormalizedMetrics): number {
  let valence = 0.5;
  // Higher regulation and lower fatigue improve valence
  const regulation = computeRegulation(metrics);
  const fatigue = computeFatigue(metrics);
  valence = regulation * 0.4 + (1 - fatigue) * 0.3 + 0.3 * 0.5; // baseline

  // Self-reported mood strongly anchors valence
  if (metrics.selfReportedMood !== undefined) {
    valence = valence * 0.4 + metrics.selfReportedMood * 0.6;
  }
  return clamp(valence);
}

export function deriveEmotionLabel(dimensions: EmotionalDimensions): string {
  const { valence, activation, regulation, fatigue } = dimensions;
  if (valence >= 0.65 && regulation >= 0.6 && fatigue <= 0.4) {
    return activation >= 0.6 ? "energetic-focused" : "calm-content";
  }
  if (valence <= 0.35 && activation >= 0.6 && regulation <= 0.45) {
    return "stressed-anxious";
  }
  if (valence <= 0.35 && activation <= 0.5 && (fatigue >= 0.6 || regulation <= 0.45)) {
    return "depleted-tired";
  }
  if (fatigue >= 0.65 && valence >= 0.45) {
    return "tired-but-okay";
  }
  if (activation >= 0.65 && regulation >= 0.6 && valence >= 0.55) {
    return "excited-engaged";
  }
  if (valence <= 0.45 && regulation >= 0.55 && activation <= 0.5) {
    return "low-mellow";
  }
  return activation >= 0.55 ? "activated-neutral" : "settled-neutral";
}

export function computeEmotionalSnapshot(
  metrics: NormalizedMetrics,
  deviceId?: string,
  syncedAt?: string
): EmotionalSnapshot {
  const dimensions: EmotionalDimensions = {
    valence: computeValence(metrics),
    activation: computeActivation(metrics),
    regulation: computeRegulation(metrics),
    fatigue: computeFatigue(metrics),
  };

  // ELI: higher when valence/regulation are low and fatigue/activation are high
  const eliScore = Math.round(
    (dimensions.activation * 0.2 +
      (1 - dimensions.valence) * 0.35 +
      (1 - dimensions.regulation) * 0.25 +
      dimensions.fatigue * 0.2) *
      100
  );

  return {
    eliScore,
    dimensions,
    label: deriveEmotionLabel(dimensions),
    inputs: { ...metrics, deviceId, syncedAt },
    suggestions: [],
    generatedAt: new Date().toISOString(),
  };
}

// --- Suggestions ---

export function generateRuleSuggestions(
  snapshot: EmotionalSnapshot,
  context?: { hasBand?: boolean; missedCheckins?: number }
): Suggestion[] {
  const suggestions: Suggestion[] = [];
  const { valence, activation, regulation, fatigue } = snapshot.dimensions;

  if (snapshot.eliScore >= 70) {
    suggestions.push({
      id: "high-eli-coach",
      title: "Talk to a wellbeing coach",
      reason: "Your biometric-emotion load is high right now.",
      type: "coach",
      link: "/appx/human-os",
      urgency: "high",
    });
  }

  if (regulation < 0.35 && fatigue >= 0.5) {
    suggestions.push({
      id: "sleep-recovery",
      title: "Start a sleep recovery program",
      reason: "Low regulation + fatigue often signal poor recovery.",
      type: "program",
      link: "/appx/programs",
      urgency: "high",
    });
  }

  if (regulation < 0.4) {
    suggestions.push({
      id: "breathing-exercise",
      title: "2-minute breathing reset",
      reason: "HRV is low — a short breathing exercise may help regulate your nervous system.",
      type: "activity",
      link: "/appx/regulation",
      urgency: "medium",
    });
  }

  if (valence < 0.35 && activation > 0.7) {
    suggestions.push({
      id: "stress-provider",
      title: "Book a stress-management session",
      reason: "High activation with low mood can indicate acute stress.",
      type: "provider",
      link: "/appx/human-os",
      urgency: "high",
    });
  }

  if (fatigue > 0.7 && (snapshot.inputs.stepsScore ?? 0) < 0.2) {
    suggestions.push({
      id: "gentle-movement",
      title: "Take a light 10-minute walk",
      reason: "Low movement and high fatigue respond well to gentle activity.",
      type: "activity",
      link: "/appx/activities",
      urgency: "medium",
    });
  }

  if (snapshot.inputs.sleepScore !== undefined && snapshot.inputs.sleepScore < 0.35) {
    suggestions.push({
      id: "sleep-content",
      title: "Improve sleep quality",
      reason: "Last night's sleep score was low.",
      type: "content",
      link: "/appx/programs",
      urgency: "medium",
    });
  }

  if (valence > 0.7 && regulation > 0.6) {
    suggestions.push({
      id: "gratitude-journal",
      title: "Capture the moment",
      reason: "Your metrics look balanced — a quick gratitude note can reinforce it.",
      type: "activity",
      link: "/appx/wellness-checkin",
      urgency: "low",
    });
  }

  if (context?.missedCheckins && context.missedCheckins >= 2) {
    suggestions.push({
      id: "checkin-reminder",
      title: "Complete a wellness check-in",
      reason: "We haven't heard from you in a few days; a check-in improves recommendations.",
      type: "activity",
      link: "/appx/wellness-checkin",
      urgency: "medium",
    });
  }

  if (suggestions.length === 0) {
    suggestions.push({
      id: "maintain-balance",
      title: "Maintain today's balance",
      reason: "Your metrics are in a neutral range. Keep your routines steady.",
      type: "content",
      link: "/appx/wellness-tracker",
      urgency: "low",
    });
  }

  return suggestions;
}

// --- Human OS routing integration ---

export function snapshotToUserNeeds(snapshot: EmotionalSnapshot): string[] {
  const needs: string[] = [];
  const { valence, activation, regulation, fatigue } = snapshot.dimensions;

  if (regulation < 0.4) needs.push("stress");
  if (fatigue > 0.65) needs.push("sleep");
  if (valence < 0.4 && activation > 0.65) needs.push("anxiety");
  if (valence < 0.4) needs.push("mood");
  if (fatigue > 0.5 && activation < 0.4) needs.push("energy");
  if (needs.length === 0) needs.push("wellness");

  return needs;
}

export function buildSnapshotProfile(
  userId: string,
  snapshot: EmotionalSnapshot,
  preferredModalities: string[] = ["meditation", "stress-management", "fitness", "sleep"]
): UserWellbeingProfile {
  return {
    userId,
    tenureDays: 0,
    totalInteractions: 0,
    emotionalHistory: [],
    cognitivePatterns: [],
    preferredModalities,
    successfulInterventions: [],
    dataMoatValue: 0,
  };
}

export async function routeSnapshotToProviders(
  userId: string,
  snapshot: EmotionalSnapshot,
  providers: WellbeingProvider[]
): Promise<RoutingDecision> {
  const needs = snapshotToUserNeeds(snapshot);
  const profile = buildSnapshotProfile(userId, snapshot);
  return routeToProviders(profile, needs, providers);
}

export const BIOMETRIC_EMOTION_LABELS = [
  "energetic-focused",
  "calm-content",
  "stressed-anxious",
  "depleted-tired",
  "tired-but-okay",
  "excited-engaged",
  "low-mellow",
  "activated-neutral",
  "settled-neutral",
] as const;
