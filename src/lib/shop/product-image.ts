import type { ShopProduct } from "@/data/shop";

/**
 * Returns the image URL to display for the current color selection.
 *
 * Today: always uses the product main image (and optional gallery fallback).
 * Future: map `selectedColor` to entries in `product_images` or a
 * `colorImages: Record<string, string>` field when the catalog provides it.
 */
export function getImageForSelectedColor(
  product: ShopProduct,
  selectedColor?: string
): string {
  void selectedColor;

  if (product.image?.trim()) {
    return product.image;
  }

  if (product.images?.length) {
    return product.images[0];
  }

  return product.image;
}
