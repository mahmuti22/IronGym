"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { CheckoutForm } from "./CheckoutForm";
import { OrderSummary } from "./OrderSummary";
import { cartLineToOrderItem } from "@/lib/orders/validation";
import { hasCheckoutErrors, validateCheckoutForm } from "@/lib/checkout/validation";
import {
  emptyCheckoutForm,
  type CheckoutFormData,
  type CheckoutFormErrors,
} from "@/lib/checkout/types";

type Step = "checkout" | "success";

type CheckoutPageClientProps = {
  initialForm?: CheckoutFormData;
  stripeEnabled?: boolean;
};

export function CheckoutPageClient({
  initialForm,
  stripeEnabled = false,
}: CheckoutPageClientProps) {
  const { items, ready, subtotal, clear } = useCart();
  const [step, setStep] = useState<Step>("checkout");
  const [form, setForm] = useState<CheckoutFormData>(
    initialForm ?? emptyCheckoutForm()
  );
  const [errors, setErrors] = useState<CheckoutFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function updateField(field: keyof CheckoutFormData, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => {
      if (!e[field]) return e;
      const next = { ...e };
      delete next[field];
      return next;
    });
  }

  async function handleConfirm() {
    const validation = validateCheckoutForm(form);
    setErrors(validation);
    if (hasCheckoutErrors(validation)) return;

    setSubmitting(true);
    setSubmitError(null);

    const payload = {
      customer: form,
      items: items.map(cartLineToOrderItem),
    };

    try {
      if (stripeEnabled) {
        const res = await fetch("/api/checkout/stripe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = (await res.json()) as {
          ok?: boolean;
          checkoutUrl?: string;
          error?: string;
        };

        if (!res.ok || !data.ok || !data.checkoutUrl) {
          setSubmitError(
            data.error ??
              (res.status === 503
                ? "Pagamento online non configurato."
                : "Impossibile avviare il pagamento. Riprova tra poco.")
          );
          setSubmitting(false);
          return;
        }

        window.location.href = data.checkoutUrl;
        return;
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as {
        ok?: boolean;
        orderNumber?: string;
        error?: string;
      };

      if (!res.ok || !data.ok || !data.orderNumber) {
        setSubmitError(
          data.error ?? "Impossibile creare l'ordine. Riprova tra poco."
        );
        setSubmitting(false);
        return;
      }

      setOrderNumber(data.orderNumber);
      clear();
      setStep("success");
    } catch {
      setSubmitError(
        "Errore di connessione. Verifica la rete e riprova."
      );
    }

    setSubmitting(false);
  }

  if (!ready) {
    return (
      <p className="py-16 text-center text-sm text-silver-500">
        Caricamento checkout…
      </p>
    );
  }

  if (items.length === 0 && step === "checkout") {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-silver-500/20 bg-white/[0.03] px-8 py-16 text-center">
        <p className="text-lg font-semibold text-silver-200">
          Il tuo carrello è vuoto
        </p>
        <p className="mt-3 text-sm text-silver-500">
          Aggiungi articoli dallo shop prima di procedere al checkout.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-iron-950 transition hover:bg-silver-300"
        >
          Torna allo Shop
        </Link>
      </div>
    );
  }

  if (step === "success" && orderNumber) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-emerald-500/25 bg-emerald-500/10 px-8 py-14 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-emerald-300/90">
          Ordine ricevuto
        </p>
        <h2 className="mt-4 text-2xl font-semibold text-silver-100">
          Grazie per il tuo ordine
        </h2>
        <p className="mt-3 text-sm text-silver-400">
          Il tuo ordine è stato registrato. Ti contatteremo per confermare il
          pagamento e la spedizione.
        </p>
        <p className="mt-6 font-mono text-lg tracking-wide text-white">
          {orderNumber}
        </p>
        <p className="mt-2 text-xs text-silver-500">
          Il carrello è stato svuotato dopo la conferma.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/shop"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-iron-950 transition hover:bg-silver-300"
          >
            Continua shopping
          </Link>
          <Link
            href="/cart"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-silver-400/45 bg-white/[0.04] px-8 text-sm font-semibold text-silver-300 transition hover:border-silver-300/70 hover:text-white"
          >
            Carrello
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-start">
      {submitError && (
        <p
          role="alert"
          className="lg:col-span-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
        >
          {submitError}
        </p>
      )}
      <CheckoutForm
        form={form}
        errors={errors}
        disabled={submitting}
        stripeEnabled={stripeEnabled}
        onChange={updateField}
        onSubmit={handleConfirm}
      />
      <div className="space-y-4">
        <OrderSummary items={items} subtotal={subtotal} />
        {stripeEnabled && (
          <p className="text-xs text-silver-500">
            Pagamento in CHF tramite Stripe. Metodi disponibili: carta e TWINT
            (se abilitato sul tuo account Stripe).
          </p>
        )}
        <Link
          href="/cart"
          className="flex min-h-10 items-center justify-center text-sm font-semibold text-silver-500 transition hover:text-silver-300"
        >
          ← Modifica carrello
        </Link>
      </div>
    </div>
  );
}
