import { NextRequest, NextResponse } from 'next/server';
import { routeToProviders, getRoutingStats } from '@/lib/human-os/decision-engine';
import { UserWellnessProfile, WellnessProvider } from '@/lib/human-os/types';

// Sample providers for demo
const sampleProviders: WellnessProvider[] = [
  { id: '1', name: 'Dr. Sarah Ahmed', modality: 'psychotherapy', specializations: ['anxiety', 'depression', 'stress'], rating: 4.9, availability: true },
  { id: '2', name: 'Coach Michael', modality: 'life-coaching', specializations: ['career', 'leadership', 'motivation'], rating: 4.8, availability: true },
  { id: '3', name: 'Wellness Center Dubai', modality: 'meditation', specializations: ['mindfulness', 'stress', 'sleep'], rating: 4.7, availability: true },
  { id: '4', name: 'FitLife Studio', modality: 'fitness', specializations: ['weight-loss', 'strength', 'wellness'], rating: 4.6, availability: true },
  { id: '5', name: 'Nutrition Plus', modality: 'nutrition', specializations: ['diet', 'weight-management', 'wellness'], rating: 4.8, availability: true },
  { id: '6', name: 'Dr. Fatima Hassan', modality: 'couples-therapy', specializations: ['relationships', 'communication', 'conflict'], rating: 4.9, availability: true },
  { id: '7', name: 'Sleep Clinic UAE', modality: 'sleep', specializations: ['insomnia', 'sleep-quality', 'rest'], rating: 4.7, availability: true },
  { id: '8', name: 'Stress Relief Center', modality: 'stress-management', specializations: ['burnout', 'work-stress', 'anxiety'], rating: 4.8, availability: true },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userNeeds, userId } = body;

    if (!userNeeds || !Array.isArray(userNeeds)) {
      return NextResponse.json(
        { error: 'userNeeds array is required' },
        { status: 400 }
      );
    }

    // Create a sample user profile (in production, fetch from database)
    const userProfile: UserWellnessProfile = {
      userId: userId || 'anonymous',
      tenureDays: 45,
      totalInteractions: 127,
      emotionalHistory: [],
      cognitivePatterns: [],
      preferredModalities: ['psychotherapy', 'meditation', 'life-coaching'],
      successfulInterventions: [],
      dataMoatValue: 250,
    };

    const decision = await routeToProviders(userProfile, userNeeds, sampleProviders);

    return NextResponse.json({
      success: true,
      decision,
      stats: getRoutingStats(),
    });
  } catch (error) {
    console.error('Decision engine error:', error);
    return NextResponse.json(
      { error: 'Failed to process routing decision' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    stats: getRoutingStats(),
    modalities: 10,
    providers: sampleProviders.length,
  });
}
