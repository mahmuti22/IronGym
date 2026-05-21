"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchCustomerOrderById } from "@/lib/customer/profile";
import type { AdminOrder } from "@/lib/orders/types";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/admin/order-badges";
import { formatPrice } from "@/data/shop";

export function CustomerOrderDetail({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const res = await fetchCustomerOrderById(orderId);
      setOrder(res.data);
      setError(res.error ?? (res.data ? null : "Ordine non trovato"));
      setLoading(false);
    })();
  }, [orderId]);

  if (loading) {
    return <p className="text-sm text-silver-500">Caricamento…</p>;
  }

  if (!order) {
    return (
      <div className="space-y-4">
        <p className="text-silver-300">{error ?? "Ordine non trovato"}</p>
        <Link href="/account/orders" className="text-sm font-semibold text-silver-300 hover:text-white">
          ← I miei ordini
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/account/orders"
        className="text-sm font-semibold text-silver-400 transition hover:text-white"
      >
        ← I miei ordini
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xl font-semibold text-silver-100">
            {order.orderNumber}
          </p>
          <p className="mt-1 text-sm text-silver-500">
            {new Date(order.createdAt).toLocaleString("it-CH", {
              dateStyle: "long",
              timeStyle: "short",
            })}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <OrderStatusBadge status={order.status} />
          <PaymentStatusBadge status={order.paymentStatus} />
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-sm text-silver-300">
        <p>{order.shippingAddress}</p>
        <p>
          {order.shippingPostcode} {order.shippingCity}
        </p>
        <p>{order.shippingCountry}</p>
      </div>

      <ul className="space-y-3">
        {(order.items ?? []).map((item) => (
          <li
            key={item.id}
            className="flex flex-wrap gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4"
          >
            <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-black/40">
              {item.productImageUrl ? (
                <Image
                  src={item.productImageUrl}
                  alt={item.productName}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-silver-100">{item.productName}</p>
              <p className="text-xs text-silver-500">
                Taglia {item.selectedSize ?? "—"} · {item.selectedColor ?? "—"} · Qtà{" "}
                {item.quantity}
              </p>
            </div>
            <p className="font-semibold text-silver-200">
              {formatPrice(item.lineTotal)}
            </p>
          </li>
        ))}
      </ul>

      <p className="text-right text-xl font-bold text-silver-100">
        Totale {formatPrice(order.total)}
      </p>
    </div>
  );
}
