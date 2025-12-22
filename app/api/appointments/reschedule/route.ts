import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Create reschedule request (by provider)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { appointmentId, providerId, proposedDate, proposedTime, reason } = body;

    if (!appointmentId || !proposedDate || !proposedTime) {
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

    if (!appointment.user_id) {
      return NextResponse.json({ error: "No user associated with appointment" }, { status: 400 });
    }

    // Check if there's already a pending reschedule request
    const { data: existingRequest } = await supabase
      .from("reschedule_requests")
      .select("*")
      .eq("appointment_id", appointmentId)
      .eq("status", "pending")
      .single();

    if (existingRequest) {
      return NextResponse.json({ error: "A reschedule request is already pending" }, { status: 400 });
    }

    // Set expiration to 24 hours from now
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    // Create reschedule request
    const { data: rescheduleRequest, error: createError } = await supabase
      .from("reschedule_requests")
      .insert({
        appointment_id: appointmentId,
        provider_id: providerId,
        user_id: appointment.user_id,
        original_date: appointment.appointment_date,
        original_time: appointment.appointment_time,
        proposed_date: proposedDate,
        proposed_time: proposedTime,
        reason,
        status: "pending",
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (createError) {
      console.error("Create error:", createError);
      return NextResponse.json({ error: "Failed to create reschedule request" }, { status: 500 });
    }

    // Create user notification
    await supabase.from("user_notifications").insert({
      user_id: appointment.user_id,
      type: "appointment_reminder",
      title: "Reschedule Request",
      message: `The provider has requested to reschedule your ${appointment.service_name} appointment from ${appointment.appointment_date} ${appointment.appointment_time} to ${proposedDate} ${proposedTime}. Please respond within 24 hours.`,
      reference_id: rescheduleRequest.id,
      reference_type: "appointment",
      sent_at: new Date().toISOString(),
    });

    return NextResponse.json({ 
      success: true, 
      rescheduleRequest,
    });
  } catch (error: any) {
    console.error("Reschedule error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Respond to reschedule request (by user)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { requestId, action, userId } = body;

    if (!requestId || !action || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!["accept", "decline"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Fetch reschedule request
    const { data: rescheduleRequest, error: fetchError } = await supabase
      .from("reschedule_requests")
      .select("*")
      .eq("id", requestId)
      .eq("user_id", userId)
      .single();

    if (fetchError || !rescheduleRequest) {
      return NextResponse.json({ error: "Reschedule request not found" }, { status: 404 });
    }

    if (rescheduleRequest.status !== "pending") {
      return NextResponse.json({ error: "Request already processed" }, { status: 400 });
    }

    // Check if expired
    if (new Date(rescheduleRequest.expires_at) < new Date()) {
      await supabase
        .from("reschedule_requests")
        .update({ status: "expired" })
        .eq("id", requestId);
      return NextResponse.json({ error: "Request has expired" }, { status: 400 });
    }

    // Fetch appointment
    const { data: appointment } = await supabase
      .from("appointments")
      .select("*")
      .eq("id", rescheduleRequest.appointment_id)
      .single();

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    if (action === "accept") {
      // Update appointment with new date/time
      await supabase
        .from("appointments")
        .update({
          appointment_date: rescheduleRequest.proposed_date,
          appointment_time: rescheduleRequest.proposed_time,
        })
        .eq("id", rescheduleRequest.appointment_id);

      // Update booking slot if exists
      await supabase
        .from("booking_slots")
        .update({
          slot_date: rescheduleRequest.proposed_date,
          start_time: rescheduleRequest.proposed_time,
        })
        .eq("appointment_id", rescheduleRequest.appointment_id);

      // Update reschedule request
      await supabase
        .from("reschedule_requests")
        .update({ 
          status: "accepted",
          user_response_at: new Date().toISOString(),
        })
        .eq("id", requestId);

      // Notify provider
      if (rescheduleRequest.provider_id) {
        await supabase.from("provider_notifications").insert({
          provider_id: rescheduleRequest.provider_id,
          type: "reschedule_accepted",
          title: "Reschedule Accepted",
          message: `${appointment.customer_name} has accepted the rescheduled appointment for ${appointment.service_name} on ${rescheduleRequest.proposed_date} at ${rescheduleRequest.proposed_time}.`,
          reference_id: rescheduleRequest.appointment_id,
          reference_type: "appointment",
        });
      }

      return NextResponse.json({ 
        success: true, 
        message: "Appointment rescheduled successfully",
      });

    } else {
      // Decline - process refund
      const refundAmount = appointment.service_price || 0;

      // Cancel appointment
      await supabase
        .from("appointments")
        .update({
          status: "cancelled",
          cancelled_at: new Date().toISOString(),
          cancelled_by: "user",
          cancellation_reason: "Declined reschedule request",
          refund_amount: refundAmount,
          refund_status: "pending",
        })
        .eq("id", rescheduleRequest.appointment_id);

      // Process refund to wallet
      if (appointment.payment_status === "paid" && refundAmount > 0) {
        let { data: wallet } = await supabase
          .from("user_wallets")
          .select("*")
          .eq("user_id", userId)
          .single();

        if (!wallet) {
          const { data: newWallet } = await supabase
            .from("user_wallets")
            .insert({ user_id: userId, balance: 0 })
            .select()
            .single();
          wallet = newWallet;
        }

        if (wallet) {
          const newBalance = parseFloat(wallet.balance) + refundAmount;

          await supabase
            .from("user_wallets")
            .update({ balance: newBalance, updated_at: new Date().toISOString() })
            .eq("id", wallet.id);

          await supabase.from("wallet_transactions").insert({
            user_id: userId,
            wallet_id: wallet.id,
            type: "credit",
            amount: refundAmount,
            balance_after: newBalance,
            category: "appointment_refund",
            description: `Refund for declined reschedule: ${appointment.service_name}`,
            reference_id: rescheduleRequest.appointment_id,
            reference_type: "appointment",
          });

          await supabase
            .from("appointments")
            .update({ refund_status: "processed" })
            .eq("id", rescheduleRequest.appointment_id);
        }
      }

      // Update reschedule request
      await supabase
        .from("reschedule_requests")
        .update({ 
          status: "declined",
          user_response_at: new Date().toISOString(),
        })
        .eq("id", requestId);

      // Delete booking slot
      await supabase
        .from("booking_slots")
        .delete()
        .eq("appointment_id", rescheduleRequest.appointment_id);

      // Notify provider
      if (rescheduleRequest.provider_id) {
        await supabase.from("provider_notifications").insert({
          provider_id: rescheduleRequest.provider_id,
          type: "reschedule_declined",
          title: "Reschedule Declined",
          message: `${appointment.customer_name} has declined the rescheduled appointment for ${appointment.service_name}. The appointment has been cancelled and refund processed.`,
          reference_id: rescheduleRequest.appointment_id,
          reference_type: "appointment",
        });
      }

      return NextResponse.json({ 
        success: true, 
        message: "Reschedule declined, refund processed",
        refundAmount,
      });
    }
  } catch (error: any) {
    console.error("Reschedule response error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
