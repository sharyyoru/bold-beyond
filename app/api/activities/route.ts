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
    const type = searchParams.get("type");
    const limit = parseInt(searchParams.get("limit") || "20");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    let query = supabase
      .from("user_activities")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (type && type !== "all") {
      query = query.eq("activity_type", type);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ success: true, activities: data });
  } catch (error: any) {
    console.error("Activities fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, activityType, title, description, referenceId, referenceType, metadata, amount } = body;

    if (!userId || !activityType || !title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("user_activities")
      .insert({
        user_id: userId,
        activity_type: activityType,
        title,
        description,
        reference_id: referenceId,
        reference_type: referenceType,
        metadata: metadata || {},
        amount,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, activity: data });
  } catch (error: any) {
    console.error("Activity creation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
