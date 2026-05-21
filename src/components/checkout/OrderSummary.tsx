"use client";

import Image from "next/image";
import Link from "next/link";
import type { CartLine } from "@/lib/cart/types";
import { formatPrice, getProductPath } from "@/data/shop";

type OrderSummaryProps = {
  items: CartLine[];
  subtotal: number;
  compact?: boolean;
};

export function OrderSummary({ items, subtotal, compact = false }: OrderSummaryProps) {
  const itemCount = items.reduce((n, i) => n + i.quantity, 0);

  return (
    <div
      className={`rounded-2xl border border-silver-500/20 bg-white/[0.04] ${
        compact ? "p-5" : "p-6 lg:sticky lg:top-24"
      }`}
    >
      <h2 className="text-sm font-semibold uppercase tracking-widest text-silver-500">
        Riepilogo ordine
      </h2>
      <p className="mt-1 text-xs text-silver-600">
        {itemCount} {itemCount === 1 ? "articolo" : "articoli"}
      </p>

      <ul className={`mt-5 space-y-4 ${compact ? "max-h-64 overflow-y-auto pr-1" : ""}`}>
        {items.map((line) => (
          <li
            key={line.lineId}
            className="flex gap-3 border-b border-silver-500/10 pb-4 last:border-0 last:pb-0"
          >
            <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-iron-950">
              <Image
                src={line.image}
                alt={line.name}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <Link
                href={getProductPath(line.slug)}
                className="text-sm font-semibold text-silver-100 hover:text-white"
              >
                {line.name}
              </Link>
              <p className="mt-0.5 text-xs text-silver-500">
                {line.size}
                {line.color !== "—" ? ` · ${line.color}` : ""} · Qtà {line.quantity}
              </p>
              <p className="mt-1 text-xs text-silver-400">
                {formatPrice(line.price)} × {line.quantity}
              </p>
            </div>
            <p className="shrink-0 text-sm font-semibold text-silver-200">
              {formatPrice(line.price * line.quantity)}
            </p>
          </li>
        ))}
      </ul>

      <dl className="mt-6 space-y-2 border-t border-silver-500/15 pt-4 text-sm">
        <div className="flex justify-between text-silver-400">
          <dt>Subtotale</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between text-silver-400">
          <dt>Spedizione</dt>
          <dd className="text-silver-500">Calcolata al checkout reale</dd>
        </div>
        <div className="flex justify-between border-t border-silver-500/15 pt-3 text-base font-semibold text-silver-100">
          <dt>Totale</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
      </dl>
    </div>
  );
}
