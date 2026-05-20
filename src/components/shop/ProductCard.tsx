import Image from "next/image";
import Link from "next/link";
import type { ShopProduct } from "@/data/shop";
import { formatPrice, getProductPath, productImageFocusClasses } from "@/data/shop";
import { ProductTags } from "./ProductTags";

type ProductCardProps = {
  product: ShopProduct;
};

export function ProductCard({ product }: ProductCardProps) {
  const href = getProductPath(product.id);

  return (
    <Link href={href} className="ig-tilt-wrap block h-full">
      <article className="ig-tilt group relative flex h-full flex-col rounded-2xl">
        <div className="relative aspect-[4/5] overflow-hidden rounded-t-2xl bg-iron-950">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={`object-cover transition duration-500 group-hover:scale-[1.03] ${productImageFocusClasses[product.imageFocusIndex]}`}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <ProductTags
            tags={product.tags}
            className="absolute left-3 top-3"
          />
        </div>
        <div className="ig-card-inner flex flex-1 flex-col rounded-b-2xl border-t border-silver-500/15 p-4 sm:p-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-silver-600">
            {product.gender}
          </p>
          <h3 className="mt-1 text-base font-semibold tracking-tight text-silver-200 transition group-hover:text-white sm:text-lg">
            {product.name}
          </h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-silver-500 line-clamp-2">
            {product.description}
          </p>
          <div className="mt-4 flex items-center justify-between gap-2 border-t border-silver-500/15 pt-4">
            <span className="text-sm font-semibold text-silver-300">
              {formatPrice(product.price)}
            </span>
            <span className="rounded-full border border-silver-400/40 bg-white/[0.06] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-silver-400 transition group-hover:border-silver-300/60 group-hover:text-silver-200">
              Dettagli →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
