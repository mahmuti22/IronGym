"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAdmin } from "./AdminProvider";
import type { ProductStatus } from "@/lib/admin/types";
import { AdminCard, adminInputClass, adminLabelClass } from "./admin-ui";
import { CATALOG_STUDIO_MODEL_01 } from "@/data/catalog";
import {
  MAIN_CATEGORY,
  DEFAULT_SIZES,
  DEFAULT_COLORS,
  shopFilterLabels,
  productImageFocusClasses,
  type ProductTag,
  type ShopFilterGroup,
  type ShopGender,
} from "@/data/shop";

const ALL_TAGS: ProductTag[] = ["New", "Best Seller", "Sale"];

const emptyForm = {
  slug: "",
  name: "",
  description: "",
  longDescription: "",
  price: "",
  filterGroup: "uomo" as ShopFilterGroup,
  subcategoryId: "",
  gender: "uomo" as ShopGender,
  material: "",
  fit: "Regular fit",
  careInstructions: "Lavaggio a 30°C. Non candeggiare.",
  sizesText: DEFAULT_SIZES.join(", "),
  colorsText: DEFAULT_COLORS.join(", "),
  tags: [] as ProductTag[],
  status: "draft" as ProductStatus,
  imageFocusIndex: 0,
};

type SubcategoryOption = { id: string; title: string };

export function ProductForm() {
  const router = useRouter();
  const { addProduct, subcategories, dataSource } = useAdmin();
  const [form, setForm] = useState(emptyForm);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const subsForGroup = useMemo((): SubcategoryOption[] => {
    return subcategories
      .filter((s) => s.filterGroup === form.filterGroup)
      .map((s) => ({ id: s.id, title: s.title }));
  }, [subcategories, form.filterGroup]);

  const hasSubcategories = subsForGroup.length > 0;

  useEffect(() => {
    if (!hasSubcategories) {
      if (form.subcategoryId !== "") {
        setForm((f) => ({ ...f, subcategoryId: "" }));
      }
      return;
    }
    const stillValid = subsForGroup.some((s) => s.id === form.subcategoryId);
    if (!stillValid) {
      setForm((f) => ({ ...f, subcategoryId: subsForGroup[0].id }));
    }
  }, [form.filterGroup, form.subcategoryId, subsForGroup, hasSubcategories]);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setFeedback(null);
  }

  function toggleTag(tag: ProductTag) {
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(tag)
        ? f.tags.filter((t) => t !== tag)
        : [...f.tags, tag],
    }));
  }

  function handleImagePlaceholder(file: File | null) {
    if (!file) {
      setPreviewImage(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewImage(url);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    const slug =
      form.slug.trim() ||
      form.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const legacyId = slug.startsWith("ig-") ? slug : `ig-${slug}`;

    const ok = await addProduct({
      id: dataSource === "mock" ? legacyId : undefined,
      slug,
      name: form.name.trim(),
      description: form.description.trim(),
      longDescription: form.longDescription.trim() || form.description.trim(),
      mainCategory: MAIN_CATEGORY,
      categoryId: null,
      subcategoryId: form.subcategoryId.trim() || null,
      filterGroup: form.filterGroup,
      gender: form.gender,
      price: Number(form.price) || 0,
      salePrice: null,
      image: previewImage ?? CATALOG_STUDIO_MODEL_01,
      imageFocusIndex: form.imageFocusIndex,
      tags: form.tags,
      sizes: form.sizesText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      colors: form.colorsText
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
      material: form.material.trim(),
      fit: form.fit.trim(),
      careInstructions: form.careInstructions.trim(),
      status: form.status,
      stockStatus: "in_stock",
    });

    setSaving(false);

    if (ok) {
      setFeedback(
        dataSource === "supabase"
          ? "Saved to database"
          : "Using local mock data because Supabase is not configured"
      );
      setTimeout(() => router.push("/admin/products"), 800);
    } else {
      setFeedback("Error while saving product");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-4xl space-y-8">
      {feedback && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            feedback.includes("Error")
              ? "border-red-500/30 bg-red-500/10 text-red-300"
              : feedback.includes("database")
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                : "border-amber-500/30 bg-amber-500/10 text-amber-200"
          }`}
        >
          {feedback}
          {!feedback.includes("Error") && " — reindirizzamento…"}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
        <div className="space-y-6">
          <AdminCard className="p-6">
            <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-silver-500">
              Informazioni base
            </h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={adminLabelClass}>Nome prodotto *</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className={adminInputClass}
                  placeholder="IronGym Oversize T-Shirt"
                />
              </div>
              <div>
                <label className={adminLabelClass}>Slug URL *</label>
                <input
                  value={form.slug}
                  onChange={(e) => update("slug", e.target.value)}
                  className={adminInputClass}
                  placeholder="oversize-tee"
                />
              </div>
              <div>
                <label className={adminLabelClass}>Prezzo (CHF) *</label>
                <input
                  required
                  type="number"
                  min={0}
                  step={1}
                  value={form.price}
                  onChange={(e) => update("price", e.target.value)}
                  className={adminInputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={adminLabelClass}>Descrizione breve *</label>
                <textarea
                  required
                  rows={2}
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  className={adminInputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={adminLabelClass}>Descrizione lunga</label>
                <textarea
                  rows={4}
                  value={form.longDescription}
                  onChange={(e) => update("longDescription", e.target.value)}
                  className={adminInputClass}
                />
              </div>
            </div>
          </AdminCard>

          <AdminCard className="p-6">
            <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-silver-500">
              Catalogazione
            </h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={adminLabelClass}>Linea *</label>
                <select
                  value={form.filterGroup}
                  onChange={(e) => {
                    const g = e.target.value as ShopFilterGroup;
                    update("filterGroup", g);
                    const subs = subcategories.filter(
                      (s) => s.filterGroup === g
                    );
                    update("subcategoryId", subs[0]?.id ?? "");
                  }}
                  className={adminInputClass}
                >
                  {Object.entries(shopFilterLabels).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={adminLabelClass}>
                  Sottocategoria{hasSubcategories ? "" : " (opzionale)"}
                </label>
                <select
                  value={form.subcategoryId}
                  onChange={(e) => update("subcategoryId", e.target.value)}
                  className={adminInputClass}
                  disabled={!hasSubcategories}
                >
                  {!hasSubcategories ? (
                    <option value="">
                      Nessuna sottocategoria disponibile
                    </option>
                  ) : (
                    <>
                      <option value="">Sottocategoria opzionale</option>
                      {subsForGroup.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.title}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>
              <div>
                <label className={adminLabelClass}>Genere *</label>
                <select
                  value={form.gender}
                  onChange={(e) =>
                    update("gender", e.target.value as ShopGender)
                  }
                  className={adminInputClass}
                >
                  <option value="uomo">Uomo</option>
                  <option value="donna">Donna</option>
                  <option value="unisex">Unisex</option>
                </select>
              </div>
              <div>
                <label className={adminLabelClass}>Stato</label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    update("status", e.target.value as ProductStatus)
                  }
                  className={adminInputClass}
                >
                  <option value="draft">Bozza</option>
                  <option value="published">Pubblicato</option>
                </select>
              </div>
            </div>
          </AdminCard>

          <AdminCard className="p-6">
            <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-silver-500">
              Dettagli prodotto
            </h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={adminLabelClass}>Materiale</label>
                <input
                  value={form.material}
                  onChange={(e) => update("material", e.target.value)}
                  className={adminInputClass}
                />
              </div>
              <div>
                <label className={adminLabelClass}>Fit</label>
                <input
                  value={form.fit}
                  onChange={(e) => update("fit", e.target.value)}
                  className={adminInputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={adminLabelClass}>Taglie (separate da virgola)</label>
                <input
                  value={form.sizesText}
                  onChange={(e) => update("sizesText", e.target.value)}
                  className={adminInputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={adminLabelClass}>Colori (separate da virgola)</label>
                <input
                  value={form.colorsText}
                  onChange={(e) => update("colorsText", e.target.value)}
                  className={adminInputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={adminLabelClass}>Cura del capo</label>
                <textarea
                  rows={2}
                  value={form.careInstructions}
                  onChange={(e) =>
                    update("careInstructions", e.target.value)
                  }
                  className={adminInputClass}
                />
              </div>
            </div>
          </AdminCard>

          <AdminCard className="p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-silver-500">
              Tag
            </h2>
            <div className="flex flex-wrap gap-2">
              {ALL_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                    form.tags.includes(tag)
                      ? "border-silver-300/70 bg-white text-iron-950"
                      : "border-silver-500/35 text-silver-500 hover:border-silver-400/50"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </AdminCard>
        </div>

        <div className="space-y-6">
          <AdminCard className="p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-silver-500">
              Immagine
            </h2>
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-iron-950">
              <Image
                src={previewImage ?? CATALOG_STUDIO_MODEL_01}
                alt="Anteprima"
                fill
                className={`object-cover ${productImageFocusClasses[form.imageFocusIndex]}`}
              />
            </div>
            <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-silver-500/40 bg-white/[0.02] px-4 py-8 text-center transition hover:border-silver-400/50 hover:bg-white/[0.04]">
              <span className="text-xs font-semibold uppercase tracking-widest text-silver-500">
                Carica immagine (anteprima locale)
              </span>
              <span className="mt-1 text-[10px] text-silver-600">
                PNG, JPG — non salvata su server
              </span>
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) =>
                  handleImagePlaceholder(e.target.files?.[0] ?? null)
                }
              />
            </label>
            <div className="mt-4">
              <label className={adminLabelClass}>Focus immagine (0–3)</label>
              <input
                type="number"
                min={0}
                max={3}
                value={form.imageFocusIndex}
                onChange={(e) =>
                  update("imageFocusIndex", Number(e.target.value))
                }
                className={adminInputClass}
              />
            </div>
          </AdminCard>

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={saving}
              className="min-h-12 rounded-full bg-white text-sm font-semibold text-iron-950 transition hover:bg-silver-300 disabled:opacity-60"
            >
              {saving ? "Salvataggio…" : "Salva prodotto"}
            </button>
            <Link
              href="/admin/products"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-silver-500/35 text-sm font-semibold text-silver-400 transition hover:text-silver-200"
            >
              Annulla
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
}
