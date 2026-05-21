import type { CheckoutFormData } from "@/lib/checkout/types";

export type OrderStatus =
  | "new"
  | "processing"
  | "shipped"
  | "completed"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export const ORDER_STATUSES: OrderStatus[] = [
  "new",
  "processing",
  "shipped",
  "completed",
  "cancelled",
];

export const PAYMENT_STATUSES: PaymentStatus[] = [
  "pending",
  "paid",
  "failed",
  "refunded",
];

export type CheckoutOrderItemInput = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
};

export type CreateOrderRequest = {
  customer: CheckoutFormData;
  items: CheckoutOrderItemInput[];
};

export type CreateOrderResponse =
  | {
      ok: true;
      orderId: string;
      orderNumber: string;
      subtotal: number;
      total: number;
    }
  | { ok: false; error: string };

export type AdminOrderItem = {
  id: string;
  orderId: string;
  productId: string | null;
  productSlug: string;
  productName: string;
  productImageUrl: string | null;
  selectedSize: string | null;
  selectedColor: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

export type AdminOrder = {
  id: string;
  orderNumber: string;
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerPhone: string | null;
  shippingAddress: string;
  shippingCity: string;
  shippingPostcode: string;
  shippingCountry: string;
  customerNotes: string | null;
  subtotal: number;
  shippingTotal: number;
  discountTotal: number;
  total: number;
  currency: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string | null;
  createdAt: string;
  updatedAt: string;
  items?: AdminOrderItem[];
};

export const orderStatusLabels: Record<OrderStatus, string> = {
  new: "Nuovo",
  processing: "In lavorazione",
  shipped: "Spedito",
  completed: "Completato",
  cancelled: "Annullato",
};

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  pending: "In attesa",
  paid: "Pagato",
  failed: "Fallito",
  refunded: "Rimborsato",
};
