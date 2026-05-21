import type { CartLine } from "@/lib/cart/types";
import type {
  CheckoutFormData,
  CheckoutFormErrors,
  CheckoutOrderDraft,
} from "./types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateCheckoutForm(
  data: CheckoutFormData
): CheckoutFormErrors {
  const errors: CheckoutFormErrors = {};

  if (!data.firstName.trim()) errors.firstName = "Il nome è obbligatorio.";
  if (!data.lastName.trim()) errors.lastName = "Il cognome è obbligatorio.";
  if (!data.email.trim()) {
    errors.email = "L'email è obbligatoria.";
  } else if (!EMAIL_RE.test(data.email.trim())) {
    errors.email = "Inserisci un'email valida.";
  }
  if (!data.address.trim()) errors.address = "L'indirizzo è obbligatorio.";
  if (!data.city.trim()) errors.city = "La città è obbligatoria.";
  if (!data.postcode.trim()) errors.postcode = "Il CAP è obbligatorio.";
  if (!data.country.trim()) errors.country = "Il paese è obbligatorio.";

  return errors;
}

export function hasCheckoutErrors(errors: CheckoutFormErrors): boolean {
  return Object.keys(errors).length > 0;
}

/** Placeholder order number: IG-YYYYMMDD-XXXX */
export function generatePlaceholderOrderNumber(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `IG-${y}${m}${d}-${suffix}`;
}

/** Shape for future POST /api/checkout or Supabase insert. */
export function buildCheckoutOrderDraft(
  form: CheckoutFormData,
  items: CartLine[],
  subtotal: number,
  orderNumber: string
): CheckoutOrderDraft {
  return {
    orderNumber,
    createdAt: new Date().toISOString(),
    customer: form,
    items,
    subtotal,
    currency: "CHF",
    status: "placeholder_received",
  };
}
