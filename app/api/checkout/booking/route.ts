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
  try {
    const body = await request.json();
    const {
      providerId,
      providerName,
      serviceId,
      serviceName,
      servicePrice,
      serviceDuration,
      appointmentDate,
      appointmentTime,
      customerName,
      customerEmail,
      customerPhone,
      userId,
      notes,
    } = body;

    if (!providerId || !serviceId || !appointmentDate || !appointmentTime || !customerEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Look up provider_accounts by sanity_provider_id
    let dbProviderId = null;
    const { data: providerAccount } = await supabase
      .from("provider_accounts")
      .select("id")
      .eq("sanity_provider_id", providerId)
      .single();
    
    if (providerAccount) {
      dbProviderId = providerAccount.id;
    }

    // Create a pending appointment
    const { data: appointment, error: appointmentError } = await supabase
      .from("appointments")
      .insert({
        provider_id: dbProviderId,
        sanity_provider_id: providerId,
        user_id: userId || null,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        sanity_service_id: serviceId,
        service_name: serviceName,
        service_price: servicePrice,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        duration_minutes: serviceDuration || 60,
        status: "pending_payment",
        notes: notes || null,
        payment_status: "pending",
      })
      .select()
      .single();

    if (appointmentError) {
      console.error("Appointment creation error:", appointmentError);
      throw new Error("Failed to create appointment");
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "aed",
            product_data: {
              name: serviceName,
              description: `Appointment with ${providerName} on ${appointmentDate} at ${appointmentTime}`,
            },
            unit_amount: Math.round(servicePrice * 100), // Convert to fils
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://bold-beyond.vercel.app"}/booking/success?session_id={CHECKOUT_SESSION_ID}&appointment_id=${appointment.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://bold-beyond.vercel.app"}/booking/cancel?appointment_id=${appointment.id}`,
      customer_email: customerEmail,
      metadata: {
        appointment_id: appointment.id,
        provider_id: providerId,
        service_id: serviceId,
        type: "service_booking",
      },
    });

    // Update appointment with session ID
    await supabase
      .from("appointments")
      .update({ stripe_session_id: session.id })
      .eq("id", appointment.id);

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      sessionUrl: session.url,
      appointmentId: appointment.id,
    });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Checkout failed" },
      { status: 500 }
    );
  }
}
