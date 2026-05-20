import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { AdminActionResult, AdminCollection } from "@/lib/admin/types";
import { mapDbCollection } from "./mappers";
import { getMockCollections } from "./mock-data";

export async function fetchCollections(): Promise<{
  data: AdminCollection[];
  source: "supabase" | "mock";
  error?: string;
}> {
  if (!isSupabaseConfigured()) {
    return { data: getMockCollections(), source: "mock" };
  }

  const supabase = createBrowserSupabaseClient();
  if (!supabase) {
    return { data: getMockCollections(), source: "mock" };
  }

  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    return {
      data: getMockCollections(),
      source: "mock",
      error: error.message,
    };
  }

  return {
    data: (data ?? []).map(mapDbCollection),
    source: "supabase",
  };
}

export async function upsertCollection(
  collection: Partial<AdminCollection> & { slug: string; name: string }
): Promise<AdminActionResult<AdminCollection>> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured" };
  }

  const supabase = createBrowserSupabaseClient();
  if (!supabase) {
    return { ok: false, error: "Supabase client unavailable" };
  }

  const payload: import("@/types/database").Database["public"]["Tables"]["collections"]["Insert"] =
    {
      slug: collection.slug,
      name: collection.name,
      description: collection.description ?? null,
      hero_image_url: collection.heroImageUrl ?? null,
      status: collection.status ?? "visible",
      tags: collection.tags ?? [],
      sort_order: collection.sortOrder ?? 0,
    };

  if (collection.id && !collection.legacyId) {
    const { data, error } = await supabase
      .from("collections")
      .update(payload)
      .eq("id", collection.id)
      .select()
      .single();

    if (error) return { ok: false, error: error.message };
    return { ok: true, data: mapDbCollection(data) };
  }

  const { data, error } = await supabase
    .from("collections")
    .insert(payload)
    .select()
    .single();

  if (error) return { ok: false, error: error.message };
  return { ok: true, data: mapDbCollection(data) };
}
