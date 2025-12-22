import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { rescheduleRequestId, accept } = await request.json();

    if (!rescheduleRequestId) {
      return NextResponse.json({ error: "Missing reschedule request ID" }, { status: 400 });
    }

    // Get the reschedule request
    const { data: rescheduleRequest, error: fetchError } = await supabaseAdmin
      .from("reschedule_requests")
      .select("*, appointments(*)")
      .eq("id", rescheduleRequestId)
      .single();

    if (fetchError || !rescheduleRequest) {
      return NextResponse.json({ error: "Reschedule request not found" }, { status: 404 });
    }

    if (rescheduleRequest.status !== "pending") {
      return NextResponse.json({ error: "This request has already been processed" }, { status: 400 });
    }

    if (accept) {
      // Update the appointment with the new date/time
      const { error: updateError } = await supabaseAdmin
        .from("appointments")
        .update({
          appointment_date: rescheduleRequest.proposed_date,
          appointment_time: rescheduleRequest.proposed_time,
          status: "confirmed",
        })
        .eq("id", rescheduleRequest.appointment_id);

      if (updateError) {
        console.error("Error updating appointment:", updateError);
        return NextResponse.json({ error: "Failed to update appointment" }, { status: 500 });
      }

      // Update reschedule request status
      await supabaseAdmin
        .from("reschedule_requests")
        .update({ status: "accepted", user_response_at: new Date().toISOString() })
        .eq("id", rescheduleRequestId);

      // Notify the provider that user accepted
      await supabaseAdmin.from("provider_notifications").insert({
        provider_id: rescheduleRequest.provider_id,
        type: "reschedule_accepted",
        title: "Reschedule Accepted",
        message: `Customer accepted the rescheduled appointment for ${rescheduleRequest.proposed_date} at ${rescheduleRequest.proposed_time}`,
        reference_id: rescheduleRequest.appointment_id,
        reference_type: "appointment",
      });

    } else {
      // User declined - refund to wallet
      const appointment = rescheduleRequest.appointments;
      
      if (appointment && appointment.amount_paid > 0) {
        // Get or create wallet
        let { data: wallet } = await supabaseAdmin
          .from("user_wallets")
          .select("*")
          .eq("user_id", rescheduleRequest.user_id)
          .single();

        if (!wallet) {
          const { data: newWallet } = await supabaseAdmin
            .from("user_wallets")
            .insert({ user_id: rescheduleRequest.user_id, balance: 0 })
            .select()
            .single();
          wallet = newWallet;
        }

        if (wallet) {
          const newBalance = (wallet.balance || 0) + appointment.amount_paid;
          
          // Update wallet balance
          await supabaseAdmin
            .from("user_wallets")
            .update({ balance: newBalance, updated_at: new Date().toISOString() })
            .eq("id", wallet.id);

          // Create transaction record
          await supabaseAdmin.from("wallet_transactions").insert({
            user_id: rescheduleRequest.user_id,
            wallet_id: wallet.id,
            type: "credit",
            amount: appointment.amount_paid,
            balance_after: newBalance,
            category: "refund",
            reference_id: appointment.id,
            reference_type: "appointment",
            description: `Refund for declined reschedule - ${appointment.service_name}`,
          });

          // Notify user about refund
          await supabaseAdmin.from("user_notifications").insert({
            user_id: rescheduleRequest.user_id,
            type: "refund",
            title: "Refund Processed",
            message: `${appointment.amount_paid} AED has been added to your wallet`,
            reference_id: wallet.id,
            reference_type: "wallet",
          });
        }
      }

      // Cancel the appointment
      await supabaseAdmin
        .from("appointments")
        .update({ status: "cancelled" })
        .eq("id", rescheduleRequest.appointment_id);

      // Update reschedule request status
      await supabaseAdmin
        .from("reschedule_requests")
        .update({ status: "declined", user_response_at: new Date().toISOString() })
        .eq("id", rescheduleRequestId);

      // Notify the provider that user declined
      await supabaseAdmin.from("provider_notifications").insert({
        provider_id: rescheduleRequest.provider_id,
        type: "reschedule_declined",
        title: "Reschedule Declined",
        message: `Customer declined the reschedule request. The appointment has been cancelled and refunded.`,
        reference_id: rescheduleRequest.appointment_id,
        reference_type: "appointment",
      });
    }

    return NextResponse.json({ success: true, accepted: accept });
  } catch (error: any) {
    console.error("Error responding to reschedule:", error);
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}
