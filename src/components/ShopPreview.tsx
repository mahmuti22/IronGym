"use client";

import Link from "next/link";
import { Reveal } from "./Reveal";
import {
  MAIN_CATEGORY,
  shopGroups,
  shopSubcategories,
  getGroupPath,
  getSubcategoryPath,
} from "@/data/shop";
import { CategoryCard } from "./shop/CategoryCard";

const previewSubIds = [
  "uomo-joggers",
  "donna-leggings",
  "acc-gloves",
  "col-new",
];

export function ShopPreview() {
  const previewSubs = previewSubIds
    .map((id) => shopSubcategories.find((s) => s.id === id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <section
      id="abbigliamento"
      className="border-b border-white/[0.06] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-silver-600">
                {MAIN_CATEGORY}
              </p>
              <h2 className="mt-3 text-4xl leading-[1.15] tracking-tight sm:text-5xl">
                <span className="ig-brand-wordmark ig-title-shimmer text-4xl sm:text-5xl">
                  Abbigliamento Gym
                </span>
              </h2>
              <p className="mt-4 text-silver-500">
                Uomo, donna, accessori e collezioni — ogni categoria ha la sua
                pagina dedicata nello shop.
              </p>
            </div>
            <Link
              href="/shop"
              className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-iron-950 transition hover:bg-silver-300"
            >
              Vai allo Shop
            </Link>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {shopGroups.map((group, i) => (
            <Reveal key={group.slug} delay={0.04 + i * 0.04}>
              <Link
                href={getGroupPath(group.slug)}
                className="ig-tilt-wrap block rounded-2xl"
              >
                <div className="ig-tilt rounded-2xl px-5 py-6 transition group">
                  <p className="text-lg font-semibold text-silver-200 transition group-hover:text-white">
                    {group.title}
                  </p>
                  <p className="mt-2 text-sm text-silver-500 line-clamp-2">
                    {group.description}
                  </p>
                  <span className="mt-4 inline-block text-[10px] font-semibold uppercase tracking-widest text-silver-600">
                    Apri →
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {previewSubs.map((cat, i) => (
            <Reveal key={cat.id} delay={0.12 + i * 0.04}>
              <CategoryCard category={cat} href={getSubcategoryPath(cat)} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2} className="mt-8 text-center sm:text-left">
          <Link
            href="/shop"
            className="text-sm font-semibold text-silver-300 transition hover:text-white"
          >
            Tutte le categorie →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
