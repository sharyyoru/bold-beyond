import { NextRequest, NextResponse } from 'next/server';
import { 
  generateOrganizationHealthMap,
  getDubaiVision2030Metrics,
  getVision2030Goals 
} from '@/lib/human-os/health-map';

// Sample departments for demo organizations
const sampleOrganizations: Record<string, { id: string; name: string; userCount: number }[]> = {
  'demo-org': [
    { id: 'eng', name: 'Engineering', userCount: 45 },
    { id: 'sales', name: 'Sales', userCount: 32 },
    { id: 'marketing', name: 'Marketing', userCount: 28 },
    { id: 'hr', name: 'Human Resources', userCount: 22 },
    { id: 'finance', name: 'Finance', userCount: 25 },
    { id: 'ops', name: 'Operations', userCount: 38 },
  ],
  'enterprise-corp': [
    { id: 'tech', name: 'Technology', userCount: 120 },
    { id: 'product', name: 'Product', userCount: 65 },
    { id: 'design', name: 'Design', userCount: 35 },
    { id: 'support', name: 'Customer Support', userCount: 85 },
    { id: 'legal', name: 'Legal', userCount: 25 },
    { id: 'exec', name: 'Executive', userCount: 20 },
  ],
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get('organizationId') || 'demo-org';

    const departments = sampleOrganizations[organizationId] || sampleOrganizations['demo-org'];
    const healthMap = generateOrganizationHealthMap(organizationId, departments);

    return NextResponse.json({
      success: true,
      healthMap,
      vision2030: {
        metrics: getDubaiVision2030Metrics(),
        goals: getVision2030Goals(),
      },
    });
  } catch (error) {
    console.error('Health map error:', error);
    return NextResponse.json(
      { error: 'Failed to generate health map' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { organizationId, departments } = body;

    if (!organizationId || !departments || !Array.isArray(departments)) {
      return NextResponse.json(
        { error: 'organizationId and departments array are required' },
        { status: 400 }
      );
    }

    const healthMap = generateOrganizationHealthMap(organizationId, departments);

    return NextResponse.json({
      success: true,
      healthMap,
    });
  } catch (error) {
    console.error('Health map generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate health map' },
      { status: 500 }
    );
  }
}
