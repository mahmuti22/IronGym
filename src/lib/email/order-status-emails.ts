import type { AdminOrder, OrderStatus } from "@/lib/orders/types";

/** Context for a future customer status-update email (not sent yet). */
export type OrderStatusEmailContext = {
  order: AdminOrder;
  previousStatus: OrderStatus;
  nextStatus: OrderStatus;
};

/**
 * Whether a status change should trigger a customer email.
 * Disabled until product copy + Resend flow are ready.
 */
export function shouldSendOrderStatusEmail(
  previousStatus: OrderStatus,
  nextStatus: OrderStatus
): boolean {
  void previousStatus;
  void nextStatus;
  return false;
}

/**
 * Send order status update to customer (e.g. shipped + tracking).
 * Stub — wire Resend here when enabled.
 */
export async function sendOrderStatusUpdateEmail(
  ctx: OrderStatusEmailContext
): Promise<void> {
  void ctx;
  // Future: if (shouldSendOrderStatusEmail(...)) { await resend.emails.send(...) }
  return;
}
