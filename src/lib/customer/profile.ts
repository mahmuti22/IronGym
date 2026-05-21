import type { CheckoutFormData } from "@/lib/checkout/types";
import type { CustomerProfileRow } from "@/lib/customer/auth-check";
import type { AdminOrder, AdminOrderItem } from "@/lib/orders/types";
import type { OrderStatus, PaymentStatus } from "@/lib/orders/types";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Database } from "@/types/database";

type DbOrder = Database["public"]["Tables"]["orders"]["Row"];
type DbOrderItem = Database["public"]["Tables"]["order_items"]["Row"];

export type CustomerProfileUpdate = {
  firstName: string;
  lastName: string;
  phone: string;
  defaultAddress: string;
  defaultCity: string;
  defaultPostcode: string;
  defaultCountry: string;
};

export function profileToCheckoutForm(
  profile: CustomerProfileRow | null,
  email: string
): CheckoutFormData {
  return {
    firstName: profile?.first_name?.trim() ?? "",
    lastName: profile?.last_name?.trim() ?? "",
    email: email.trim().toLowerCase(),
    phone: profile?.phone?.trim() ?? "",
    address: profile?.default_address?.trim() ?? "",
    city: profile?.default_city?.trim() ?? "",
    postcode: profile?.default_postcode?.trim() ?? "",
    country: profile?.default_country?.trim() || "Svizzera",
    notes: "",
  };
}

function mapCustomerOrder(row: DbOrder): AdminOrder {
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
    internalNotes: null,
    trackingNumber: null,
    shippingCarrier: null,
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
    shippedAt: row.shipped_at,
    completedAt: row.completed_at,
    cancelledAt: row.cancelled_at,
  };
}

export async function fetchCustomerOrders(): Promise<{
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
  return { data: (data ?? []).map(mapCustomerOrder) };
}

export async function fetchCustomerOrderById(
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

  const mappedItems: AdminOrderItem[] = (items ?? []).map((row: DbOrderItem) => ({
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
  }));

  return {
    data: { ...mapCustomerOrder(order), items: mappedItems },
  };
}

export async function updateCustomerProfile(
  userId: string,
  input: CustomerProfileUpdate
): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase non configurato" };
  }

  const supabase = createBrowserSupabaseClient();
  if (!supabase) return { ok: false, error: "Client non disponibile" };

  const { error } = await supabase
    .from("customer_profiles")
    .update({
      first_name: input.firstName.trim() || null,
      last_name: input.lastName.trim() || null,
      phone: input.phone.trim() || null,
      default_address: input.defaultAddress.trim() || null,
      default_city: input.defaultCity.trim() || null,
      default_postcode: input.defaultPostcode.trim() || null,
      default_country: input.defaultCountry.trim() || null,
    })
    .eq("id", userId);

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export type CustomerProfileUpsertInput = {
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
};

export async function upsertCustomerProfile(
  supabase: ReturnType<typeof createBrowserSupabaseClient>,
  input: CustomerProfileUpsertInput
): Promise<{ ok: boolean; error?: string; code?: string }> {
  if (!supabase) return { ok: false, error: "Client non disponibile" };

  const row = {
    id: input.userId,
    email: input.email.trim().toLowerCase(),
    first_name: input.firstName?.trim() || null,
    last_name: input.lastName?.trim() || null,
    default_country: "Svizzera",
  };

  const { error } = await supabase.from("customer_profiles").upsert(row, {
    onConflict: "id",
  });

  if (error) {
    return { ok: false, error: error.message, code: error.code };
  }
  return { ok: true };
}

/** @deprecated Use upsertCustomerProfile */
export async function createCustomerProfile(
  supabase: ReturnType<typeof createBrowserSupabaseClient>,
  userId: string,
  email: string,
  firstName: string,
  lastName: string
): Promise<{ ok: boolean; error?: string }> {
  return upsertCustomerProfile(supabase, {
    userId,
    email,
    firstName,
    lastName,
  });
}
