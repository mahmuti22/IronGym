import type { ShopFilterGroup } from "@/data/shop";

/** Slug usato nell’URL /shop/[group]/[subcategory] */
export function categoryPathSlug(
  slug: string,
  groupSlug: ShopFilterGroup | null
): string {
  if (!groupSlug) return slug;
  const prefix = `${groupSlug}-`;
  if (slug.startsWith(prefix)) return slug.slice(prefix.length);
  return slug;
}

export function buildChildCategorySlug(
  groupSlug: ShopFilterGroup,
  pathSlug: string
): string {
  const clean = pathSlug.trim().replace(/^[^a-z0-9]+/i, "");
  if (clean.startsWith(`${groupSlug}-`)) return clean;
  return `${groupSlug}-${clean}`;
}
