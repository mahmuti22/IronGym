"use client";

import Link from "next/link";

type CheckoutCancelClientProps = {
  orderId: string | null;
};

export function CheckoutCancelClient({ orderId }: CheckoutCancelClientProps) {
  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-amber-500/25 bg-amber-500/10 px-8 py-14 text-center">
      <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-amber-300/90">
        Pagamento annullato
      </p>
      <h2 className="mt-4 text-2xl font-semibold text-silver-100">
        Nessun addebito effettuato
      </h2>
      <p className="mt-3 text-sm text-silver-400">
        Hai interrotto il pagamento su Stripe. Il carrello è ancora disponibile:
        puoi riprovare quando vuoi.
      </p>
      {orderId && (
        <p className="mt-6 font-mono text-xs tracking-wide text-silver-500">
          Ordine in sospeso: {orderId}
        </p>
      )}
      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/checkout"
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-iron-950 transition hover:bg-silver-300"
        >
          Torna al checkout
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
