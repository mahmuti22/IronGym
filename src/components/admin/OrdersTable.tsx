"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { fetchOrders } from "@/lib/admin/orders";
import type { AdminOrder } from "@/lib/orders/types";
import {
  ORDER_QUICK_FILTERS,
  PAYMENT_STATUSES,
  paymentStatusLabels,
  type OrderQuickFilter,
  type PaymentStatus,
} from "@/lib/orders/types";
import { formatPrice } from "@/data/shop";
import { OrderStatusBadge, PaymentStatusBadge } from "./order-badges";
import {
  adminBtnGhostClass,
  adminCaptionClass,
  adminInputClass,
  adminMutedTextClass,
  adminTableHeadCellClass,
  adminTableHeadRowClass,
  adminTableShellClass,
} from "./admin-ui";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("it-CH", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function orderRowClass(order: AdminOrder): string {
  const base =
    "border-b border-white/[0.08] transition-colors hover:bg-white/[0.06]";
  if (order.status === "new") {
    return `${base} border-l-4 border-l-amber-400/80 bg-amber-500/[0.07] hover:bg-amber-500/10`;
  }
  return base;
}

export function OrdersTable() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [quickFilter, setQuickFilter] = useState<OrderQuickFilter>("all");
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

  const newCount = useMemo(
    () => orders.filter((o) => o.status === "new").length,
    [orders]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      if (quickFilter !== "all" && o.status !== quickFilter) return false;
      if (paymentFilter !== "all" && o.paymentStatus !== paymentFilter) {
        return false;
      }
      if (!q) return true;
      const haystack = [
        o.orderNumber,
        o.customerEmail,
        o.customerFirstName,
        o.customerLastName,
        `${o.customerFirstName} ${o.customerLastName}`,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [orders, search, quickFilter, paymentFilter]);

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
      <div className="flex flex-wrap items-center gap-2">
        {ORDER_QUICK_FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setQuickFilter(f.id)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
              quickFilter === f.id
                ? "border-amber-400/40 bg-amber-500/20 text-amber-100"
                : "border-white/10 bg-white/[0.04] text-zinc-400 hover:border-white/20 hover:text-zinc-200"
            }`}
          >
            {f.label}
            {f.id === "new" && newCount > 0 && (
              <span className="ml-1.5 inline-flex min-w-[1.25rem] justify-center rounded-full bg-amber-500/30 px-1.5 text-[10px] text-amber-50">
                {newCount}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <input
          type="search"
          placeholder="Cerca numero ordine, email, nome cliente…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`max-w-md flex-1 ${adminInputClass}`}
        />
        <select
          value={paymentFilter}
          onChange={(e) =>
            setPaymentFilter(e.target.value as PaymentStatus | "all")
          }
          className={`max-w-xs ${adminInputClass}`}
          aria-label="Filtra per pagamento"
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
          <table className="w-full min-w-[960px] text-left text-sm">
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
                  <tr key={o.id} className={orderRowClass(o)}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {o.status === "new" && (
                          <span
                            className="h-2 w-2 shrink-0 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]"
                            title="Nuovo ordine"
                          />
                        )}
                        <p className="font-mono text-sm font-medium text-zinc-100">
                          {o.orderNumber}
                        </p>
                      </div>
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
                      <OrderStatusBadge status={o.status} />
                    </td>
                    <td className="px-4 py-3">
                      <PaymentStatusBadge status={o.paymentStatus} />
                    </td>
                    <td className={`px-4 py-3 ${adminCaptionClass}`}>
                      {formatDate(o.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className={adminBtnGhostClass}
                      >
                        Apri →
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
        {newCount > 0 && ` · ${newCount} nuov${newCount === 1 ? "o" : "i"}`}
      </p>
    </div>
  );
}
