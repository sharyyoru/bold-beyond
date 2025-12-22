import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use service role key to bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { data: orders, error } = await supabase
      .from("provider_orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("Admin orders fetched:", orders?.length);

    return NextResponse.json({ orders: orders || [] });
  } catch (error: any) {
    console.error("Admin orders error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
