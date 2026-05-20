"use client";

import Image from "next/image";
import Link from "next/link";
import type { ShopSubcategory } from "@/data/shop";
import { getSubcategoryPath } from "@/data/shop";
import { CATALOG_STUDIO_MODEL_01, productImageFocusClasses } from "@/data/catalog";

type CategoryCardProps = {
  category: ShopSubcategory;
  href?: string;
};

export function CategoryCard({ category, href }: CategoryCardProps) {
  const target = href ?? getSubcategoryPath(category);

  return (
    <Link href={target} className="ig-tilt-wrap block h-full w-full text-left">
      <article className="ig-tilt group relative flex h-full min-h-[200px] flex-col overflow-hidden rounded-2xl sm:min-h-[220px]">
        <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-iron-950 sm:aspect-[5/3]">
          <Image
            src={CATALOG_STUDIO_MODEL_01}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`object-cover opacity-70 transition duration-500 group-hover:scale-105 group-hover:opacity-85 ${productImageFocusClasses[category.imageFocusIndex]}`}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1a1a22] via-[#1a1a22]/40 to-transparent" />
          <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:repeating-linear-gradient(-18deg,rgba(255,255,255,0.05)_0_1px,transparent_1px_8px)]" />
        </div>
        <div className="ig-card-inner flex flex-1 flex-col border-t border-silver-500/15 p-4 sm:p-5">
          <h3 className="text-base font-semibold tracking-tight text-silver-200 transition group-hover:text-white sm:text-lg">
            {category.title}
          </h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-silver-500">
            {category.description}
          </p>
          <span className="mt-3 text-[10px] font-semibold uppercase tracking-widest text-silver-600 transition group-hover:text-silver-400">
            Esplora →
          </span>
        </div>
      </article>
    </Link>
  );
}
