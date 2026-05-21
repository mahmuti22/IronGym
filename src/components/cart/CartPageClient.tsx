"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartProvider";
import { formatPrice, getProductPath } from "@/data/shop";

export function CartPageClient() {
  const { items, ready, subtotal, setQuantity, removeItem, clear } = useCart();

  if (!ready) {
    return (
      <p className="py-16 text-center text-sm text-silver-500">
        Caricamento carrello…
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-silver-500/20 bg-white/[0.03] px-8 py-16 text-center">
        <p className="text-lg font-semibold text-silver-200">
          Il carrello è vuoto
        </p>
        <p className="mt-3 text-sm text-silver-500">
          Esplora lo shop e aggiungi i tuoi pezzi IronGym preferiti.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-iron-950 transition hover:bg-silver-300"
        >
          Continua shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        {items.map((line) => (
          <article
            key={line.lineId}
            className="flex flex-col gap-4 rounded-2xl border border-silver-500/20 bg-white/[0.03] p-4 sm:flex-row sm:items-center"
          >
            <Link
              href={getProductPath(line.slug)}
              className="relative aspect-[4/5] w-full shrink-0 overflow-hidden rounded-xl bg-iron-950 sm:h-28 sm:w-24 sm:aspect-auto"
            >
              <Image
                src={line.image}
                alt={line.name}
                fill
                className="object-cover"
                sizes="96px"
              />
            </Link>

            <div className="min-w-0 flex-1">
              <Link
                href={getProductPath(line.slug)}
                className="font-semibold text-silver-100 transition hover:text-white"
              >
                {line.name}
              </Link>
              <p className="mt-1 text-sm text-silver-500">
                Taglia: <span className="text-silver-300">{line.size}</span>
                {line.color !== "—" && (
                  <>
                    {" "}
                    · Colore:{" "}
                    <span className="text-silver-300">{line.color}</span>
                  </>
                )}
              </p>
              <p className="mt-2 text-sm font-medium text-silver-300">
                {formatPrice(line.price)} / unità
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:flex-col sm:items-end">
              <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-silver-600">
                Qtà
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={line.quantity}
                  onChange={(e) =>
                    setQuantity(line.lineId, Number(e.target.value) || 1)
                  }
                  className="w-16 rounded-lg border border-silver-500/35 bg-white/[0.06] px-2 py-1.5 text-center text-sm text-silver-200 outline-none focus:border-silver-400/55"
                />
              </label>
              <p className="text-sm font-semibold text-silver-200">
                {formatPrice(line.price * line.quantity)}
              </p>
              <button
                type="button"
                onClick={() => removeItem(line.lineId)}
                className="text-xs font-semibold text-red-300/90 transition hover:text-red-200"
              >
                Rimuovi
              </button>
            </div>
          </article>
        ))}

        <button
          type="button"
          onClick={clear}
          className="text-xs font-semibold uppercase tracking-widest text-silver-500 transition hover:text-silver-300"
        >
          Svuota carrello
        </button>
      </div>

      <aside className="h-fit rounded-2xl border border-silver-500/20 bg-white/[0.04] p-6 lg:sticky lg:top-24">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-silver-500">
          Riepilogo
        </h2>
        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between text-silver-400">
            <dt>Articoli</dt>
            <dd>{items.reduce((n, i) => n + i.quantity, 0)}</dd>
          </div>
          <div className="flex justify-between border-t border-silver-500/15 pt-3 text-base font-semibold text-silver-100">
            <dt>Totale</dt>
            <dd>{formatPrice(subtotal)}</dd>
          </div>
        </dl>

        <button
          type="button"
          disabled
          title="Checkout in arrivo"
          className="mt-8 flex w-full min-h-12 cursor-not-allowed items-center justify-center rounded-full border border-silver-500/25 bg-white/[0.03] px-6 text-sm font-semibold text-silver-500"
        >
          Checkout in arrivo
        </button>

        <Link
          href="/shop"
          className="mt-3 flex w-full min-h-11 items-center justify-center rounded-full border border-silver-400/45 bg-white/[0.04] px-6 text-sm font-semibold text-silver-300 transition hover:border-silver-300/70 hover:text-white"
        >
          Continua shopping
        </Link>
      </aside>
    </div>
  );
}
