"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchOrderById, updateOrder } from "@/lib/admin/orders";
import type { AdminOrder, OrderStatus, PaymentStatus } from "@/lib/orders/types";
import {
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  orderStatusLabels,
  paymentStatusLabels,
} from "@/lib/orders/types";
import { formatPrice, getProductPath } from "@/data/shop";
import { OrderStatusBadge, PaymentStatusBadge } from "./order-badges";
import { OrderStatusTimeline } from "./OrderStatusTimeline";
import {
  AdminCard,
  adminBtnPrimaryClass,
  adminBtnSecondaryClass,
  adminCaptionClass,
  adminCardInnerClass,
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
  const [internalNotes, setInternalNotes] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shippingCarrier, setShippingCarrier] = useState("");

  useEffect(() => {
    void (async () => {
      setLoading(true);
      const res = await fetchOrderById(orderId);
      if (res.data) {
        setOrder(res.data);
        setStatus(res.data.status);
        setPaymentStatus(res.data.paymentStatus);
        setInternalNotes(res.data.internalNotes ?? "");
        setTrackingNumber(res.data.trackingNumber ?? "");
        setShippingCarrier(res.data.shippingCarrier ?? "");
      }
      setError(res.error ?? (res.data ? null : "Ordine non trovato"));
      setLoading(false);
    })();
  }, [orderId]);

  async function handleSave() {
    if (!order) return;
    setSaving(true);
    setFeedback(null);

    const res = await updateOrder(
      order.id,
      {
        status,
        paymentStatus,
        internalNotes: internalNotes || null,
        trackingNumber: trackingNumber || null,
        shippingCarrier: shippingCarrier || null,
      },
      order.status
    );

    setSaving(false);
    if (res.ok && res.data) {
      setOrder(res.data);
      setStatus(res.data.status);
      setPaymentStatus(res.data.paymentStatus);
      setInternalNotes(res.data.internalNotes ?? "");
      setTrackingNumber(res.data.trackingNumber ?? "");
      setShippingCarrier(res.data.shippingCarrier ?? "");
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
          <p className={`mt-2 flex flex-wrap items-center gap-2`}>
            <OrderStatusBadge status={order.status} />
            <PaymentStatusBadge status={order.paymentStatus} />
          </p>
          <p className={`mt-2 ${adminMutedTextClass}`}>
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

      <AdminCard className="p-6">
        <h2 className={`mb-4 ${adminSectionTitleClass}`}>Stato ordine</h2>
        <OrderStatusTimeline order={order} />
      </AdminCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <AdminCard className="p-6">
          <h2 className={adminSectionTitleClass}>Cliente</h2>
          <dl className="mt-4 divide-y divide-white/10 text-sm">
            <div className="flex justify-between gap-4 py-3">
              <dt className="text-zinc-500">Nome</dt>
              <dd className="text-right font-medium text-zinc-100">
                {order.customerFirstName} {order.customerLastName}
              </dd>
            </div>
            <div className="flex justify-between gap-4 py-3">
              <dt className="text-zinc-500">Email</dt>
              <dd className="text-right text-zinc-100">
                <a
                  href={`mailto:${order.customerEmail}`}
                  className="text-amber-200/90 hover:text-amber-100"
                >
                  {order.customerEmail}
                </a>
              </dd>
            </div>
            <div className="flex justify-between gap-4 py-3">
              <dt className="text-zinc-500">Telefono</dt>
              <dd className="text-right text-zinc-100">
                {order.customerPhone || "—"}
              </dd>
            </div>
          </dl>
        </AdminCard>

        <AdminCard className="p-6">
          <h2 className={adminSectionTitleClass}>Indirizzo di spedizione</h2>
          <address className="mt-4 not-italic text-sm leading-relaxed text-zinc-200">
            {order.shippingAddress}
            <br />
            {order.shippingPostcode} {order.shippingCity}
            <br />
            {order.shippingCountry}
          </address>
          {order.customerNotes && (
            <div className={`mt-4 rounded-xl border border-white/10 ${adminCardInnerClass} p-4`}>
              <p className={adminCaptionClass}>Note del cliente</p>
              <p className="mt-1 text-sm text-zinc-300">{order.customerNotes}</p>
            </div>
          )}
        </AdminCard>
      </div>

      <AdminCard className="p-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <h2 className={adminSectionTitleClass}>Articoli ordinati</h2>
          <p className="text-2xl font-bold text-amber-200/90">
            {formatPrice(order.total)}
          </p>
        </div>
        <ul className="space-y-3">
          {(order.items ?? []).map((item) => (
            <li
              key={item.id}
              className={`flex flex-wrap items-center gap-4 p-4 ${adminCardInnerClass}`}
            >
              <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-black/50">
                {item.productImageUrl ? (
                  <Image
                    src={item.productImageUrl}
                    alt={item.productName}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                ) : (
                  <span className="flex h-full items-center justify-center text-xs text-zinc-600">
                    —
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  href={getProductPath(item.productSlug)}
                  target="_blank"
                  className="text-base font-semibold text-zinc-100 hover:text-white"
                >
                  {item.productName}
                </Link>
                <p className={adminCaptionClass}>{item.productSlug}</p>
                <p className="mt-2 text-sm text-zinc-400">
                  Taglia <span className="text-zinc-200">{item.selectedSize ?? "—"}</span>
                  {" · "}
                  Colore <span className="text-zinc-200">{item.selectedColor ?? "—"}</span>
                  {" · "}
                  Qtà <span className="text-zinc-200">{item.quantity}</span>
                </p>
              </div>
              <div className="text-right">
                <p className={adminCaptionClass}>
                  {formatPrice(item.unitPrice)} × {item.quantity}
                </p>
                <p className="text-lg font-semibold text-white">
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
          {order.shippingTotal > 0 && (
            <div className="flex justify-between text-zinc-400">
              <dt>Spedizione</dt>
              <dd>{formatPrice(order.shippingTotal)}</dd>
            </div>
          )}
          <div className="flex justify-between border-t border-white/10 pt-3 text-lg font-bold text-white">
            <dt>Totale ordine</dt>
            <dd className="text-amber-200/90">{formatPrice(order.total)}</dd>
          </div>
        </dl>
      </AdminCard>

      <AdminCard className="p-6">
        <h2 className={`mb-6 ${adminSectionTitleClass}`}>Gestione ordine</h2>
        <div className="grid gap-6 lg:grid-cols-2">
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
          <div>
            <label className={adminLabelClass}>Corriere (opzionale)</label>
            <input
              type="text"
              value={shippingCarrier}
              onChange={(e) => setShippingCarrier(e.target.value)}
              placeholder="es. Swiss Post, DHL…"
              className={adminInputClass}
            />
          </div>
          <div>
            <label className={adminLabelClass}>Tracking number</label>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Codice di tracciamento"
              className={adminInputClass}
            />
          </div>
          <div className="lg:col-span-2">
            <label className={adminLabelClass}>Note interne admin</label>
            <textarea
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              rows={4}
              placeholder="Visibili solo in admin — non inviate al cliente"
              className={`${adminInputClass} resize-y min-h-[100px]`}
            />
          </div>
        </div>

        {(order.shippedAt || order.completedAt || order.cancelledAt) && (
          <dl className={`mt-6 grid gap-2 sm:grid-cols-3 ${adminCaptionClass}`}>
            {order.shippedAt && (
              <div>
                <dt className="text-zinc-500">Spedito il</dt>
                <dd className="text-zinc-300">
                  {new Date(order.shippedAt).toLocaleString("it-CH")}
                </dd>
              </div>
            )}
            {order.completedAt && (
              <div>
                <dt className="text-zinc-500">Completato il</dt>
                <dd className="text-zinc-300">
                  {new Date(order.completedAt).toLocaleString("it-CH")}
                </dd>
              </div>
            )}
            {order.cancelledAt && (
              <div>
                <dt className="text-zinc-500">Annullato il</dt>
                <dd className="text-zinc-300">
                  {new Date(order.cancelledAt).toLocaleString("it-CH")}
                </dd>
              </div>
            )}
          </dl>
        )}

        <button
          type="button"
          disabled={saving}
          onClick={handleSave}
          className={`mt-8 ${adminBtnPrimaryClass} disabled:opacity-50`}
        >
          {saving ? "Salvataggio…" : "Salva modifiche"}
        </button>
      </AdminCard>
    </div>
  );
}
