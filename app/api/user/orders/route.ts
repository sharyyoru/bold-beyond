import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use service role key to bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const { data: orders, error } = await supabase
      .from("provider_orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user orders:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("User orders fetched:", { userId, count: orders?.length });

    return NextResponse.json({ orders: orders || [] });
  } catch (error: any) {
    console.error("User orders error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
