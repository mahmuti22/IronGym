import { NextResponse } from "next/server";
import { isStripeConfigured } from "@/lib/payments/stripe-config";
import { createStripeCheckoutSession } from "@/lib/payments/stripe";
import {
  computeOrderTotals,
  createOrderFromCheckout,
  resolveOrderLines,
} from "@/lib/orders/create-order";
import { validateCreateOrderRequest } from "@/lib/orders/validation";
import { createServiceSupabaseClient } from "@/lib/supabase/service-server";

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Pagamento online non configurato." },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const parsed = validateCreateOrderRequest(body);

    if (!parsed.ok) {
      return NextResponse.json(
        { ok: false, error: parsed.error },
        { status: 400 }
      );
    }

    const orderResult = await createOrderFromCheckout(parsed.data, {
      paymentMethod: "stripe",
      paymentProvider: "stripe",
      sendEmails: true,
    });

    if (!orderResult.ok) {
      return NextResponse.json(orderResult, { status: 500 });
    }

    const lines = await resolveOrderLines(parsed.data.items);
    const { total } = computeOrderTotals(lines);

    const stripeResult = await createStripeCheckoutSession({
      orderId: orderResult.orderId,
      orderNumber: orderResult.orderNumber,
      customerEmail: parsed.data.customer.email.trim().toLowerCase(),
      currency: "CHF",
      lines,
    });

    if (!stripeResult.ok) {
      return NextResponse.json(
        { ok: false, error: stripeResult.error, orderId: orderResult.orderId },
        { status: 500 }
      );
    }

    const service = createServiceSupabaseClient();
    if (service) {
      const { error: attachError } = await service
        .from("orders")
        .update({ stripe_session_id: stripeResult.sessionId })
        .eq("id", orderResult.orderId);

      if (attachError && process.env.NODE_ENV === "development") {
        console.error("[IronGym Stripe] attach session id:", attachError);
      }
    }

    return NextResponse.json({
      ok: true,
      orderId: orderResult.orderId,
      orderNumber: orderResult.orderNumber,
      checkoutUrl: stripeResult.url,
      total,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Richiesta non valida.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
