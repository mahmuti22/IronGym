"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";
import type { ShopProduct } from "@/data/shop";

type AddToCartButtonProps = {
  product: ShopProduct;
  selectedSize: string;
  selectedColor: string;
  /** Snapshot URL stored in cart (e.g. color-specific image later). */
  cartImage?: string;
  compact?: boolean;
  className?: string;
  onAdded?: () => void;
};

export function AddToCartButton({
  product,
  selectedSize,
  selectedColor,
  cartImage,
  compact = false,
  className = "",
  onAdded,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem({
      productId: product.id,
      slug: product.id,
      name: product.name,
      price: product.price,
      image: cartImage ?? product.image,
      size: selectedSize.trim() || "—",
      color: selectedColor.trim() || "—",
      quantity: 1,
    });
    setAdded(true);
    onAdded?.();
    window.setTimeout(() => setAdded(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={
        className ||
        "inline-flex min-h-12 flex-1 items-center justify-center rounded-full px-8 text-sm font-semibold transition"
      }
    >
      {added
        ? "Aggiunto ✓"
        : compact
          ? "Aggiungi"
          : "Aggiungi al carrello"}
    </button>
  );
}
