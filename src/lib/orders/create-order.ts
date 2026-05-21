import { createPublicServerSupabaseClient } from "@/lib/supabase/public-server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { CreateOrderRequest, CreateOrderResponse } from "./types";
import type { CheckoutOrderItemInput } from "./types";

function generateOrderNumber(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `IG-${y}${m}${d}-${suffix}`;
}

export type ResolvedLine = CheckoutOrderItemInput & {
  unitPrice: number;
  lineTotal: number;
  productUuid: string | null;
};

/**
 * Resolve line prices from cart snapshot.
 * Future: enforce published product prices from DB and reject mismatches.
 */
export async function resolveOrderLines(
  items: CheckoutOrderItemInput[]
): Promise<ResolvedLine[]> {
  const supabase = createPublicServerSupabaseClient();

  const resolved: ResolvedLine[] = [];

  for (const item of items) {
    const unitPrice = item.price;
    let productUuid: string | null = null;

    if (supabase) {
      const { data: product } = await supabase
        .from("products")
        .select("id, price, slug, status")
        .eq("slug", item.slug)
        .eq("status", "published")
        .maybeSingle();

      if (product) {
        productUuid = product.id;
        // Future: unitPrice = Number(product.price);
      }
    }

    const qty = item.quantity;
    resolved.push({
      ...item,
      unitPrice,
      lineTotal: unitPrice * qty,
      productUuid,
    });
  }

  return resolved;
}

export function computeOrderTotals(lines: ResolvedLine[]) {
  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  const shippingTotal = 0;
  const discountTotal = 0;
  const total = subtotal + shippingTotal - discountTotal;
  return { subtotal, shippingTotal, discountTotal, total };
}

export async function createOrderFromCheckout(
  request: CreateOrderRequest
): Promise<CreateOrderResponse> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase non configurato." };
  }

  const supabase = createPublicServerSupabaseClient();
  if (!supabase) {
    return { ok: false, error: "Impossibile connettersi al database." };
  }

  const lines = await resolveOrderLines(request.items);
  const { subtotal, shippingTotal, discountTotal, total } =
    computeOrderTotals(lines);

  if (total <= 0) {
    return { ok: false, error: "Totale ordine non valido." };
  }

  const c = request.customer;
  let orderNumber = generateOrderNumber();
  let attempts = 0;

  while (attempts < 5) {
    const orderId = crypto.randomUUID();
    const { error: orderError } = await supabase.from("orders").insert({
        id: orderId,
        order_number: orderNumber,
        customer_first_name: c.firstName.trim(),
        customer_last_name: c.lastName.trim(),
        customer_email: c.email.trim().toLowerCase(),
        customer_phone: c.phone.trim() || null,
        shipping_address: c.address.trim(),
        shipping_city: c.city.trim(),
        shipping_postcode: c.postcode.trim(),
        shipping_country: c.country.trim(),
        customer_notes: c.notes.trim() || null,
        subtotal,
        shipping_total: shippingTotal,
        discount_total: discountTotal,
        total,
        currency: "CHF",
        status: "new",
        payment_status: "pending",
        payment_method: "manual",
      });

    if (!orderError) {
      const itemRows = lines.map((line) => ({
        order_id: orderId,
        product_id: line.productUuid,
        product_slug: line.slug,
        product_name: line.name,
        product_image_url: line.image || null,
        selected_size: line.size,
        selected_color: line.color,
        unit_price: line.unitPrice,
        quantity: line.quantity,
        line_total: line.lineTotal,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(itemRows);

      if (itemsError) {
        return {
          ok: false,
          error: itemsError.message || "Errore salvataggio articoli ordine.",
        };
      }

      return {
        ok: true,
        orderId,
        orderNumber,
        subtotal,
        total,
      };
    }

    if (orderError?.code === "23505") {
      orderNumber = generateOrderNumber();
      attempts++;
      continue;
    }

    return {
      ok: false,
      error: orderError?.message || "Errore durante la creazione dell'ordine.",
    };
  }

  return { ok: false, error: "Impossibile generare un numero ordine univoco." };
}
