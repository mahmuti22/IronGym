import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { getSupabaseEnv, isSupabaseConfigured } from "@/lib/supabase/config";
import { slugify } from "@/lib/admin/mappers";

export const PRODUCT_IMAGES_BUCKET = "product-images";

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export type UploadProductImageResult = {
  ok: boolean;
  path?: string;
  url?: string;
  error?: string;
};

function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 10);
}

function extensionForMime(mime: string): string {
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return "jpg";
}

export function validateProductImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    return "Formato non supportato. Usa JPEG, PNG o WebP.";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return "Immagine troppo grande (max 5 MB).";
  }
  return null;
}

export function safeProductSlug(slug: string): string {
  const s = slugify(slug || "product") || "product";
  return s.slice(0, 80);
}

/** Public URL for a path inside the product-images bucket. */
export function getPublicImageUrl(path: string): string {
  const clean = path.replace(/^\/+/, "");
  const { url } = getSupabaseEnv();
  if (!url) return clean;
  return `${url.replace(/\/$/, "")}/storage/v1/object/public/${PRODUCT_IMAGES_BUCKET}/${clean}`;
}

/** Extract storage object path from a Supabase public URL, if applicable. */
export function extractStoragePathFromUrl(imageUrl: string): string | null {
  if (!imageUrl) return null;
  const marker = `/storage/v1/object/public/${PRODUCT_IMAGES_BUCKET}/`;
  const idx = imageUrl.indexOf(marker);
  if (idx === -1) return null;
  return imageUrl.slice(idx + marker.length).split("?")[0] ?? null;
}

export async function uploadProductImage(
  file: File,
  productSlug: string
): Promise<UploadProductImageResult> {
  const validation = validateProductImageFile(file);
  if (validation) return { ok: false, error: validation };

  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase non configurato" };
  }

  const supabase = createBrowserSupabaseClient();
  if (!supabase) {
    return { ok: false, error: "Client Supabase non disponibile" };
  }

  const folder = safeProductSlug(productSlug);
  const ext = extensionForMime(file.type);
  const path = `${folder}/${Date.now()}-${randomSuffix()}.${ext}`;

  const { error } = await supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true, path, url: getPublicImageUrl(path) };
}

export async function deleteProductImage(
  path: string
): Promise<{ ok: boolean; error?: string }> {
  if (!path?.trim()) return { ok: true };

  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase non configurato" };
  }

  const supabase = createBrowserSupabaseClient();
  if (!supabase) {
    return { ok: false, error: "Client Supabase non disponibile" };
  }

  const clean = path.replace(/^\/+/, "");
  const { error } = await supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .remove([clean]);

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
