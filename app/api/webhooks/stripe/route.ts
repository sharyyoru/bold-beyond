import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    // In production, verify the webhook signature
    if (process.env.STRIPE_WEBHOOK_SECRET && process.env.STRIPE_WEBHOOK_SECRET !== "whsec_placeholder") {
      event = stripe.webhooks.constructEvent(
        body,
        signature!,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } else {
      // For development, parse the event directly
      event = JSON.parse(body);
    }
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata;

        if (metadata?.type === "service_booking" && metadata?.appointment_id) {
          // Update appointment status to pending (awaiting provider confirmation)
          await supabase
            .from("appointments")
            .update({
              status: "pending",
              payment_status: "paid",
              payment_id: session.payment_intent as string,
              paid_at: new Date().toISOString(),
            })
            .eq("id", metadata.appointment_id);

          // Create booking slot to prevent double booking
          const { data: appointment } = await supabase
            .from("appointments")
            .select("*")
            .eq("id", metadata.appointment_id)
            .single();

          if (appointment) {
            // Calculate end time based on duration
            const startMinutes = timeToMinutes(appointment.appointment_time);
            const endMinutes = startMinutes + (appointment.duration_minutes || 60);
            const endTime = minutesToTime(endMinutes);

            await supabase.from("booking_slots").insert({
              provider_id: appointment.provider_id,
              appointment_id: appointment.id,
              slot_date: appointment.appointment_date,
              start_time: appointment.appointment_time,
              end_time: endTime,
              status: "booked",
            });

            // Create activity for user
            if (appointment.user_id) {
              await supabase.from("user_activities").insert({
                user_id: appointment.user_id,
                activity_type: "appointment_booked",
                title: "Appointment Booked",
                description: `${appointment.service_name} on ${appointment.appointment_date} at ${appointment.appointment_time}`,
                reference_id: appointment.id,
                reference_type: "appointment",
                amount: appointment.service_price,
                metadata: {
                  service_name: appointment.service_name,
                  appointment_date: appointment.appointment_date,
                  appointment_time: appointment.appointment_time,
                  payment_id: session.payment_intent,
                  invoice_url: session.invoice,
                }
              });

              // Create notification
              await supabase.from("user_notifications").insert({
                user_id: appointment.user_id,
                type: "payment",
                title: "Booking Confirmed",
                message: `Your appointment for ${appointment.service_name} has been booked. Payment of ${appointment.service_price} AED received.`,
                reference_id: appointment.id,
                reference_type: "appointment",
                sent_at: new Date().toISOString(),
              });

              // Schedule appointment reminders
              const appointmentDateTime = new Date(`${appointment.appointment_date}T${appointment.appointment_time}`);
              
              // 1 day before reminder
              const dayBefore = new Date(appointmentDateTime);
              dayBefore.setDate(dayBefore.getDate() - 1);
              if (dayBefore > new Date()) {
                await supabase.from("appointment_reminders").insert({
                  appointment_id: appointment.id,
                  user_id: appointment.user_id,
                  reminder_type: "day_before",
                  scheduled_for: dayBefore.toISOString(),
                });
              }

              // 1 hour before reminder
              const hourBefore = new Date(appointmentDateTime);
              hourBefore.setHours(hourBefore.getHours() - 1);
              if (hourBefore > new Date()) {
                await supabase.from("appointment_reminders").insert({
                  appointment_id: appointment.id,
                  user_id: appointment.user_id,
                  reminder_type: "hour_before",
                  scheduled_for: hourBefore.toISOString(),
                });
              }
            }
          }
        } else if (metadata?.type === "product_order" && metadata?.order_id) {
          // Update product order status
          await supabase
            .from("provider_orders")
            .update({
              status: "processing",
              payment_status: "paid",
              payment_id: session.payment_intent as string,
              paid_at: new Date().toISOString(),
            })
            .eq("id", metadata.order_id);

          // Fetch the order details
          const { data: order } = await supabase
            .from("provider_orders")
            .select("*")
            .eq("id", metadata.order_id)
            .single();

          if (order && order.user_id) {
            // Create activity for user
            await supabase.from("user_activities").insert({
              user_id: order.user_id,
              activity_type: "order_placed",
              title: "Order Placed",
              description: `Order #${order.order_number} - ${order.items?.length || 1} item(s)`,
              reference_id: order.id,
              reference_type: "order",
              amount: order.total,
              metadata: {
                order_number: order.order_number,
                items: order.items,
                payment_id: session.payment_intent,
                invoice_url: session.invoice,
              }
            });

            // Create notification
            await supabase.from("user_notifications").insert({
              user_id: order.user_id,
              type: "order_update",
              title: "Order Confirmed",
              message: `Your order #${order.order_number} has been placed. Total: ${order.total} AED`,
              reference_id: order.id,
              reference_type: "order",
              sent_at: new Date().toISOString(),
            });
          }
        }
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata;

        if (metadata?.appointment_id) {
          // Cancel the appointment if payment expired
          await supabase
            .from("appointments")
            .update({
              status: "cancelled",
              payment_status: "expired",
            })
            .eq("id", metadata.appointment_id);
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("Payment failed:", paymentIntent.id);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Helper functions
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
}
