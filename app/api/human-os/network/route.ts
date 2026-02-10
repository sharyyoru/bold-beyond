import { NextRequest, NextResponse } from 'next/server';
import { 
  getNetworkMetrics, 
  calculateNetworkGrowthImpact,
  calculateUserNetworkContribution 
} from '@/lib/human-os/network-effects';

export async function GET() {
  try {
    const metrics = getNetworkMetrics();
    const growthImpact = calculateNetworkGrowthImpact(100); // Impact of last 100 users

    return NextResponse.json({
      success: true,
      metrics,
      growthImpact,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Network metrics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch network metrics' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { interactionCount, tenureDays, uniquePatterns } = body;

    const contribution = calculateUserNetworkContribution(
      interactionCount || 50,
      tenureDays || 30,
      uniquePatterns || 5
    );

    return NextResponse.json({
      success: true,
      contribution,
    });
  } catch (error) {
    console.error('Network contribution error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate network contribution' },
      { status: 500 }
    );
  }
}
