"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/components/cart/CartProvider";

type CheckoutSuccessClientProps = {
  orderId: string | null;
};

export function CheckoutSuccessClient({ orderId }: CheckoutSuccessClientProps) {
  const { clear } = useCart();

  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-emerald-500/25 bg-emerald-500/10 px-8 py-14 text-center">
      <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-emerald-300/90">
        Pagamento ricevuto
      </p>
      <h2 className="mt-4 text-2xl font-semibold text-silver-100">
        Grazie per il tuo ordine
      </h2>
      <p className="mt-3 text-sm text-silver-400">
        Il pagamento è stato elaborato da Stripe. Riceverai una conferma via
        email; l&apos;ordine passa in lavorazione non appena il webhook conferma
        il pagamento.
      </p>
      {orderId && (
        <p className="mt-6 font-mono text-xs tracking-wide text-silver-500">
          Riferimento ordine: {orderId}
        </p>
      )}
      <p className="mt-2 text-xs text-silver-500">
        Il carrello è stato svuotato.
      </p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/shop"
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-iron-950 transition hover:bg-silver-300"
        >
          Continua shopping
        </Link>
        <Link
          href="/account/orders"
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-silver-400/45 bg-white/[0.04] px-8 text-sm font-semibold text-silver-300 transition hover:border-silver-300/70 hover:text-white"
        >
          I miei ordini
        </Link>
      </div>
    </div>
  );
}
