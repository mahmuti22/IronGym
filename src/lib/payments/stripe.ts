import Stripe from "stripe";
import type { ResolvedLine } from "@/lib/orders/create-order";
import { getSiteBaseUrl } from "./stripe-config";

let stripeSingleton: Stripe | null = null;

export function getStripeServer(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return null;

  if (!stripeSingleton) {
    stripeSingleton = new Stripe(key, {
      apiVersion: "2026-04-22.dahlia",
      typescript: true,
    });
  }

  return stripeSingleton;
}

export type CreateStripeCheckoutInput = {
  orderId: string;
  orderNumber: string;
  customerEmail: string;
  currency: string;
  lines: ResolvedLine[];
};

export type CreateStripeCheckoutResult =
  | { ok: true; sessionId: string; url: string }
  | { ok: false; error: string };

function buildLineItems(lines: ResolvedLine[], currency: string) {
  return lines.map((line) => ({
    quantity: line.quantity,
    price_data: {
      currency: currency.toLowerCase(),
      unit_amount: Math.round(line.unitPrice * 100),
      product_data: {
        name: line.name,
        description: [line.size, line.color].filter((v) => v && v !== "—").join(" · "),
      },
    },
  }));
}

async function createSessionWithMethods(
  stripe: Stripe,
  input: CreateStripeCheckoutInput,
  paymentMethodTypes: ("card" | "twint")[]
) {
  const baseUrl = getSiteBaseUrl();

  return stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: input.customerEmail,
    line_items: buildLineItems(input.lines, input.currency),
    payment_method_types: paymentMethodTypes,
    metadata: {
      order_id: input.orderId,
      order_number: input.orderNumber,
    },
    success_url: `${baseUrl}/checkout/success?order=${input.orderId}`,
    cancel_url: `${baseUrl}/checkout/cancel?order=${input.orderId}`,
  });
}

export async function createStripeCheckoutSession(
  input: CreateStripeCheckoutInput
): Promise<CreateStripeCheckoutResult> {
  const stripe = getStripeServer();
  if (!stripe) {
    return { ok: false, error: "Stripe non configurato." };
  }

  try {
    const session = await createSessionWithMethods(stripe, input, [
      "card",
      "twint",
    ]);

    if (!session.url) {
      return { ok: false, error: "URL pagamento Stripe non disponibile." };
    }

    return { ok: true, sessionId: session.id, url: session.url };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);

    if (process.env.NODE_ENV === "development") {
      console.warn("[IronGym Stripe] card+twint failed, retrying card only:", message);
    }

    try {
      const session = await createSessionWithMethods(stripe, input, ["card"]);
      if (!session.url) {
        return { ok: false, error: "URL pagamento Stripe non disponibile." };
      }
      return { ok: true, sessionId: session.id, url: session.url };
    } catch (retryErr) {
      const retryMessage =
        retryErr instanceof Error ? retryErr.message : String(retryErr);
      return { ok: false, error: retryMessage };
    }
  }
}
