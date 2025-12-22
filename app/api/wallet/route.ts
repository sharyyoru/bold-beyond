import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Get wallet balance
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // Get or create wallet
    let { data: wallet, error } = await supabase
      .from("user_wallets")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code === "PGRST116") {
      // Create wallet if doesn't exist
      const { data: newWallet } = await supabase
        .from("user_wallets")
        .insert({ user_id: userId, balance: 0 })
        .select()
        .single();
      wallet = newWallet;
    }

    return NextResponse.json({ wallet });
  } catch (error: any) {
    console.error("Error fetching wallet:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Credit or debit wallet
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, type, amount, category, description, referenceId, referenceType, metadata } = body;

    if (!userId || !type || !amount || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get current wallet
    let { data: wallet } = await supabase
      .from("user_wallets")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!wallet) {
      // Create wallet
      const { data: newWallet } = await supabase
        .from("user_wallets")
        .insert({ user_id: userId, balance: 0 })
        .select()
        .single();
      wallet = newWallet;
    }

    let newBalance: number;
    if (type === "credit") {
      newBalance = parseFloat(wallet.balance) + parseFloat(amount);
    } else if (type === "debit") {
      if (parseFloat(wallet.balance) < parseFloat(amount)) {
        return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
      }
      newBalance = parseFloat(wallet.balance) - parseFloat(amount);
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    // Update wallet balance
    await supabase
      .from("user_wallets")
      .update({ balance: newBalance, updated_at: new Date().toISOString() })
      .eq("id", wallet.id);

    // Create transaction record
    const { data: transaction, error: txError } = await supabase
      .from("wallet_transactions")
      .insert({
        user_id: userId,
        wallet_id: wallet.id,
        type,
        amount: parseFloat(amount),
        balance_after: newBalance,
        category,
        description,
        reference_id: referenceId || null,
        reference_type: referenceType || null,
        metadata: metadata || {},
      })
      .select()
      .single();

    if (txError) {
      console.error("Transaction error:", txError);
      return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      transaction,
      newBalance 
    });
  } catch (error: any) {
    console.error("Wallet operation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
