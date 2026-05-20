import Image from "next/image";
import Link from "next/link";
import type { ShopGroup } from "@/data/shop";
import { getGroupPath } from "@/data/shop";
import { CATALOG_STUDIO_MODEL_01, productImageFocusClasses } from "@/data/catalog";

type GroupCardProps = {
  group: ShopGroup;
};

export function GroupCard({ group }: GroupCardProps) {
  return (
    <Link href={getGroupPath(group.slug)} className="ig-tilt-wrap block h-full">
      <article className="ig-tilt group relative flex min-h-[240px] flex-col overflow-hidden rounded-3xl sm:min-h-[280px]">
        <div className="relative aspect-[16/9] shrink-0 overflow-hidden bg-iron-950">
          <Image
            src={CATALOG_STUDIO_MODEL_01}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className={`object-cover opacity-75 transition duration-500 group-hover:scale-105 group-hover:opacity-90 ${productImageFocusClasses[group.imageFocusIndex]}`}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1a1a22] via-[#1a1a22]/30 to-transparent" />
        </div>
        <div className="ig-card-inner flex flex-1 flex-col border-t border-silver-500/15 p-6 sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-silver-100 transition group-hover:text-white sm:text-3xl">
            {group.title}
          </h2>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-silver-500 sm:text-base">
            {group.description}
          </p>
          <span className="mt-5 text-xs font-semibold uppercase tracking-widest text-silver-600 transition group-hover:text-silver-400">
            Esplora categoria →
          </span>
        </div>
      </article>
    </Link>
  );
}
