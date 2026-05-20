import {
  shopProducts,
  getProductById,
  type ShopProduct,
} from "@/data/shop";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { CATALOG_STUDIO_MODEL_01 } from "@/data/catalog";
import type { DbProduct } from "@/types/database";
import type { ProductTag, ShopFilterGroup, ShopGender } from "@/data/shop";

/** Published products for public shop (Supabase when configured, else static mock). */
export async function fetchPublishedShopProducts(): Promise<{
  products: ShopProduct[];
  source: "supabase" | "mock";
}> {
  if (!isSupabaseConfigured()) {
    return { products: [...shopProducts], source: "mock" };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { products: [...shopProducts], source: "mock" };
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true });

  if (error || !data?.length) {
    return { products: [...shopProducts], source: "mock" };
  }

  return {
    products: data.map(mapPublishedRowToShopProduct),
    source: "supabase",
  };
}

function mapPublishedRowToShopProduct(row: DbProduct): ShopProduct {
  const mock = shopProducts.find((p) => p.id === row.slug);
  const focusIndex = mock?.imageFocusIndex ?? 0;

  return {
    id: row.slug,
    name: row.name,
    description: row.short_description ?? "",
    mainCategory: "Abbigliamento Gym",
    subcategoryId: row.subcategory_id ?? "",
    filterGroup: (mock?.filterGroup ?? "uomo") as ShopFilterGroup,
    gender: row.gender as ShopGender,
    price: Number(row.price),
    image: row.main_image_url ?? CATALOG_STUDIO_MODEL_01,
    imageFocusIndex: focusIndex,
    tags: (row.tags ?? []).filter((t): t is ProductTag =>
      ["New", "Best Seller", "Sale"].includes(t)
    ),
  };
}

export async function fetchPublishedProductBySlug(
  slug: string
): Promise<ShopProduct | undefined> {
  if (!isSupabaseConfigured()) {
    return getProductById(slug);
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) return getProductById(slug);

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) return getProductById(slug);

  return mapPublishedRowToShopProduct(data);
}
