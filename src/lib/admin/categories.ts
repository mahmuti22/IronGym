import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { AdminActionResult, AdminCategory } from "@/lib/admin/types";
import { mapDbCategory } from "./mappers";
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

export async function upsertCategory(
  category: Partial<AdminCategory> & { slug: string; name: string }
): Promise<AdminActionResult<AdminCategory>> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured" };
  }

  const supabase = createBrowserSupabaseClient();
  if (!supabase) {
    return { ok: false, error: "Supabase client unavailable" };
  }

  const payload: import("@/types/database").Database["public"]["Tables"]["categories"]["Insert"] =
    {
      slug: category.slug,
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
