import type { CartLine } from "@/lib/cart/types";
import {
  validateCheckoutForm,
  hasCheckoutErrors,
} from "@/lib/checkout/validation";
import type { CheckoutFormData } from "@/lib/checkout/types";
import type {
  CheckoutOrderItemInput,
  CreateOrderRequest,
  OrderStatus,
  PaymentStatus,
} from "./types";
import { ORDER_STATUSES, PAYMENT_STATUSES } from "./types";

export function cartLineToOrderItem(line: CartLine): CheckoutOrderItemInput {
  return {
    productId: line.productId,
    slug: line.slug,
    name: line.name,
    price: line.price,
    image: line.image,
    size: line.size,
    color: line.color,
    quantity: line.quantity,
  };
}

export function validateCreateOrderRequest(
  body: unknown
): { ok: true; data: CreateOrderRequest } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Richiesta non valida." };
  }

  const raw = body as {
    customer?: CheckoutFormData;
    items?: CheckoutOrderItemInput[];
  };

  if (!raw.customer || !Array.isArray(raw.items)) {
    return { ok: false, error: "Dati ordine incompleti." };
  }

  const formErrors = validateCheckoutForm(raw.customer);
  if (hasCheckoutErrors(formErrors)) {
    return { ok: false, error: "Verifica i dati del form cliente." };
  }

  if (raw.items.length === 0) {
    return { ok: false, error: "Il carrello è vuoto." };
  }

  for (const item of raw.items) {
    if (!item.slug?.trim() || !item.name?.trim()) {
      return { ok: false, error: "Articolo carrello non valido." };
    }
    if (typeof item.price !== "number" || item.price < 0) {
      return { ok: false, error: "Prezzo articolo non valido." };
    }
    const qty = Number(item.quantity);
    if (!Number.isInteger(qty) || qty < 1 || qty > 99) {
      return { ok: false, error: "Quantità non valida." };
    }
  }

  return {
    ok: true,
    data: {
      customer: raw.customer,
      items: raw.items.map((i) => ({
        ...i,
        quantity: Math.min(99, Math.max(1, Math.floor(Number(i.quantity)))),
      })),
    },
  };
}

export function isOrderStatus(value: string): value is OrderStatus {
  return ORDER_STATUSES.includes(value as OrderStatus);
}

export function isPaymentStatus(value: string): value is PaymentStatus {
  return PAYMENT_STATUSES.includes(value as PaymentStatus);
}
