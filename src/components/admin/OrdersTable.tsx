"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { fetchOrders } from "@/lib/admin/orders";
import type { AdminOrder } from "@/lib/orders/types";
import {
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  orderStatusLabels,
  paymentStatusLabels,
  type OrderStatus,
  type PaymentStatus,
} from "@/lib/orders/types";
import { formatPrice } from "@/data/shop";
import {
  AdminBadge,
  adminBtnGhostClass,
  adminCaptionClass,
  adminInputClass,
  adminMutedTextClass,
  adminTableHeadCellClass,
  adminTableHeadRowClass,
  adminTableRowClass,
  adminTableShellClass,
} from "./admin-ui";

function statusBadgeVariant(status: OrderStatus) {
  switch (status) {
    case "new":
      return "warning" as const;
    case "processing":
      return "default" as const;
    case "shipped":
      return "success" as const;
    case "completed":
      return "success" as const;
    case "cancelled":
      return "muted" as const;
    default:
      return "default" as const;
  }
}

function paymentBadgeVariant(status: PaymentStatus) {
  switch (status) {
    case "paid":
      return "success" as const;
    case "pending":
      return "warning" as const;
    case "failed":
      return "muted" as const;
    case "refunded":
      return "default" as const;
    default:
      return "default" as const;
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("it-CH", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export function OrdersTable() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | "all">(
    "all"
  );

  useEffect(() => {
    void (async () => {
      setLoading(true);
      const res = await fetchOrders();
      setOrders(res.data);
      setError(res.error ?? null);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      if (statusFilter !== "all" && o.status !== statusFilter) return false;
      if (paymentFilter !== "all" && o.paymentStatus !== paymentFilter) {
        return false;
      }
      if (!q) return true;
      const haystack = [
        o.orderNumber,
        o.customerEmail,
        o.customerFirstName,
        o.customerLastName,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [orders, search, statusFilter, paymentFilter]);

  if (loading) {
    return (
      <p className={`py-12 text-center ${adminMutedTextClass}`}>
        Caricamento ordini…
      </p>
    );
  }

  if (error) {
    return (
      <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
        {error}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <input
          type="search"
          placeholder="Cerca numero ordine, email, cliente…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`max-w-md flex-1 ${adminInputClass}`}
        />
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as OrderStatus | "all")
          }
          className={adminInputClass}
        >
          <option value="all">Tutti gli status</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {orderStatusLabels[s]}
            </option>
          ))}
        </select>
        <select
          value={paymentFilter}
          onChange={(e) =>
            setPaymentFilter(e.target.value as PaymentStatus | "all")
          }
          className={adminInputClass}
        >
          <option value="all">Tutti i pagamenti</option>
          {PAYMENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {paymentStatusLabels[s]}
            </option>
          ))}
        </select>
      </div>

      <div className={adminTableShellClass}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className={adminTableHeadRowClass}>
                <th className={adminTableHeadCellClass}>Ordine</th>
                <th className={adminTableHeadCellClass}>Cliente</th>
                <th className={adminTableHeadCellClass}>Totale</th>
                <th className={adminTableHeadCellClass}>Status</th>
                <th className={adminTableHeadCellClass}>Pagamento</th>
                <th className={adminTableHeadCellClass}>Data</th>
                <th className={adminTableHeadCellClass}>Azioni</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className={`px-4 py-12 text-center ${adminMutedTextClass}`}
                  >
                    Nessun ordine trovato.
                  </td>
                </tr>
              ) : (
                filtered.map((o) => (
                  <tr key={o.id} className={adminTableRowClass}>
                    <td className="px-4 py-3">
                      <p className="font-mono text-sm font-medium text-zinc-100">
                        {o.orderNumber}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-zinc-100">
                        {o.customerFirstName} {o.customerLastName}
                      </p>
                      <p className={adminCaptionClass}>{o.customerEmail}</p>
                    </td>
                    <td className="px-4 py-3 font-medium text-zinc-100">
                      {formatPrice(o.total)}
                    </td>
                    <td className="px-4 py-3">
                      <AdminBadge variant={statusBadgeVariant(o.status)}>
                        {orderStatusLabels[o.status]}
                      </AdminBadge>
                    </td>
                    <td className="px-4 py-3">
                      <AdminBadge
                        variant={paymentBadgeVariant(o.paymentStatus)}
                      >
                        {paymentStatusLabels[o.paymentStatus]}
                      </AdminBadge>
                    </td>
                    <td className={`px-4 py-3 ${adminCaptionClass}`}>
                      {formatDate(o.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className={adminBtnGhostClass}
                      >
                        Apri
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <p className={adminCaptionClass}>
        {filtered.length} di {orders.length} ordini
      </p>
    </div>
  );
}
