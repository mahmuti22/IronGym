"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import {
  adminBtnDangerClass,
  adminBtnGhostClass,
  adminCaptionClass,
  adminLabelClass,
  adminMutedTextClass,
} from "./admin-ui";
import { CATALOG_STUDIO_MODEL_01 } from "@/data/catalog";
import { productImageFocusClasses } from "@/data/shop";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  validateProductImageFile,
} from "@/lib/admin/media";

export type ProductImageItem = {
  clientId: string;
  file?: File;
  previewUrl: string;
  publicUrl?: string;
  storagePath?: string | null;
  dbId?: string;
  sortOrder: number;
  isMain: boolean;
};

type ProductImageUploaderProps = {
  productSlug: string;
  productName: string;
  images: ProductImageItem[];
  onChange: (images: ProductImageItem[]) => void;
  onRemove?: (item: ProductImageItem) => void;
  disabled?: boolean;
  imageFocusIndex?: number;
};

function newClientId(): string {
  return `img-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function buildImagesFromProduct(
  mainImageUrl: string,
  extras: {
    id: string;
    url: string;
    alt: string | null;
    sortOrder: number;
    storagePath?: string | null;
  }[] = []
): ProductImageItem[] {
  const main =
    mainImageUrl.trim() && mainImageUrl !== CATALOG_STUDIO_MODEL_01
      ? mainImageUrl.trim()
      : "";

  const items: ProductImageItem[] = [];

  if (main) {
    items.push({
      clientId: newClientId(),
      previewUrl: main,
      publicUrl: main,
      storagePath: null,
      sortOrder: 0,
      isMain: true,
    });
  }

  for (const row of extras) {
    if (row.url === main) continue;
    items.push({
      clientId: newClientId(),
      previewUrl: row.url,
      publicUrl: row.url,
      storagePath: row.storagePath ?? null,
      dbId: row.id,
      sortOrder: row.sortOrder,
      isMain: false,
    });
  }

  if (items.length === 0) {
    items.push({
      clientId: newClientId(),
      previewUrl: CATALOG_STUDIO_MODEL_01,
      publicUrl: undefined,
      sortOrder: 0,
      isMain: true,
    });
  }

  return items;
}

export function ProductImageUploader({
  productSlug,
  productName,
  images,
  onChange,
  onRemove,
  disabled = false,
  imageFocusIndex = 0,
}: ProductImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mainImage = images.find((i) => i.isMain) ?? images[0];
  const previewSrc = mainImage?.previewUrl ?? CATALOG_STUDIO_MODEL_01;

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      setError(null);
      const list = Array.from(files);
      if (!list.length) return;

      const next = [...images];
      let added = 0;

      for (const file of list) {
        const validation = validateProductImageFile(file);
        if (validation) {
          setError(validation);
          continue;
        }
        if (file.size > MAX_IMAGE_BYTES) {
          setError("Immagine troppo grande (max 5 MB).");
          continue;
        }

        const previewUrl = URL.createObjectURL(file);
        next.push({
          clientId: newClientId(),
          file,
          previewUrl,
          sortOrder: next.length,
          isMain: next.length === 0,
        });
        added++;
      }

      if (added > 0) {
        onChange(
          next.map((img, index) => ({
            ...img,
            sortOrder: index,
            isMain: index === 0 && !next.some((i) => i.isMain) ? true : img.isMain,
          }))
        );
      }
    },
    [images, onChange]
  );

  function setMain(clientId: string) {
    onChange(
      images.map((img) => ({
        ...img,
        isMain: img.clientId === clientId,
      }))
    );
  }

  function removeImage(clientId: string) {
    const target = images.find((i) => i.clientId === clientId);
    if (target) onRemove?.(target);
    if (target?.file && target.previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(target.previewUrl);
    }

    const filtered = images.filter((i) => i.clientId !== clientId);
    const next =
      filtered.length > 0
        ? filtered.map((img, index) => ({
            ...img,
            sortOrder: index,
            isMain:
              img.isMain && filtered.some((f) => f.clientId === img.clientId)
                ? true
                : index === 0,
          }))
        : [
            {
              clientId: newClientId(),
              previewUrl: CATALOG_STUDIO_MODEL_01,
              sortOrder: 0,
              isMain: true,
            },
          ];

    if (filtered.length > 0 && !next.some((i) => i.isMain)) {
      next[0] = { ...next[0], isMain: true };
    }

    onChange(next);
    setError(null);
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-white/10 bg-black/40">
        <Image
          src={previewSrc}
          alt={productName || "Anteprima prodotto"}
          fill
          className={`object-cover ${productImageFocusClasses[imageFocusIndex]}`}
          unoptimized={previewSrc.startsWith("blob:")}
        />
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (!disabled && e.dataTransfer.files.length) {
            addFiles(e.dataTransfer.files);
          }
        }}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-4 py-8 text-center transition ${
          dragOver
            ? "border-white/40 bg-white/[0.1]"
            : "border-white/20 bg-white/[0.06] hover:border-white/30 hover:bg-white/[0.08]"
        } ${disabled ? "pointer-events-none opacity-50" : ""}`}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        role="button"
        tabIndex={0}
      >
        <span className="text-xs font-semibold uppercase tracking-widest text-zinc-300">
          Trascina immagini qui o clicca per caricare
        </span>
        <span className={`mt-1 ${adminCaptionClass}`}>
          JPEG, PNG, WebP — max 5 MB ciascuna
        </span>
        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_IMAGE_TYPES.join(",")}
          multiple
          className="sr-only"
          disabled={disabled}
          onChange={(e) => {
            if (e.target.files?.length) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {error && (
        <p className="text-sm text-red-300" role="alert">
          {error}
        </p>
      )}

      {!productSlug.trim() && (
        <p className={adminMutedTextClass}>
          Inserisci nome o slug prodotto prima del salvataggio per organizzare le
          cartelle su Storage.
        </p>
      )}

      {images.length > 0 && (
        <div className="space-y-3">
          <p className={adminLabelClass}>Galleria ({images.length})</p>
          <ul className="space-y-2">
            {images.map((img) => (
              <li
                key={img.clientId}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-2"
              >
                <div className="relative h-14 w-11 shrink-0 overflow-hidden rounded-lg bg-black/40">
                  <Image
                    src={img.previewUrl}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized={img.previewUrl.startsWith("blob:")}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs text-zinc-200">
                    {img.file?.name ??
                      img.publicUrl?.split("/").pop() ??
                      "Immagine"}
                  </p>
                  {img.isMain ? (
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                      Principale
                    </span>
                  ) : (
                    <span className={adminCaptionClass}>Extra</span>
                  )}
                </div>
                <div className="flex shrink-0 flex-col gap-1 sm:flex-row">
                  {!img.isMain && (
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => setMain(img.clientId)}
                      className={adminBtnGhostClass}
                    >
                      Principale
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => removeImage(img.clientId)}
                    className={adminBtnDangerClass}
                  >
                    Rimuovi
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className={adminCaptionClass}>
        Le immagini vengono caricate su Supabase Storage al salvataggio del
        prodotto ({productSlug.trim() || "slug-pending"}).
      </p>
    </div>
  );
}
