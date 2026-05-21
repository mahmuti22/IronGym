import type { CartLine } from "@/lib/cart/types";

export type CheckoutFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postcode: string;
  country: string;
  notes: string;
};

export const emptyCheckoutForm = (): CheckoutFormData => ({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postcode: "",
  country: "Svizzera",
  notes: "",
});

/** Payload ready for a future Supabase orders API. */
export type CheckoutOrderDraft = {
  orderNumber: string;
  createdAt: string;
  customer: CheckoutFormData;
  items: CartLine[];
  subtotal: number;
  currency: "CHF";
  status: "placeholder_received";
};

export type CheckoutFormErrors = Partial<Record<keyof CheckoutFormData, string>>;
