"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchCustomerOrders } from "@/lib/customer/profile";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/admin/order-badges";
import { formatPrice } from "@/data/shop";

export function CustomerOrdersList() {
  const [orders, setOrders] = useState<Awaited<ReturnType<typeof fetchCustomerOrders>>["data"]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const res = await fetchCustomerOrders();
      setOrders(res.data);
      setError(res.error ?? null);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <p className="text-sm text-silver-500">Caricamento ordini…</p>;
  }

  if (error) {
    return (
      <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
        {error}
      </p>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-12 text-center">
        <p className="text-silver-400">Non hai ancora ordini.</p>
        <Link
          href="/shop"
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-iron-950 transition hover:bg-silver-300"
        >
          Vai allo shop
        </Link>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {orders.map((o) => (
        <li key={o.id}>
          <Link
            href={`/account/orders/${o.id}`}
            className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-white/20 hover:bg-white/[0.06]"
          >
            <div>
              <p className="font-mono text-sm font-semibold text-silver-100">
                {o.orderNumber}
              </p>
              <p className="mt-1 text-xs text-silver-500">
                {new Date(o.createdAt).toLocaleString("it-CH", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <OrderStatusBadge status={o.status} />
              <PaymentStatusBadge status={o.paymentStatus} />
              <span className="text-sm font-semibold text-silver-200">
                {formatPrice(o.total)}
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
