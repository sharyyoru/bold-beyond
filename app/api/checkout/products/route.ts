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

    if (!customer?.fullName || !customer?.phone || !customer?.address) {
      return NextResponse.json(
        { error: "Customer details required" },
        { status: 400 }
      );
    }

    // Create order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create Stripe checkout session first (before database)
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
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://bold-beyond.vercel.app"}/appx/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://bold-beyond.vercel.app"}/appx/cart`,
      metadata: {
        type: "product_order",
        order_number: orderNumber,
        provider_id: providerId,
        customer_name: customer.fullName,
        customer_phone: customer.phone,
        customer_email: customer.email || "",
        delivery_address: customer.address,
        notes: customer.notes || "",
        items_json: JSON.stringify(items.map((i: CartItem) => ({
          id: i.productId,
          name: i.productName,
          price: i.price,
          qty: i.quantity,
        }))),
        total: total.toString(),
      },
      customer_email: customer.email || undefined,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
