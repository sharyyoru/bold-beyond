import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const toolType = searchParams.get("toolType");
    const limit = parseInt(searchParams.get("limit") || "20");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    let query = supabase
      .from("regulation_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (toolType) {
      query = query.eq("tool_type", toolType);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ success: true, sessions: data });
  } catch (error: any) {
    console.error("Regulation sessions fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      userId, 
      toolType, 
      toolName,
      responses, 
      completedSteps,
      totalSteps,
      isComplete,
      duration,
      insights,
      metadata 
    } = body;

    if (!userId || !toolType) {
      return NextResponse.json(
        { error: "User ID and tool type are required" },
        { status: 400 }
      );
    }

    // Save the regulation session
    const { data: session, error: sessionError } = await supabase
      .from("regulation_sessions")
      .insert({
        user_id: userId,
        tool_type: toolType,
        tool_name: toolName,
        responses: responses || {},
        completed_steps: completedSteps || 0,
        total_steps: totalSteps || 0,
        is_complete: isComplete || false,
        duration_seconds: duration || 0,
        insights: insights || [],
        metadata: metadata || {},
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (sessionError) throw sessionError;

    // Update wellness scores if session is complete
    if (isComplete) {
      // Calculate score boost based on tool type
      const scoreBoosts: Record<string, number> = {
        'set_outcomes': 8,
        'elicit_values': 6,
        'driving_question': 7,
        'personal_history': 10,
        'the_want': 5,
        'breathing': 3,
        'grounding': 3,
        'tapping': 4,
        'wave': 2,
      };

      const boost = scoreBoosts[toolType] || 3;

      // Get current wellness scores
      const { data: profile } = await supabase
        .from("profiles")
        .select("wellness_scores")
        .eq("id", userId)
        .single();

      if (profile) {
        const currentScores = profile.wellness_scores || {
          mind: 60, body: 60, sleep: 60, energy: 60, 
          mood: 60, stress: 60, focus: 60, hydration: 60, overall: 60
        };

        // Boost relevant scores
        const updatedScores = {
          ...currentScores,
          mind: Math.min(100, (currentScores.mind || 60) + boost),
          mood: Math.min(100, (currentScores.mood || 60) + Math.floor(boost * 0.8)),
          stress: Math.min(100, (currentScores.stress || 60) + Math.floor(boost * 0.6)),
          overall: Math.min(100, (currentScores.overall || 60) + Math.floor(boost * 0.5)),
        };

        await supabase
          .from("profiles")
          .update({ 
            wellness_scores: updatedScores,
            last_checkin: new Date().toISOString()
          })
          .eq("id", userId);
      }

      // Log activity
      await supabase.from("user_activities").insert({
        user_id: userId,
        activity_type: "regulation_tool",
        title: `Completed ${toolName || toolType}`,
        description: `Completed ${completedSteps}/${totalSteps} steps`,
        reference_id: session.id,
        reference_type: "regulation_session",
        metadata: { toolType, duration, insights },
      });
    }

    return NextResponse.json({ 
      success: true, 
      session,
      message: isComplete ? "Session completed and wellness scores updated" : "Session saved"
    });
  } catch (error: any) {
    console.error("Regulation session save error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Get AI recommendations for regulation tools based on user state
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, wellnessScores, nervousSystemStatus, burnoutRisk } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const recommendations: Array<{
      toolType: string;
      toolName: string;
      priority: 'high' | 'medium' | 'low';
      reason: string;
    }> = [];

    // Analyze wellness scores and recommend appropriate tools
    const scores = wellnessScores || {};
    
    // If stress is high or mood is low, recommend immediate regulation
    if ((scores.stress && scores.stress < 50) || (scores.mood && scores.mood < 50)) {
      recommendations.push({
        toolType: 'breathing',
        toolName: 'Box Breathing',
        priority: 'high',
        reason: 'Your stress levels indicate you could benefit from nervous system regulation'
      });
    }

    // If nervous system is dysregulated
    if (nervousSystemStatus === 'dysregulated' || nervousSystemStatus === 'elevated') {
      recommendations.push({
        toolType: 'wave',
        toolName: 'Vagal Reset',
        priority: 'high',
        reason: 'Your nervous system needs immediate calming'
      });
      recommendations.push({
        toolType: 'grounding',
        toolName: '5-4-3-2-1 Grounding',
        priority: 'high',
        reason: 'Grounding will help bring you back to the present moment'
      });
    }

    // If burnout risk is high, recommend deeper work
    if (burnoutRisk === 'high' || burnoutRisk === 'moderate') {
      recommendations.push({
        toolType: 'set_outcomes',
        toolName: 'Set Outcomes',
        priority: 'medium',
        reason: 'Clarifying your goals can help reduce overwhelm and burnout'
      });
      recommendations.push({
        toolType: 'elicit_values',
        toolName: 'Elicit Values',
        priority: 'medium',
        reason: 'Reconnecting with your values can restore motivation'
      });
    }

    // If mind score is low, recommend cognitive tools
    if (scores.mind && scores.mind < 60) {
      recommendations.push({
        toolType: 'driving_question',
        toolName: 'Driving Question',
        priority: 'medium',
        reason: 'Understanding your driving question can bring mental clarity'
      });
    }

    // If overall alignment is low, recommend comprehensive exploration
    if (scores.overall && scores.overall < 55) {
      recommendations.push({
        toolType: 'the_want',
        toolName: 'The Want',
        priority: 'medium',
        reason: 'Exploring what you truly want can help realign your life'
      });
      recommendations.push({
        toolType: 'personal_history',
        toolName: 'Personal History',
        priority: 'low',
        reason: 'Deep exploration of your history can unlock transformative insights'
      });
    }

    // Get recent sessions to avoid recommending what they just did
    const { data: recentSessions } = await supabase
      .from("regulation_sessions")
      .select("tool_type")
      .eq("user_id", userId)
      .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order("created_at", { ascending: false })
      .limit(5);

    const recentToolTypes = new Set(recentSessions?.map(s => s.tool_type) || []);
    
    // Filter out recently used tools and sort by priority
    const filteredRecommendations = recommendations
      .filter(r => !recentToolTypes.has(r.toolType))
      .sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      })
      .slice(0, 3);

    return NextResponse.json({ 
      success: true, 
      recommendations: filteredRecommendations,
      analysisContext: {
        nervousSystemStatus,
        burnoutRisk,
        lowestScores: Object.entries(scores)
          .filter(([k]) => k !== 'overall')
          .sort(([,a], [,b]) => (a as number) - (b as number))
          .slice(0, 2)
          .map(([k, v]) => ({ dimension: k, score: v }))
      }
    });
  } catch (error: any) {
    console.error("Recommendations error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
