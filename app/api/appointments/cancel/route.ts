import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { appointmentId, cancelledBy, reason } = body;

    if (!appointmentId || !cancelledBy) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Fetch appointment
    const { data: appointment, error: fetchError } = await supabase
      .from("appointments")
      .select("*")
      .eq("id", appointmentId)
      .single();

    if (fetchError || !appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    // Check if already cancelled
    if (appointment.status === "cancelled") {
      return NextResponse.json({ error: "Appointment already cancelled" }, { status: 400 });
    }

    // Check 1-hour rule for provider cancellation
    if (cancelledBy === "provider") {
      const appointmentDateTime = new Date(`${appointment.appointment_date}T${appointment.appointment_time}`);
      const now = new Date();
      const hoursBefore = (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

      if (hoursBefore < 1) {
        return NextResponse.json({ 
          error: "Cannot cancel appointment less than 1 hour before scheduled time" 
        }, { status: 400 });
      }
    }

    // Calculate refund amount (full refund for provider cancellation)
    const refundAmount = appointment.service_price || 0;

    // Update appointment status
    const { error: updateError } = await supabase
      .from("appointments")
      .update({
        status: "cancelled",
        cancelled_at: new Date().toISOString(),
        cancelled_by: cancelledBy,
        cancellation_reason: reason,
        refund_amount: refundAmount,
        refund_status: "pending",
      })
      .eq("id", appointmentId);

    if (updateError) {
      console.error("Update error:", updateError);
      return NextResponse.json({ error: "Failed to cancel appointment" }, { status: 500 });
    }

    // Process refund to user wallet if user exists and payment was made
    if (appointment.user_id && appointment.payment_status === "paid" && refundAmount > 0) {
      // Get or create wallet
      let { data: wallet } = await supabase
        .from("user_wallets")
        .select("*")
        .eq("user_id", appointment.user_id)
        .single();

      if (!wallet) {
        const { data: newWallet } = await supabase
          .from("user_wallets")
          .insert({ user_id: appointment.user_id, balance: 0 })
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
          user_id: appointment.user_id,
          wallet_id: wallet.id,
          type: "credit",
          amount: refundAmount,
          balance_after: newBalance,
          category: "appointment_refund",
          description: `Refund for cancelled appointment: ${appointment.service_name}`,
          reference_id: appointmentId,
          reference_type: "appointment",
          metadata: {
            appointment_date: appointment.appointment_date,
            appointment_time: appointment.appointment_time,
            cancelled_by: cancelledBy,
          },
        });

        // Update refund status
        await supabase
          .from("appointments")
          .update({ refund_status: "processed" })
          .eq("id", appointmentId);
      }

      // Create user notification
      await supabase.from("user_notifications").insert({
        user_id: appointment.user_id,
        type: "appointment_cancelled",
        title: "Appointment Cancelled",
        message: `Your appointment for ${appointment.service_name} on ${appointment.appointment_date} has been cancelled by the provider. ${refundAmount} AED has been credited to your wallet.`,
        reference_id: appointmentId,
        reference_type: "appointment",
        sent_at: new Date().toISOString(),
      });
    }

    // Delete booking slot if exists
    await supabase
      .from("booking_slots")
      .delete()
      .eq("appointment_id", appointmentId);

    return NextResponse.json({ 
      success: true, 
      message: "Appointment cancelled successfully",
      refundAmount,
    });
  } catch (error: any) {
    console.error("Cancel appointment error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
