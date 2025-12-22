import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, cancelledBy, reason } = body;

    if (!orderId || !cancelledBy) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Fetch order
    const { data: order, error: fetchError } = await supabase
      .from("provider_orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (fetchError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check if already cancelled or delivered
    if (order.status === "cancelled") {
      return NextResponse.json({ error: "Order already cancelled" }, { status: 400 });
    }

    if (order.status === "delivered") {
      return NextResponse.json({ error: "Cannot cancel delivered order" }, { status: 400 });
    }

    // Calculate refund amount
    const refundAmount = order.total_amount || order.total || 0;

    // Update order status
    const { error: updateError } = await supabase
      .from("provider_orders")
      .update({
        status: "cancelled",
        cancelled_at: new Date().toISOString(),
        cancelled_by: cancelledBy,
        cancellation_reason: reason,
        refund_amount: refundAmount,
        refund_status: "pending",
      })
      .eq("id", orderId);

    if (updateError) {
      console.error("Update error:", updateError);
      return NextResponse.json({ error: "Failed to cancel order" }, { status: 500 });
    }

    // Process refund to user wallet if user exists and payment was made
    if (order.user_id && order.payment_status === "paid" && refundAmount > 0) {
      // Get or create wallet
      let { data: wallet } = await supabase
        .from("user_wallets")
        .select("*")
        .eq("user_id", order.user_id)
        .single();

      if (!wallet) {
        const { data: newWallet } = await supabase
          .from("user_wallets")
          .insert({ user_id: order.user_id, balance: 0 })
          .select()
          .single();
        wallet = newWallet;
      }

      if (wallet) {
        const newBalance = parseFloat(wallet.balance) + refundAmount;

        // Update wallet
        await supabase
          .from("user_wallets")
          .update({ balance: newBalance, updated_at: new Date().toISOString() })
          .eq("id", wallet.id);

        // Create transaction
        await supabase.from("wallet_transactions").insert({
          user_id: order.user_id,
          wallet_id: wallet.id,
          type: "credit",
          amount: refundAmount,
          balance_after: newBalance,
          category: "order_refund",
          description: `Refund for cancelled order #${order.order_number}`,
          reference_id: orderId,
          reference_type: "order",
          metadata: {
            order_number: order.order_number,
            cancelled_by: cancelledBy,
          },
        });

        // Update refund status
        await supabase
          .from("provider_orders")
          .update({ refund_status: "processed" })
          .eq("id", orderId);
      }

      // Create user notification
      await supabase.from("user_notifications").insert({
        user_id: order.user_id,
        type: "order_update",
        title: "Order Cancelled",
        message: `Your order #${order.order_number} has been cancelled. ${refundAmount} AED has been credited to your wallet.`,
        reference_id: orderId,
        reference_type: "order",
        sent_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Order cancelled successfully",
      refundAmount,
    });
  } catch (error: any) {
    console.error("Cancel order error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
