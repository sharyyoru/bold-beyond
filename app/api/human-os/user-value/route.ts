import { NextRequest, NextResponse } from 'next/server';
import { 
  calculateDataMoatValue,
  calculateRetentionIncentives,
  getValueVisualizationData,
  generateExportWarning
} from '@/lib/human-os/data-moat';
import { UserWellnessProfile } from '@/lib/human-os/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'demo-user';
    const tenureDays = parseInt(searchParams.get('tenureDays') || '45');

    // Create sample user profile (in production, fetch from database)
    const userProfile: UserWellnessProfile = {
      userId,
      tenureDays,
      totalInteractions: tenureDays * 3,
      emotionalHistory: Array.from({ length: tenureDays }, (_, i) => ({
        timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
        mood: ['excellent', 'great', 'neutral', 'bad', 'very-low'][Math.floor(Math.random() * 3)] as any,
        context: 'daily-checkin',
      })),
      cognitivePatterns: [
        { patternType: 'Morning stress patterns', frequency: 12, lastObserved: new Date() },
        { patternType: 'Weekend recovery', frequency: 8, lastObserved: new Date() },
        { patternType: 'Work anxiety triggers', frequency: 15, lastObserved: new Date() },
      ],
      preferredModalities: ['meditation', 'psychotherapy', 'fitness'],
      successfulInterventions: [
        { id: '1', type: 'meditation', provider: 'Wellness Center', effectivenessScore: 0.85, timestamp: new Date() },
        { id: '2', type: 'life-coaching', provider: 'Coach Michael', effectivenessScore: 0.78, timestamp: new Date() },
      ],
      dataMoatValue: 250,
    };

    const moatAnalysis = calculateDataMoatValue(userProfile);
    const retentionIncentives = calculateRetentionIncentives(moatAnalysis);
    const valueVisualization = getValueVisualizationData(tenureDays);

    return NextResponse.json({
      success: true,
      moatAnalysis,
      retentionIncentives,
      valueVisualization,
    });
  } catch (error) {
    console.error('User value calculation error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate user value' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userId, tenureDays } = body;

    if (action === 'export-warning') {
      const userProfile: UserWellnessProfile = {
        userId: userId || 'demo-user',
        tenureDays: tenureDays || 45,
        totalInteractions: (tenureDays || 45) * 3,
        emotionalHistory: [],
        cognitivePatterns: [
          { patternType: 'Morning stress patterns', frequency: 12, lastObserved: new Date() },
          { patternType: 'Weekend recovery', frequency: 8, lastObserved: new Date() },
        ],
        preferredModalities: ['meditation', 'psychotherapy'],
        successfulInterventions: [],
        dataMoatValue: 250,
      };

      const moatAnalysis = calculateDataMoatValue(userProfile);
      const exportWarning = generateExportWarning(moatAnalysis);

      return NextResponse.json({
        success: true,
        exportWarning,
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('User value action error:', error);
    return NextResponse.json(
      { error: 'Failed to process action' },
      { status: 500 }
    );
  }
}
