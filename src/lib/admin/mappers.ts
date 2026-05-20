import { CATALOG_STUDIO_MODEL_01 } from "@/data/catalog";
import {
  MAIN_CATEGORY,
  shopFilterLabels,
  type ProductTag,
  type ShopFilterGroup,
  type ShopGender,
  type ShopSubcategory,
} from "@/data/shop";
import type { DbCategory, DbCollection, DbProduct } from "@/types/database";
import type {
  AdminCategory,
  AdminCollection,
  AdminProduct,
  ProductStatus,
} from "@/lib/admin/types";
import { categoryPathSlug } from "@/lib/shop/category-utils";

const VALID_TAGS: ProductTag[] = ["New", "Best Seller", "Sale"];

function parseTags(tags: string[] | null | undefined): ProductTag[] {
  if (!tags) return [];
  return tags.filter((t): t is ProductTag =>
    VALID_TAGS.includes(t as ProductTag)
  );
}

function toFilterGroup(
  groupSlug: string | null,
  categories: AdminCategory[],
  subcategoryId: string | null
): ShopFilterGroup {
  if (groupSlug && groupSlug in shopFilterLabels) {
    return groupSlug as ShopFilterGroup;
  }
  const sub = categories.find((c) => c.id === subcategoryId);
  if (sub?.groupSlug) return sub.groupSlug;
  return "uomo";
}

export function mapDbCategory(row: DbCategory): AdminCategory {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    imageUrl: row.image_url,
    parentId: row.parent_id,
    groupSlug: row.group_slug as ShopFilterGroup | null,
    status: row.status,
    sortOrder: row.sort_order,
  };
}

export function mapDbCollection(row: DbCollection): AdminCollection {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    heroImageUrl: row.hero_image_url,
    status: row.status,
    tags: row.tags ?? [],
    sortOrder: row.sort_order,
  };
}

export function mapDbProduct(
  row: DbProduct,
  categories: AdminCategory[]
): AdminProduct {
  const sub = categories.find((c) => c.id === row.subcategory_id);
  const groupSlug = sub?.groupSlug ?? null;

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.short_description ?? "",
    longDescription: row.long_description ?? row.short_description ?? "",
    mainCategory: MAIN_CATEGORY,
    categoryId: row.category_id,
    subcategoryId: row.subcategory_id,
    filterGroup: toFilterGroup(groupSlug, categories, row.subcategory_id),
    gender: row.gender as ShopGender,
    price: Number(row.price),
    salePrice: row.sale_price != null ? Number(row.sale_price) : null,
    image: row.main_image_url ?? CATALOG_STUDIO_MODEL_01,
    imageFocusIndex: 0,
    tags: parseTags(row.tags),
    sizes: row.sizes ?? [],
    colors: row.colors ?? [],
    material: row.material ?? "",
    fit: row.fit ?? "",
    careInstructions: row.care_instructions ?? "",
    status: row.status as ProductStatus,
    stockStatus: row.stock_status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Sottocategorie (solo figli con parent_id) per admin e form prodotto */
export function categoriesToSubcategories(
  categories: AdminCategory[]
): ShopSubcategory[] {
  return categories
    .filter((c) => c.parentId != null)
    .map((c) => ({
      id: c.legacyId ?? c.id,
      slug: categoryPathSlug(c.slug, c.groupSlug),
      title: c.name,
      description: c.description ?? "",
      filterGroup: (c.groupSlug ?? "uomo") as ShopFilterGroup,
      imageFocusIndex: 0,
      dbSlug: c.slug,
    }));
}

/** Categorie principali (senza parent) */
export function categoriesToTopLevelGroups(
  categories: AdminCategory[]
): { slug: ShopFilterGroup; title: string; description: string }[] {
  return categories
    .filter((c) => !c.parentId && c.groupSlug)
    .map((c) => ({
      slug: c.groupSlug as ShopFilterGroup,
      title: c.name,
      description: c.description ?? "",
    }));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
