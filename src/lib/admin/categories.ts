import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { buildChildCategorySlug } from "@/lib/shop/category-utils";
import type { ShopFilterGroup } from "@/data/shop";
import type { AdminActionResult, AdminCategory } from "@/lib/admin/types";
import { mapDbCategory, slugify } from "./mappers";
import { getMockCategories } from "./mock-data";

export async function fetchCategories(): Promise<{
  data: AdminCategory[];
  source: "supabase" | "mock";
  error?: string;
}> {
  if (!isSupabaseConfigured()) {
    return { data: getMockCategories(), source: "mock" };
  }

  const supabase = createBrowserSupabaseClient();
  if (!supabase) {
    return { data: getMockCategories(), source: "mock" };
  }

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    return {
      data: getMockCategories(),
      source: "mock",
      error: error.message,
    };
  }

  return {
    data: (data ?? []).map(mapDbCategory),
    source: "supabase",
  };
}

export async function countProductsForCategory(
  categoryId: string
): Promise<number> {
  if (!isSupabaseConfigured()) return 0;

  const supabase = createBrowserSupabaseClient();
  if (!supabase) return 0;

  const { count, error } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .or(`category_id.eq.${categoryId},subcategory_id.eq.${categoryId}`);

  if (error) return 0;
  return count ?? 0;
}

export type CategoryInput = {
  id?: string;
  slug?: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  parentId?: string | null;
  groupSlug?: ShopFilterGroup | null;
  status?: string;
  sortOrder?: number;
  legacyId?: string;
};

export async function upsertCategory(
  category: CategoryInput
): Promise<AdminActionResult<AdminCategory>> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured" };
  }

  const supabase = createBrowserSupabaseClient();
  if (!supabase) {
    return { ok: false, error: "Supabase client unavailable" };
  }

  const slug =
    category.slug?.trim() ||
    (category.parentId && category.groupSlug
      ? buildChildCategorySlug(
          category.groupSlug,
          slugify(category.name)
        )
      : slugify(category.name));

  const payload: import("@/types/database").Database["public"]["Tables"]["categories"]["Insert"] =
    {
      slug,
      name: category.name,
      description: category.description ?? null,
      image_url: category.imageUrl ?? null,
      parent_id: category.parentId ?? null,
      group_slug: category.groupSlug ?? null,
      status: category.status ?? "visible",
      sort_order: category.sortOrder ?? 0,
    };

  if (category.id && !category.legacyId) {
    const { data, error } = await supabase
      .from("categories")
      .update(payload)
      .eq("id", category.id)
      .select()
      .single();

    if (error) return { ok: false, error: error.message };
    return { ok: true, data: mapDbCategory(data) };
  }

  const { data, error } = await supabase
    .from("categories")
    .insert(payload)
    .select()
    .single();

  if (error) return { ok: false, error: error.message };
  return { ok: true, data: mapDbCategory(data) };
}

export async function deleteCategory(
  categoryId: string
): Promise<AdminActionResult<{ productCount: number }>> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured" };
  }

  const supabase = createBrowserSupabaseClient();
  if (!supabase) {
    return { ok: false, error: "Supabase client unavailable" };
  }

  const productCount = await countProductsForCategory(categoryId);

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", categoryId);

  if (error) return { ok: false, error: error.message };
  return { ok: true, data: { productCount } };
}
