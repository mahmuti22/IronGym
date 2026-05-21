import {
  buildCartLineId,
  type AddToCartInput,
  type CartLine,
} from "./types";

export const CART_STORAGE_KEY = "irongym-cart-v1";

function isCartLine(value: unknown): value is CartLine {
  if (!value || typeof value !== "object") return false;
  const row = value as CartLine;
  return (
    typeof row.lineId === "string" &&
    typeof row.productId === "string" &&
    typeof row.slug === "string" &&
    typeof row.name === "string" &&
    typeof row.price === "number" &&
    typeof row.image === "string" &&
    typeof row.size === "string" &&
    typeof row.color === "string" &&
    typeof row.quantity === "number" &&
    row.quantity > 0
  );
}

export function loadCart(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isCartLine);
  } catch {
    return [];
  }
}

export function saveCart(items: CartLine[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

export function addToCart(
  items: CartLine[],
  input: AddToCartInput
): CartLine[] {
  const size = input.size.trim() || "—";
  const color = input.color.trim() || "—";
  const lineId = buildCartLineId(input.productId, size, color);
  const qty = Math.max(1, input.quantity ?? 1);

  const existing = items.find((i) => i.lineId === lineId);
  if (existing) {
    return items.map((i) =>
      i.lineId === lineId ? { ...i, quantity: i.quantity + qty } : i
    );
  }

  return [
    ...items,
    {
      lineId,
      productId: input.productId,
      slug: input.slug,
      name: input.name,
      price: input.price,
      image: input.image,
      size,
      color,
      quantity: qty,
    },
  ];
}

export function updateCartQuantity(
  items: CartLine[],
  lineId: string,
  quantity: number
): CartLine[] {
  if (quantity < 1) return items.filter((i) => i.lineId !== lineId);
  return items.map((i) =>
    i.lineId === lineId ? { ...i, quantity: Math.min(99, quantity) } : i
  );
}

export function removeCartLine(
  items: CartLine[],
  lineId: string
): CartLine[] {
  return items.filter((i) => i.lineId !== lineId);
}

export function clearCart(): CartLine[] {
  return [];
}

export function getCartItemCount(items: CartLine[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}

export function getCartSubtotal(items: CartLine[]): number {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}
