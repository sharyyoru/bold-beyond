import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// This endpoint should be called by a cron job (e.g., Vercel Cron or external service)
export async function POST(request: NextRequest) {
  try {
    // Verify cron secret if provided
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date().toISOString();

    // Get all pending reminders that should be sent
    const { data: reminders, error: fetchError } = await supabase
      .from("appointment_reminders")
      .select(`
        *,
        appointments (
          id,
          service_name,
          appointment_date,
          appointment_time,
          customer_name
        )
      `)
      .eq("sent", false)
      .lte("scheduled_for", now);

    if (fetchError) throw fetchError;

    let sentCount = 0;

    for (const reminder of reminders || []) {
      const appointment = reminder.appointments;
      if (!appointment) continue;

      const reminderTitle = reminder.reminder_type === "day_before" 
        ? "Appointment Tomorrow" 
        : "Appointment in 1 Hour";

      const reminderMessage = reminder.reminder_type === "day_before"
        ? `Your ${appointment.service_name} appointment is scheduled for tomorrow at ${appointment.appointment_time}.`
        : `Your ${appointment.service_name} appointment starts in 1 hour at ${appointment.appointment_time}.`;

      // Create notification
      await supabase.from("user_notifications").insert({
        user_id: reminder.user_id,
        type: "appointment_reminder",
        title: reminderTitle,
        message: reminderMessage,
        reference_id: appointment.id,
        reference_type: "appointment",
        sent_at: now,
      });

      // Mark reminder as sent
      await supabase
        .from("appointment_reminders")
        .update({ sent: true, sent_at: now })
        .eq("id", reminder.id);

      sentCount++;
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${sentCount} reminders`,
      sentCount,
    });
  } catch (error: any) {
    console.error("Reminder processing error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET endpoint to check pending reminders
export async function GET(request: NextRequest) {
  try {
    const { count } = await supabase
      .from("appointment_reminders")
      .select("*", { count: "exact", head: true })
      .eq("sent", false);

    return NextResponse.json({
      success: true,
      pendingReminders: count || 0,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
