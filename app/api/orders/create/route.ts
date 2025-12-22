import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Create order with wallet payment (no Stripe)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { providerId, providerName, userId, items, total, walletAmountUsed, cardAmountPaid, customer } = body;

    if (!providerId || !items || items.length === 0 || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Look up provider_accounts by sanity_provider_id
    let dbProviderId = null;
    if (providerId) {
      const { data: providerAccount } = await supabase
        .from("provider_accounts")
        .select("id")
        .eq("sanity_provider_id", providerId)
        .single();
      if (providerAccount) {
        dbProviderId = providerAccount.id;
      }
    }

    // Create order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("provider_orders")
      .insert({
        order_number: orderNumber,
        provider_id: dbProviderId,
        sanity_provider_id: providerId,
        provider_name: providerName,
        user_id: userId,
        status: "processing",
        payment_status: "paid",
        total_amount: total,
        wallet_amount_used: walletAmountUsed || 0,
        card_amount_paid: cardAmountPaid || 0,
        paid_at: new Date().toISOString(),
        customer_name: customer?.fullName,
        customer_email: customer?.email,
        customer_phone: customer?.phone,
        delivery_address: customer?.address,
        notes: customer?.notes,
      })
      .select()
      .single();

    if (orderError) {
      console.error("Order creation error:", orderError);
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }

    // Create order items
    if (order && items.length > 0) {
      for (const item of items) {
        await supabase.from("order_items").insert({
          order_id: order.id,
          sanity_product_id: item.productId,
          product_name: item.productName,
          product_price: item.price,
          quantity: item.quantity,
        });
      }
    }

    // Create user activity
    await supabase.from("user_activities").insert({
      user_id: userId,
      activity_type: "order_placed",
      title: "Order Placed",
      description: `Order #${orderNumber} - ${items.length} item(s)`,
      reference_id: order.id,
      reference_type: "order",
      amount: total,
      metadata: {
        order_number: orderNumber,
        items: items,
        payment_method: "wallet",
      },
    });

    // Create user notification
    await supabase.from("user_notifications").insert({
      user_id: userId,
      type: "order_update",
      title: "Order Confirmed",
      message: `Your order #${orderNumber} has been placed using wallet balance. Total: ${total} AED`,
      reference_id: order.id,
      reference_type: "order",
      sent_at: new Date().toISOString(),
    });

    // Create provider notification
    if (dbProviderId) {
      await supabase.from("provider_notifications").insert({
        provider_id: dbProviderId,
        type: "new_order",
        title: "New Order Received",
        message: `New order #${orderNumber} from ${customer?.fullName}. Total: ${total} AED`,
        reference_id: order.id,
        reference_type: "order",
      });
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber,
    });
  } catch (error: any) {
    console.error("Create order error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
