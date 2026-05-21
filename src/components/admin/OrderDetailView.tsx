"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchOrderById, updateOrderStatus } from "@/lib/admin/orders";
import type { AdminOrder } from "@/lib/orders/types";
import {
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  orderStatusLabels,
  paymentStatusLabels,
  type OrderStatus,
  type PaymentStatus,
} from "@/lib/orders/types";
import { formatPrice, getProductPath } from "@/data/shop";
import {
  AdminCard,
  adminBtnPrimaryClass,
  adminBtnSecondaryClass,
  adminCaptionClass,
  adminInputClass,
  adminLabelClass,
  adminMutedTextClass,
  adminSectionTitleClass,
} from "./admin-ui";

type OrderDetailViewProps = {
  orderId: string;
};

export function OrderDetailView({ orderId }: OrderDetailViewProps) {
  const router = useRouter();
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [status, setStatus] = useState<OrderStatus>("new");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("pending");

  useEffect(() => {
    void (async () => {
      setLoading(true);
      const res = await fetchOrderById(orderId);
      if (res.data) {
        setOrder(res.data);
        setStatus(res.data.status);
        setPaymentStatus(res.data.paymentStatus);
      }
      setError(res.error ?? (res.data ? null : "Ordine non trovato"));
      setLoading(false);
    })();
  }, [orderId]);

  async function handleSave() {
    if (!order) return;
    setSaving(true);
    setFeedback(null);
    const res = await updateOrderStatus(order.id, status, paymentStatus);
    setSaving(false);
    if (res.ok && res.data) {
      setOrder(res.data);
      setFeedback("Ordine aggiornato.");
      router.refresh();
    } else {
      setFeedback(res.error ?? "Errore durante il salvataggio.");
    }
  }

  if (loading) {
    return (
      <p className={`py-12 text-center ${adminMutedTextClass}`}>
        Caricamento ordine…
      </p>
    );
  }

  if (!order) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-lg font-semibold text-white">
          {error ?? "Ordine non trovato"}
        </p>
        <Link href="/admin/orders" className={adminBtnSecondaryClass}>
          Torna agli ordini
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {feedback && (
        <p
          className={`rounded-xl border px-4 py-3 text-sm ${
            feedback.includes("Errore")
              ? "border-red-500/30 bg-red-500/10 text-red-300"
              : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
          }`}
        >
          {feedback}
        </p>
      )}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className={adminCaptionClass}>Numero ordine</p>
          <p className="font-mono text-2xl font-semibold text-white">
            {order.orderNumber}
          </p>
          <p className={`mt-1 ${adminMutedTextClass}`}>
            Creato{" "}
            {new Date(order.createdAt).toLocaleString("it-CH", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>
        <Link href="/admin/orders" className={adminBtnSecondaryClass}>
          ← Ordini
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AdminCard className="p-6">
          <h2 className={adminSectionTitleClass}>Cliente</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div>
              <dt className="text-zinc-500">Nome</dt>
              <dd className="text-zinc-100">
                {order.customerFirstName} {order.customerLastName}
              </dd>
            </div>
            <div>
              <dt className="text-zinc-500">Email</dt>
              <dd className="text-zinc-100">{order.customerEmail}</dd>
            </div>
            {order.customerPhone && (
              <div>
                <dt className="text-zinc-500">Telefono</dt>
                <dd className="text-zinc-100">{order.customerPhone}</dd>
              </div>
            )}
          </dl>
        </AdminCard>

        <AdminCard className="p-6">
          <h2 className={adminSectionTitleClass}>Spedizione</h2>
          <dl className="mt-4 space-y-2 text-sm text-zinc-200">
            <dd>{order.shippingAddress}</dd>
            <dd>
              {order.shippingPostcode} {order.shippingCity}
            </dd>
            <dd>{order.shippingCountry}</dd>
          </dl>
          {order.customerNotes && (
            <p className="mt-4 text-sm text-zinc-400">
              <span className="font-semibold text-zinc-300">Note:</span>{" "}
              {order.customerNotes}
            </p>
          )}
        </AdminCard>
      </div>

      <AdminCard className="p-6">
        <h2 className={`mb-4 ${adminSectionTitleClass}`}>Articoli ordinati</h2>
        <ul className="space-y-4">
          {(order.items ?? []).map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap gap-4 rounded-xl border border-white/10 bg-white/[0.04] p-4"
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
                <Link
                  href={getProductPath(item.productSlug)}
                  target="_blank"
                  className="font-semibold text-zinc-100 hover:text-white"
                >
                  {item.productName}
                </Link>
                <p className={adminCaptionClass}>{item.productSlug}</p>
                <p className="mt-1 text-sm text-zinc-400">
                  Taglia {item.selectedSize ?? "—"}
                  {item.selectedColor && item.selectedColor !== "—"
                    ? ` · ${item.selectedColor}`
                    : ""}{" "}
                  · Qtà {item.quantity}
                </p>
              </div>
              <div className="text-right text-sm">
                <p className="text-zinc-400">
                  {formatPrice(item.unitPrice)} × {item.quantity}
                </p>
                <p className="font-semibold text-zinc-100">
                  {formatPrice(item.lineTotal)}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <dl className="mt-6 space-y-2 border-t border-white/10 pt-4 text-sm">
          <div className="flex justify-between text-zinc-400">
            <dt>Subtotale</dt>
            <dd>{formatPrice(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between text-base font-semibold text-white">
            <dt>Totale</dt>
            <dd>{formatPrice(order.total)}</dd>
          </div>
        </dl>
      </AdminCard>

      <AdminCard className="p-6">
        <h2 className={`mb-4 ${adminSectionTitleClass}`}>Gestione ordine</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={adminLabelClass}>Status ordine</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as OrderStatus)}
              className={adminInputClass}
            >
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {orderStatusLabels[s]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={adminLabelClass}>Status pagamento</label>
            <select
              value={paymentStatus}
              onChange={(e) =>
                setPaymentStatus(e.target.value as PaymentStatus)
              }
              className={adminInputClass}
            >
              {PAYMENT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {paymentStatusLabels[s]}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="button"
          disabled={saving}
          onClick={handleSave}
          className={`mt-6 ${adminBtnPrimaryClass} disabled:opacity-50`}
        >
          {saving ? "Salvataggio…" : "Salva modifiche"}
        </button>
      </AdminCard>
    </div>
  );
}
