"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import type { ShopProduct } from "@/data/shop";
import {
  formatPrice,
  getSimilarProducts,
  getSubcategoryById,
  MAIN_CATEGORY,
  productImageFocusClasses,
  shopFilterLabels,
} from "@/data/shop";
import { ProductTags } from "./ProductTags";
import { ProductCard } from "./ProductCard";

type ProductDetailProps = {
  product: ShopProduct;
};

export function ProductDetail({ product }: ProductDetailProps) {
  const subcategory = getSubcategoryById(product.subcategoryId);
  const similar = getSimilarProducts(product, 4);

  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] ?? "M");
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] ?? "");
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);

  const imageSrc = product.images?.[activeImage] ?? product.image;

  function handleAddToCart() {
    setAdded(true);
  }

  const optionBtn =
    "rounded-full border px-4 py-2 text-sm font-medium transition";
  const optionActive =
    "border-silver-300/70 bg-white text-iron-950";
  const optionIdle =
    "border-silver-500/35 bg-white/[0.04] text-silver-400 hover:border-silver-400/55 hover:text-silver-200";

  return (
    <div className="space-y-16 sm:space-y-20">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="grid gap-10 lg:grid-cols-2 lg:gap-14"
      >
        <div className="ig-tilt-wrap">
          <div className="ig-tilt overflow-hidden rounded-3xl">
            <div className="relative aspect-[4/5] bg-iron-950 sm:aspect-[3/4]">
              <Image
                src={imageSrc}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className={`object-cover ${productImageFocusClasses[product.imageFocusIndex]}`}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 border-t border-silver-500/15 p-3">
                {product.images.map((img, i) => (
                  <button
                    key={`${img}-${i}`}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    className={`relative h-14 w-14 overflow-hidden rounded-lg border transition ${
                      activeImage === i
                        ? "border-silver-300/70"
                        : "border-silver-500/30 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt=""
                      fill
                      className={`object-cover ${productImageFocusClasses[(product.imageFocusIndex + i) % 4]}`}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          <Link
            href="/shop"
            className="text-xs font-semibold uppercase tracking-widest text-silver-600 transition hover:text-silver-400"
          >
            ← Torna allo Shop
          </Link>

          <ProductTags tags={product.tags} className="mt-6" />

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-silver-100 sm:text-4xl">
            {product.name}
          </h1>

          <p className="mt-3 text-2xl font-semibold text-silver-300">
            {formatPrice(product.price)}
          </p>

          <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-widest text-silver-600">
                Categoria
              </dt>
              <dd className="mt-1 text-silver-400">{MAIN_CATEGORY}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-widest text-silver-600">
                Sottocategoria
              </dt>
              <dd className="mt-1 text-silver-400">
                {subcategory?.title ?? product.subcategoryId}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-widest text-silver-600">
                Genere
              </dt>
              <dd className="mt-1 capitalize text-silver-400">{product.gender}</dd>
            </div>
            <div>
              <dt className="text-[10px] font-semibold uppercase tracking-widest text-silver-600">
                Linea
              </dt>
              <dd className="mt-1 text-silver-400">
                {shopFilterLabels[product.filterGroup]}
              </dd>
            </div>
          </dl>

          <p className="mt-8 leading-relaxed text-silver-500">
            {product.longDescription ?? product.description}
          </p>

          <div className="mt-8 space-y-3 rounded-2xl border border-silver-500/20 bg-white/[0.03] p-5 text-sm text-silver-500">
            <p>
              <span className="font-semibold text-silver-400">Materiale:</span>{" "}
              {product.material}
            </p>
            <p>
              <span className="font-semibold text-silver-400">Fit:</span>{" "}
              {product.fit}
            </p>
            <p>
              <span className="font-semibold text-silver-400">Cura:</span>{" "}
              {product.careInstructions}
            </p>
          </div>

          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-silver-600">
                Taglia
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`${optionBtn} ${
                      selectedSize === size ? optionActive : optionIdle
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.colors && product.colors.length > 0 && (
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-silver-600">
                Colore
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`${optionBtn} ${
                      selectedColor === color ? optionActive : optionIdle
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleAddToCart}
              className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-iron-950 transition hover:bg-silver-300"
            >
              Aggiungi al carrello
            </button>
            <Link
              href="/shop"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-silver-400/45 bg-white/[0.04] px-8 text-sm font-semibold text-silver-300 transition hover:border-silver-300/70 hover:text-white"
            >
              Torna allo Shop
            </Link>
          </div>

          {added && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-sm text-silver-400"
            >
              {product.name} ({selectedSize}
              {selectedColor ? ` · ${selectedColor}` : ""}) aggiunto al carrello
              — checkout in arrivo.
            </motion.p>
          )}
        </div>
      </motion.div>

      {similar.length > 0 && (
        <section aria-labelledby="similar-heading">
          <h2
            id="similar-heading"
            className="text-lg font-semibold tracking-tight text-silver-200 sm:text-xl"
          >
            Prodotti simili
          </h2>
          <p className="mt-1 text-sm text-silver-500">
            Stessa categoria o linea IronGym
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((item) => (
              <div key={item.id} className="h-full">
                <ProductCard product={item} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
