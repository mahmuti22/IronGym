import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type {
  AdminActionResult,
  AdminCategory,
  AdminProduct,
  AdminProductInput,
} from "@/lib/admin/types";
import { deleteProductImage } from "./media";
import { mapDbProduct, slugify } from "./mappers";
import { getMockProducts } from "./mock-data";
import type { ProductGalleryImageInput } from "@/lib/admin/types";
import type { Database } from "@/types/database";
import type { DbProductImage } from "@/types/database";

type ProductUpdate = Database["public"]["Tables"]["products"]["Update"];
type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];

function resolveSubcategoryUuid(
  subcategoryId: string | null | undefined,
  categories: AdminCategory[]
): string | null {
  if (subcategoryId == null || subcategoryId.trim() === "") {
    return null;
  }

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

export async function fetchProductImages(
  productId: string
): Promise<DbProductImage[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = createBrowserSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", productId)
    .order("sort_order", { ascending: true });

  if (error) return [];
  return data ?? [];
}

export async function syncProductImages(
  productId: string,
  mainImageUrl: string | null,
  gallery: ProductGalleryImageInput[],
  options?: {
    removedImageIds?: string[];
    removedStoragePaths?: string[];
  }
): Promise<AdminActionResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured" };
  }

  const supabase = createBrowserSupabaseClient();
  if (!supabase) return { ok: false, error: "Supabase client unavailable" };

  const removedIds = options?.removedImageIds ?? [];
  const removedPaths = options?.removedStoragePaths ?? [];

  if (removedIds.length > 0) {
    const { error } = await supabase
      .from("product_images")
      .delete()
      .in("id", removedIds);
    if (error) return { ok: false, error: error.message };
  }

  for (const path of removedPaths) {
    await deleteProductImage(path);
  }

  const main = mainImageUrl?.trim() || null;
  const extras = gallery.filter((img) => img.url.trim() && img.url !== main);

  const { error: deleteExtrasError } = await supabase
    .from("product_images")
    .delete()
    .eq("product_id", productId);

  if (deleteExtrasError) {
    return { ok: false, error: deleteExtrasError.message };
  }

  if (extras.length > 0) {
    const { error: insertError } = await supabase.from("product_images").insert(
      extras.map((img, index) => ({
        product_id: productId,
        url: img.url,
        alt: img.alt ?? null,
        sort_order: img.sortOrder ?? index,
      }))
    );
    if (insertError) return { ok: false, error: insertError.message };
  }

  return { ok: true };
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

export async function getProductById(
  id: string,
  categories: AdminCategory[]
): Promise<{
  data: AdminProduct | null;
  source: "supabase" | "mock";
  error?: string;
}> {
  if (!isSupabaseConfigured()) {
    const product = getMockProducts().find((p) => p.id === id) ?? null;
    return { data: product, source: "mock" };
  }

  const supabase = createBrowserSupabaseClient();
  if (!supabase) {
    const product = getMockProducts().find((p) => p.id === id) ?? null;
    return { data: product, source: "mock" };
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return { data: null, source: "supabase", error: error.message };
  }

  if (!data) {
    return { data: null, source: "supabase" };
  }

  const images = await fetchProductImages(data.id);
  const product = mapDbProduct(data, categories, images);

  return {
    data: product,
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
    input.subcategoryId,
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
    sort_order: input.sortOrder ?? 0,
  };

  const { data, error } = await supabase
    .from("products")
    .insert(insertPayload)
    .select()
    .single();

  if (error) return { ok: false, error: error.message };

  const mainUrl = input.image?.trim() || null;
  if (input.galleryImages?.length || input.removedImageIds?.length) {
    const sync = await syncProductImages(
      data.id,
      mainUrl,
      input.galleryImages ?? [],
      {
        removedImageIds: input.removedImageIds,
        removedStoragePaths: input.removedStoragePaths,
      }
    );
    if (!sync.ok) return { ok: false, error: sync.error };
  }

  const images = await fetchProductImages(data.id);
  return { ok: true, data: mapDbProduct(data, categories, images) };
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
  if (input.sortOrder != null) payload.sort_order = input.sortOrder;

  if (input.subcategoryId !== undefined || input.filterGroup != null) {
    const subUuid = resolveSubcategoryUuid(input.subcategoryId, categories);
    const catUuid = resolveCategoryUuid(
      input.filterGroup ?? "uomo",
      subUuid,
      categories
    );
    payload.subcategory_id = subUuid;
    payload.category_id = catUuid;
  } else if (input.subcategoryId === null) {
    payload.subcategory_id = null;
    if (input.filterGroup != null) {
      payload.category_id = resolveCategoryUuid(input.filterGroup, null, categories);
    }
  }

  const { data, error } = await supabase
    .from("products")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) return { ok: false, error: error.message };

  const mainUrl =
    input.image !== undefined ? input.image?.trim() || null : undefined;

  if (
    input.galleryImages !== undefined ||
    input.removedImageIds?.length ||
    input.removedStoragePaths?.length
  ) {
    const currentMain =
      mainUrl !== undefined ? mainUrl : data.main_image_url ?? null;
    const sync = await syncProductImages(
      id,
      currentMain,
      input.galleryImages ?? [],
      {
        removedImageIds: input.removedImageIds,
        removedStoragePaths: input.removedStoragePaths,
      }
    );
    if (!sync.ok) return { ok: false, error: sync.error };
  }

  const images = await fetchProductImages(id);
  return { ok: true, data: mapDbProduct(data, categories, images) };
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
