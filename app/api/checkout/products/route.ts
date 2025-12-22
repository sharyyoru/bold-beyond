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

interface CartItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { providerId, items, total, customer } = body;

    if (!providerId || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get user from auth header or session
    const authHeader = request.headers.get("authorization");
    let userId: string | null = null;

    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }

    // Create order in database
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    const { data: order, error: orderError } = await supabase
      .from("provider_orders")
      .insert({
        provider_id: providerId,
        user_id: userId,
        order_number: orderNumber,
        items: items,
        total: total,
        status: "pending",
        payment_status: "pending",
        customer_name: customer.fullName,
        customer_phone: customer.phone,
        customer_email: customer.email,
        delivery_address: customer.address,
        notes: customer.notes,
      })
      .select()
      .single();

    if (orderError) {
      console.error("Error creating order:", orderError);
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      );
    }

    // Create Stripe checkout session
    const lineItems = items.map((item: CartItem) => ({
      price_data: {
        currency: "aed",
        product_data: {
          name: item.productName,
        },
        unit_amount: Math.round(item.price * 100), // Convert to fils
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://bold-beyond.vercel.app"}/appx/order/success?order_id=${order.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://bold-beyond.vercel.app"}/appx/cart`,
      metadata: {
        type: "product_order",
        order_id: order.id,
        provider_id: providerId,
        user_id: userId || "",
      },
      customer_email: customer.email || undefined,
    });

    // Update order with payment intent
    await supabase
      .from("provider_orders")
      .update({
        stripe_session_id: session.id,
        stripe_payment_intent: session.payment_intent,
      })
      .eq("id", order.id);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
