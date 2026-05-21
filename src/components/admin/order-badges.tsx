import type { OrderStatus, PaymentStatus } from "@/lib/orders/types";
import {
  orderStatusLabels,
  paymentStatusLabels,
} from "@/lib/orders/types";
import { AdminBadge } from "./admin-ui";

type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "muted"
  | "info"
  | "danger"
  | "teal";

export function orderStatusBadgeVariant(status: OrderStatus): BadgeVariant {
  switch (status) {
    case "new":
      return "warning";
    case "processing":
      return "info";
    case "shipped":
      return "teal";
    case "completed":
      return "success";
    case "cancelled":
      return "danger";
    default:
      return "default";
  }
}

export function paymentStatusBadgeVariant(status: PaymentStatus): BadgeVariant {
  switch (status) {
    case "paid":
      return "success";
    case "pending":
      return "warning";
    case "failed":
      return "danger";
    case "refunded":
      return "muted";
    default:
      return "default";
  }
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <AdminBadge variant={orderStatusBadgeVariant(status)}>
      {orderStatusLabels[status]}
    </AdminBadge>
  );
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <AdminBadge variant={paymentStatusBadgeVariant(status)}>
      {paymentStatusLabels[status]}
    </AdminBadge>
  );
}
