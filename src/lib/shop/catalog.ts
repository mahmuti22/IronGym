import {
  shopGroups,
  shopSubcategories,
  shopProducts,
  getProductById,
  applyProductDefaults,
  getSimilarProducts,
  isShopFilterGroup,
  type ShopFilterGroup,
  type ShopGroup,
  type ShopProduct,
  type ShopSubcategory,
} from "@/data/shop";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { CATALOG_STUDIO_MODEL_01 } from "@/data/catalog";
import { mapDbCategory } from "@/lib/admin/mappers";
import type { AdminCategory } from "@/lib/admin/types";
import type { DbProduct } from "@/types/database";
import type { ProductTag, ShopGender } from "@/data/shop";
import { categoryPathSlug } from "./category-utils";

export type ShopCatalogSource = "supabase" | "mock";

export type ShopCatalog = {
  source: ShopCatalogSource;
  products: ShopProduct[];
  groups: ShopGroup[];
  subcategories: ShopSubcategory[];
  categories: AdminCategory[];
};

const VALID_TAGS: ProductTag[] = ["New", "Best Seller", "Sale"];

function parseTags(tags: string[] | null | undefined): ProductTag[] {
  if (!tags) return [];
  return tags.filter((t): t is ProductTag => VALID_TAGS.includes(t as ProductTag));
}

function resolveProductTaxonomy(
  row: DbProduct,
  categories: AdminCategory[]
): {
  filterGroup: ShopFilterGroup;
  subcategoryId: string;
  subcategorySlug: string | null;
  subcategoryUuid: string | null;
  categoryUuid: string | null;
} {
  const sub = row.subcategory_id
    ? categories.find((c) => c.id === row.subcategory_id)
    : undefined;
  const cat = row.category_id
    ? categories.find((c) => c.id === row.category_id)
    : undefined;

  const filterGroup = (sub?.groupSlug ??
    cat?.groupSlug ??
    "uomo") as ShopFilterGroup;

  const subcategoryUuid = sub?.id ?? null;
  const subcategorySlug = sub ? categoryPathSlug(sub.slug, sub.groupSlug) : null;
  const categoryUuid = cat?.id ?? sub?.parentId ?? null;

  return {
    filterGroup,
    subcategoryId: subcategoryUuid ?? subcategorySlug ?? "",
    subcategorySlug,
    subcategoryUuid,
    categoryUuid,
  };
}

export function mapPublishedRowToShopProduct(
  row: DbProduct,
  categories: AdminCategory[]
): ShopProduct {
  const mock = shopProducts.find((p) => p.id === row.slug);
  const tax = resolveProductTaxonomy(row, categories);

  const base: ShopProduct = {
    id: row.slug,
    name: row.name,
    description: row.short_description ?? "",
    mainCategory: "Abbigliamento Gym",
    subcategoryId: tax.subcategoryId,
    filterGroup: tax.filterGroup,
    gender: row.gender as ShopGender,
    price: Number(row.price),
    image: row.main_image_url?.trim() || CATALOG_STUDIO_MODEL_01,
    imageFocusIndex: mock?.imageFocusIndex ?? 0,
    tags: parseTags(row.tags),
    longDescription: row.long_description ?? row.short_description ?? undefined,
    sizes: row.sizes?.length ? row.sizes : undefined,
    colors: row.colors?.length ? row.colors : undefined,
    material: row.material ?? undefined,
    fit: row.fit ?? undefined,
    careInstructions: row.care_instructions ?? undefined,
  };

  return applyProductDefaults({
    ...base,
    subcategorySlug: tax.subcategorySlug,
    categoryUuid: tax.categoryUuid,
    subcategoryUuid: tax.subcategoryUuid,
  } as ShopProduct);
}

function categoryToShopGroup(cat: AdminCategory): ShopGroup {
  const staticGroup = shopGroups.find((g) => g.slug === cat.groupSlug);
  return {
    slug: (cat.groupSlug ?? cat.slug) as ShopFilterGroup,
    title: cat.name,
    description: cat.description ?? staticGroup?.description ?? "",
    imageFocusIndex: staticGroup?.imageFocusIndex ?? 0,
  };
}

function categoryToShopSubcategory(cat: AdminCategory): ShopSubcategory {
  return {
    id: cat.id,
    slug: categoryPathSlug(cat.slug, cat.groupSlug),
    title: cat.name,
    description: cat.description ?? "",
    filterGroup: (cat.groupSlug ?? "uomo") as ShopFilterGroup,
    imageFocusIndex: 0,
    dbSlug: cat.slug,
  };
}

function buildMockCatalog(): ShopCatalog {
  return {
    source: "mock",
    products: shopProducts.map(applyProductDefaults),
    groups: [...shopGroups],
    subcategories: [...shopSubcategories],
    categories: [],
  };
}

export async function getShopCatalog(): Promise<ShopCatalog> {
  if (!isSupabaseConfigured()) {
    return buildMockCatalog();
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return buildMockCatalog();
  }

  const [catRes, prodRes] = await Promise.all([
    supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true }),
    supabase
      .from("products")
      .select("*")
      .eq("status", "published")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false }),
  ]);

  if (catRes.error) {
    return buildMockCatalog();
  }

  const categories = (catRes.data ?? []).map(mapDbCategory);
  const visible = categories.filter((c) => c.status === "visible");

  const topLevel = visible.filter(
    (c) =>
      !c.parentId &&
      c.groupSlug &&
      isShopFilterGroup(c.groupSlug)
  );
  const children = visible.filter((c) => c.parentId != null);

  const groups =
    topLevel.length > 0
      ? topLevel.map(categoryToShopGroup)
      : [...shopGroups];

  const subcategories =
    children.length > 0
      ? children.map(categoryToShopSubcategory)
      : [...shopSubcategories];

  let products: ShopProduct[] = [];
  if (prodRes.error) {
    products = shopProducts.map(applyProductDefaults);
  } else if (prodRes.data?.length) {
    products = prodRes.data.map((row) =>
      mapPublishedRowToShopProduct(row, categories)
    );
  }

  return {
    source: "supabase",
    products,
    groups,
    subcategories,
    categories: visible,
  };
}

export function getCatalogGroup(
  catalog: ShopCatalog,
  groupSlug: string
): ShopGroup | undefined {
  if (!isShopFilterGroup(groupSlug)) return undefined;
  return catalog.groups.find((g) => g.slug === groupSlug);
}

export function getCatalogSubcategoriesByGroup(
  catalog: ShopCatalog,
  groupSlug: string
): ShopSubcategory[] {
  if (!isShopFilterGroup(groupSlug)) return [];
  return catalog.subcategories.filter((s) => s.filterGroup === groupSlug);
}

export function getCatalogSubcategoryBySlug(
  catalog: ShopCatalog,
  groupSlug: string,
  subcategorySlug: string
): ShopSubcategory | undefined {
  if (!isShopFilterGroup(groupSlug)) return undefined;
  return catalog.subcategories.find(
    (s) =>
      s.filterGroup === groupSlug &&
      (s.slug === subcategorySlug ||
        s.id === subcategorySlug ||
        ("dbSlug" in s && s.dbSlug === subcategorySlug) ||
        ("dbSlug" in s &&
          s.dbSlug === `${groupSlug}-${subcategorySlug}`))
  );
}

function productMatchesSubcategory(
  product: ShopProduct,
  sub: ShopSubcategory
): boolean {
  if (product.subcategoryUuid && sub.id === product.subcategoryUuid) {
    return true;
  }
  if (product.subcategorySlug && product.subcategorySlug === sub.slug) {
    return true;
  }
  if (product.subcategoryId === sub.id) {
    return true;
  }
  if ("dbSlug" in sub && product.subcategoryId === sub.dbSlug) {
    return true;
  }
  return false;
}

export function getCatalogProductsByGroup(
  catalog: ShopCatalog,
  groupSlug: string
): ShopProduct[] {
  if (!isShopFilterGroup(groupSlug)) return [];
  return catalog.products.filter((p) => p.filterGroup === groupSlug);
}

export function getCatalogProductsBySubcategory(
  catalog: ShopCatalog,
  groupSlug: string,
  subcategorySlug: string
): ShopProduct[] {
  const sub = getCatalogSubcategoryBySlug(catalog, groupSlug, subcategorySlug);
  if (!sub) return [];

  if (sub.filterGroup === "collezioni") {
    return catalog.products.filter(
      (p) =>
        productMatchesSubcategory(p, sub) ||
        (p.tags?.includes("New") && sub.slug === "new-arrivals") ||
        (p.tags?.includes("Best Seller") && sub.slug === "best-seller") ||
        (p.tags?.includes("Sale") && sub.slug === "sale")
    );
  }

  return catalog.products.filter((p) => productMatchesSubcategory(p, sub));
}

export async function getCatalogProductBySlug(
  slug: string
): Promise<{ product: ShopProduct | undefined; catalog: ShopCatalog }> {
  const catalog = await getShopCatalog();

  const product =
    catalog.products.find((p) => p.id === slug) ??
    (catalog.source === "mock" ? getProductById(slug) : undefined);

  return {
    product: product ? applyProductDefaults(product) : undefined,
    catalog,
  };
}

export function getCatalogSimilarProducts(
  catalog: ShopCatalog,
  product: ShopProduct,
  limit = 4
): ShopProduct[] {
  if (catalog.source === "mock") {
    return getSimilarProducts(product, limit);
  }

  const scored = catalog.products
    .filter((p) => p.id !== product.id)
    .map((p) => {
      let score = 0;
      if (
        product.subcategoryUuid &&
        p.subcategoryUuid === product.subcategoryUuid
      ) {
        score += 3;
      } else if (
        product.subcategorySlug &&
        p.subcategorySlug === product.subcategorySlug
      ) {
        score += 3;
      } else if (p.subcategoryId === product.subcategoryId) {
        score += 3;
      }
      if (p.filterGroup === product.filterGroup) score += 2;
      if (p.gender === product.gender) score += 1;
      return { p, score };
    })
    .sort((a, b) => b.score - a.score);

  const picked = scored.filter((s) => s.score > 0).map((s) => s.p);
  const list = picked.length > 0 ? picked : catalog.products.filter((p) => p.id !== product.id);
  return list.slice(0, limit).map(applyProductDefaults);
}

export function getCatalogSubcategoryParams(
  catalog: ShopCatalog
): { group: ShopFilterGroup; subcategory: string }[] {
  return catalog.subcategories.map((s) => ({
    group: s.filterGroup,
    subcategory: s.slug,
  }));
}

export function getCatalogProductSlugs(catalog: ShopCatalog): string[] {
  return catalog.products.map((p) => p.id);
}
