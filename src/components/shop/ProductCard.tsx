"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { ShopProduct } from "@/data/shop";
import { formatPrice, getProductPath, productImageFocusClasses } from "@/data/shop";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { getImageForSelectedColor } from "@/lib/shop/product-image";
import { ProductTags } from "./ProductTags";

type ProductCardProps = {
  product: ShopProduct;
};

const FALLBACK_SIZE = "One Size";
const FALLBACK_COLOR = "Default";

function resolveOptions(list: string[] | undefined, fallback: string): string[] {
  const values = list?.filter(Boolean) ?? [];
  return values.length > 0 ? values : [fallback];
}

export function ProductCard({ product }: ProductCardProps) {
  const href = getProductPath(product.id);
  const sizes = useMemo(
    () => resolveOptions(product.sizes, FALLBACK_SIZE),
    [product.sizes]
  );
  const colors = useMemo(
    () => resolveOptions(product.colors, FALLBACK_COLOR),
    [product.colors]
  );

  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  const showSizePicker = sizes.length > 1;
  const showColorPicker = colors.length > 1;

  const displayImage = getImageForSelectedColor(product, selectedColor);

  const pillBase =
    "rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide transition";
  const pillActive =
    "border-silver-300/70 bg-white text-iron-950";
  const pillIdle =
    "border-silver-500/35 bg-white/[0.04] text-silver-500 hover:border-silver-400/55 hover:text-silver-200";

  return (
    <article className="ig-tilt group relative flex h-full flex-col rounded-2xl">
      <Link
        href={href}
        className="relative block aspect-[4/5] overflow-hidden rounded-t-2xl bg-iron-950"
      >
        <Image
          src={displayImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className={`object-cover transition duration-500 group-hover:scale-[1.03] ${productImageFocusClasses[product.imageFocusIndex]}`}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <ProductTags tags={product.tags} className="absolute left-3 top-3" />
      </Link>

      <div className="ig-card-inner flex flex-1 flex-col rounded-b-2xl border-t border-silver-500/15 p-4 sm:p-5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-silver-600">
          {product.gender}
        </p>
        <Link href={href}>
          <h3 className="mt-1 text-base font-semibold tracking-tight text-silver-200 transition hover:text-white sm:text-lg">
            {product.name}
          </h3>
        </Link>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-silver-500 line-clamp-2">
          {product.description}
        </p>
        <p className="mt-3 text-sm font-semibold text-silver-300">
          {formatPrice(product.price)}
        </p>

        {showSizePicker && (
          <div className="mt-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-silver-600">
              Taglia
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`${pillBase} ${
                    selectedSize === size ? pillActive : pillIdle
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {showColorPicker && (
          <div className={showSizePicker ? "mt-2" : "mt-3"}>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-silver-600">
              Colore
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`${pillBase} ${
                    selectedColor === color ? pillActive : pillIdle
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 flex gap-2 border-t border-silver-500/15 pt-4">
          <AddToCartButton
            product={product}
            selectedSize={selectedSize}
            selectedColor={selectedColor}
            cartImage={displayImage}
            compact
            className="inline-flex min-h-9 min-w-0 flex-1 items-center justify-center rounded-full bg-white px-3 text-xs font-semibold text-iron-950 transition hover:bg-silver-300"
          />
          <Link
            href={href}
            className="inline-flex min-h-9 shrink-0 items-center justify-center rounded-full border border-silver-400/40 bg-white/[0.06] px-3 text-xs font-semibold text-silver-400 transition hover:border-silver-300/60 hover:text-silver-200"
          >
            Dettagli
          </Link>
        </div>
      </div>
    </article>
  );
}
