import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type {
  AdminActionResult,
  AdminCategory,
  AdminProduct,
  AdminProductInput,
} from "@/lib/admin/types";
import { mapDbProduct, slugify } from "./mappers";
import { getMockProducts } from "./mock-data";
import type { Database } from "@/types/database";

type ProductUpdate = Database["public"]["Tables"]["products"]["Update"];
type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];

function resolveSubcategoryUuid(
  subcategoryId: string,
  categories: AdminCategory[]
): string | null {
  const byId = categories.find((c) => c.id === subcategoryId);
  if (byId) return byId.id;

  const byLegacy = categories.find(
    (c) => c.legacyId === subcategoryId || c.slug === subcategoryId
  );
  if (byLegacy) return byLegacy.id;

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(subcategoryId)) return subcategoryId;

  return null;
}

function resolveCategoryUuid(
  filterGroup: string,
  subcategoryUuid: string | null,
  categories: AdminCategory[]
): string | null {
  if (subcategoryUuid) {
    const sub = categories.find((c) => c.id === subcategoryUuid);
    if (sub?.parentId) return sub.parentId;
  }
  const top = categories.find(
    (c) => c.groupSlug === filterGroup && !c.parentId
  );
  return top?.id ?? null;
}

export async function fetchProducts(
  categories: AdminCategory[]
): Promise<{
  data: AdminProduct[];
  source: "supabase" | "mock";
  error?: string;
}> {
  if (!isSupabaseConfigured()) {
    return { data: getMockProducts(), source: "mock" };
  }

  const supabase = createBrowserSupabaseClient();
  if (!supabase) {
    return { data: getMockProducts(), source: "mock" };
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    return {
      data: getMockProducts(),
      source: "mock",
      error: error.message,
    };
  }

  return {
    data: (data ?? []).map((row) => mapDbProduct(row, categories)),
    source: "supabase",
  };
}

export async function createProduct(
  input: AdminProductInput,
  categories: AdminCategory[]
): Promise<AdminActionResult<AdminProduct>> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured" };
  }

  const supabase = createBrowserSupabaseClient();
  if (!supabase) {
    return { ok: false, error: "Supabase client unavailable" };
  }

  const slug =
    input.slug?.trim() ||
    slugify(input.name) ||
    `product-${Date.now()}`;

  const subcategoryUuid = resolveSubcategoryUuid(
    input.subcategoryId ?? "",
    categories
  );
  const categoryUuid = resolveCategoryUuid(
    input.filterGroup,
    subcategoryUuid,
    categories
  );

  const insertPayload: ProductInsert = {
    slug,
    name: input.name,
    price: input.price,
    sale_price: input.salePrice ?? null,
    category_id: categoryUuid,
    subcategory_id: subcategoryUuid,
    gender: input.gender,
    short_description: input.description,
    long_description: input.longDescription,
    material: input.material || null,
    fit: input.fit || null,
    care_instructions: input.careInstructions || null,
    sizes: input.sizes,
    colors: input.colors,
    tags: input.tags,
    status: input.status,
    stock_status: input.stockStatus ?? "in_stock",
    main_image_url: input.image || null,
    sort_order: 0,
  };

  const { data, error } = await supabase
    .from("products")
    .insert(insertPayload)
    .select()
    .single();

  if (error) return { ok: false, error: error.message };

  if (input.image) {
    await supabase.from("product_images").insert({
      product_id: data.id,
      url: input.image,
      alt: input.name,
      sort_order: 0,
    });
  }

  return { ok: true, data: mapDbProduct(data, categories) };
}

export async function updateProduct(
  id: string,
  input: Partial<AdminProductInput>,
  categories: AdminCategory[]
): Promise<AdminActionResult<AdminProduct>> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured" };
  }

  const supabase = createBrowserSupabaseClient();
  if (!supabase) return { ok: false, error: "Supabase client unavailable" };

  const payload: ProductUpdate = {};

  if (input.name != null) payload.name = input.name;
  if (input.slug != null) payload.slug = input.slug;
  if (input.price != null) payload.price = input.price;
  if (input.salePrice !== undefined) payload.sale_price = input.salePrice;
  if (input.gender != null) payload.gender = input.gender;
  if (input.description != null) payload.short_description = input.description;
  if (input.longDescription != null)
    payload.long_description = input.longDescription;
  if (input.material != null) payload.material = input.material;
  if (input.fit != null) payload.fit = input.fit;
  if (input.careInstructions != null)
    payload.care_instructions = input.careInstructions;
  if (input.sizes != null) payload.sizes = input.sizes;
  if (input.colors != null) payload.colors = input.colors;
  if (input.tags != null) payload.tags = input.tags;
  if (input.status != null) payload.status = input.status;
  if (input.stockStatus != null) payload.stock_status = input.stockStatus;
  if (input.image != null) payload.main_image_url = input.image;

  if (input.subcategoryId != null || input.filterGroup != null) {
    const subUuid = input.subcategoryId
      ? resolveSubcategoryUuid(input.subcategoryId, categories)
      : null;
    const catUuid = resolveCategoryUuid(
      input.filterGroup ?? "uomo",
      subUuid,
      categories
    );
    payload.subcategory_id = subUuid;
    payload.category_id = catUuid;
  }

  const { data, error } = await supabase
    .from("products")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) return { ok: false, error: error.message };
  return { ok: true, data: mapDbProduct(data, categories) };
}

export async function deleteProduct(id: string): Promise<AdminActionResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured" };
  }

  const supabase = createBrowserSupabaseClient();
  if (!supabase) return { ok: false, error: "Supabase client unavailable" };

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function setProductStatus(
  id: string,
  status: "published" | "draft",
  categories: AdminCategory[]
): Promise<AdminActionResult<AdminProduct>> {
  return updateProduct(id, { status }, categories);
}
