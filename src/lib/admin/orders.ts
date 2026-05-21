import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type {
  AdminOrder,
  AdminOrderItem,
  OrderStatus,
  PaymentStatus,
} from "@/lib/orders/types";
import { isOrderStatus, isPaymentStatus } from "@/lib/orders/validation";
import type { Database } from "@/types/database";

type DbOrder = Database["public"]["Tables"]["orders"]["Row"];
type DbOrderItem = Database["public"]["Tables"]["order_items"]["Row"];

export type AdminActionResult<T = void> = {
  ok: boolean;
  data?: T;
  error?: string;
};

function mapOrderItem(row: DbOrderItem): AdminOrderItem {
  return {
    id: row.id,
    orderId: row.order_id,
    productId: row.product_id,
    productSlug: row.product_slug,
    productName: row.product_name,
    productImageUrl: row.product_image_url,
    selectedSize: row.selected_size,
    selectedColor: row.selected_color,
    unitPrice: Number(row.unit_price),
    quantity: row.quantity,
    lineTotal: Number(row.line_total),
  };
}

function mapOrder(row: DbOrder, items: AdminOrderItem[] = []): AdminOrder {
  return {
    id: row.id,
    orderNumber: row.order_number,
    customerFirstName: row.customer_first_name,
    customerLastName: row.customer_last_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    shippingAddress: row.shipping_address,
    shippingCity: row.shipping_city,
    shippingPostcode: row.shipping_postcode,
    shippingCountry: row.shipping_country,
    customerNotes: row.customer_notes,
    subtotal: Number(row.subtotal),
    shippingTotal: Number(row.shipping_total),
    discountTotal: Number(row.discount_total),
    total: Number(row.total),
    currency: row.currency,
    status: row.status as OrderStatus,
    paymentStatus: row.payment_status as PaymentStatus,
    paymentMethod: row.payment_method,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    items,
  };
}

export async function fetchOrders(): Promise<{
  data: AdminOrder[];
  error?: string;
}> {
  if (!isSupabaseConfigured()) {
    return { data: [], error: "Supabase non configurato" };
  }

  const supabase = createBrowserSupabaseClient();
  if (!supabase) return { data: [], error: "Client non disponibile" };

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return { data: [], error: error.message };
  return { data: (data ?? []).map((row) => mapOrder(row)) };
}

export async function fetchOrderById(
  id: string
): Promise<{ data: AdminOrder | null; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: "Supabase non configurato" };
  }

  const supabase = createBrowserSupabaseClient();
  if (!supabase) return { data: null, error: "Client non disponibile" };

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (orderError) return { data: null, error: orderError.message };
  if (!order) return { data: null };

  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", id)
    .order("created_at", { ascending: true });

  if (itemsError) return { data: null, error: itemsError.message };

  return {
    data: mapOrder(order, (items ?? []).map(mapOrderItem)),
  };
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  paymentStatus: PaymentStatus
): Promise<AdminActionResult<AdminOrder>> {
  if (!isOrderStatus(status) || !isPaymentStatus(paymentStatus)) {
    return { ok: false, error: "Stato non valido." };
  }

  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase non configurato" };
  }

  const supabase = createBrowserSupabaseClient();
  if (!supabase) return { ok: false, error: "Client non disponibile" };

  const { data, error } = await supabase
    .from("orders")
    .update({ status, payment_status: paymentStatus })
    .eq("id", id)
    .select()
    .single();

  if (error) return { ok: false, error: error.message };

  const detail = await fetchOrderById(id);
  return {
    ok: true,
    data: detail.data ?? mapOrder(data),
  };
}
