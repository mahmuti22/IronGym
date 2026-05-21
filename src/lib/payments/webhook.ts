import type Stripe from "stripe";
import { createServiceSupabaseClient } from "@/lib/supabase/service-server";
import type { Database } from "@/types/database";

type OrderUpdate = Database["public"]["Tables"]["orders"]["Update"];

export type OrderPaymentUpdate = {
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus?: "new" | "processing" | "cancelled";
  stripeSessionId?: string | null;
  stripePaymentIntentId?: string | null;
  stripeCustomerId?: string | null;
  setPaidAt?: boolean;
};

export async function updateOrderPaymentById(
  orderId: string,
  update: OrderPaymentUpdate
): Promise<{ ok: boolean; error?: string; skipped?: boolean }> {
  const supabase = createServiceSupabaseClient();
  if (!supabase) {
    return { ok: false, error: "Service Supabase non configurato." };
  }

  const { data: existing, error: fetchError } = await supabase
    .from("orders")
    .select("id, payment_status")
    .eq("id", orderId)
    .maybeSingle();

  if (fetchError) {
    return { ok: false, error: fetchError.message };
  }

  if (!existing) {
    return { ok: false, error: "Ordine non trovato." };
  }

  if (
    update.paymentStatus === "paid" &&
    existing.payment_status === "paid"
  ) {
    return { ok: true, skipped: true };
  }

  const payload: OrderUpdate = {
    payment_status: update.paymentStatus,
    payment_method: "stripe",
    payment_provider: "stripe",
  };

  if (update.orderStatus) {
    payload.status = update.orderStatus;
  }

  if (update.stripeSessionId !== undefined) {
    payload.stripe_session_id = update.stripeSessionId;
  }

  if (update.stripePaymentIntentId !== undefined) {
    payload.stripe_payment_intent_id = update.stripePaymentIntentId;
  }

  if (update.stripeCustomerId !== undefined) {
    payload.stripe_customer_id = update.stripeCustomerId;
  }

  if (update.setPaidAt) {
    payload.paid_at = new Date().toISOString();
  }

  const { error: updateError } = await supabase
    .from("orders")
    .update(payload)
    .eq("id", orderId);

  if (updateError) {
    return { ok: false, error: updateError.message };
  }

  return { ok: true };
}

export async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
): Promise<{ ok: boolean; error?: string }> {
  const orderId = session.metadata?.order_id;
  if (!orderId) {
    return { ok: false, error: "metadata.order_id mancante." };
  }

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? null;

  return updateOrderPaymentById(orderId, {
    paymentStatus: "paid",
    orderStatus: "processing",
    stripeSessionId: session.id,
    stripePaymentIntentId: paymentIntentId,
    stripeCustomerId:
      typeof session.customer === "string" ? session.customer : null,
    setPaidAt: true,
  });
}

export async function handleCheckoutSessionExpired(
  session: Stripe.Checkout.Session
): Promise<{ ok: boolean; error?: string }> {
  const orderId = session.metadata?.order_id;
  if (!orderId) return { ok: true };

  return updateOrderPaymentById(orderId, {
    paymentStatus: "failed",
    stripeSessionId: session.id,
  });
}

export async function handlePaymentIntentFailed(
  paymentIntent: Stripe.PaymentIntent
): Promise<{ ok: boolean; error?: string }> {
  const orderId = paymentIntent.metadata?.order_id;
  if (!orderId) return { ok: true };

  return updateOrderPaymentById(orderId, {
    paymentStatus: "failed",
    stripePaymentIntentId: paymentIntent.id,
  });
}
