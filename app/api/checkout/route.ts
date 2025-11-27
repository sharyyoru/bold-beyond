import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { serviceId, expertId, dateTime, sessionType, promoCode } = body;

    // In production, fetch real service/expert data from Supabase/Sanity
    const service = {
      id: serviceId,
      name: "Psychotherapy Session",
      price: 400,
      duration: 60,
    };

    const expert = {
      id: expertId,
      name: "Dr. Aisha Rahman",
    };

    // Calculate price (apply promo if valid)
    let finalPrice = service.price;
    if (promoCode === "WELLNESS20") {
      finalPrice = service.price * 0.8; // 20% off
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "aed",
            product_data: {
              name: service.name,
              description: `${service.duration} min session with ${expert.name}`,
              metadata: {
                serviceId,
                expertId,
                dateTime,
                sessionType,
              },
            },
            unit_amount: Math.round(finalPrice * 100), // Convert to fils
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/my-appointments?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/checkout?service=${serviceId}&expert=${expertId}&datetime=${dateTime}&type=${sessionType}`,
      customer_email: user.email,
      metadata: {
        userId: user.id,
        serviceId,
        expertId,
        dateTime,
        sessionType,
        promoCode: promoCode || "",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
