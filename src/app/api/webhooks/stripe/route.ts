import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripeServer } from "@/lib/payments/stripe";
import {
  handleCheckoutSessionCompleted,
  handleCheckoutSessionExpired,
  handlePaymentIntentFailed,
} from "@/lib/payments/webhook";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const stripe = getStripeServer();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();

  if (!stripe || !webhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook non configurato." },
      { status: 503 }
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Firma mancante." }, { status: 400 });
  }

  const body = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Firma non valida.";
    if (process.env.NODE_ENV === "development") {
      console.error("[IronGym Stripe Webhook] signature error:", message);
    }
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (process.env.NODE_ENV === "development") {
    console.log("[IronGym Stripe Webhook]", event.type, event.id);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const result = await handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session
        );
        if (!result.ok) {
          console.error("[IronGym Stripe Webhook] completed:", result.error);
          return NextResponse.json({ error: result.error }, { status: 500 });
        }
        break;
      }
      case "checkout.session.expired": {
        await handleCheckoutSessionExpired(
          event.data.object as Stripe.Checkout.Session
        );
        break;
      }
      case "payment_intent.payment_failed": {
        await handlePaymentIntentFailed(
          event.data.object as Stripe.PaymentIntent
        );
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error("[IronGym Stripe Webhook] handler error:", err);
    return NextResponse.json({ error: "Webhook handler failed." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
