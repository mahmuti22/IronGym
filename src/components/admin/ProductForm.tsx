"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAdmin } from "./AdminProvider";
import { getProductById } from "@/lib/admin/products";
import type { AdminProduct, ProductStatus, StockStatus } from "@/lib/admin/types";
import {
  AdminCard,
  adminBtnPrimaryClass,
  adminBtnSecondaryClass,
  adminCaptionClass,
  adminInputClass,
  adminLabelClass,
  adminMutedTextClass,
  adminSectionTitleClass,
} from "./admin-ui";
import { CATALOG_STUDIO_MODEL_01 } from "@/data/catalog";
import {
  MAIN_CATEGORY,
  DEFAULT_SIZES,
  DEFAULT_COLORS,
  shopFilterLabels,
  productImageFocusClasses,
  getProductPath,
  type ProductTag,
  type ShopFilterGroup,
  type ShopGender,
} from "@/data/shop";

const ALL_TAGS: ProductTag[] = ["New", "Best Seller", "Sale"];

const STOCK_OPTIONS: { value: StockStatus; label: string }[] = [
  { value: "in_stock", label: "Disponibile" },
  { value: "low_stock", label: "Scorte basse" },
  { value: "out_of_stock", label: "Esaurito" },
];

type FormState = {
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  price: string;
  salePrice: string;
  filterGroup: ShopFilterGroup;
  subcategoryId: string;
  gender: ShopGender;
  material: string;
  fit: string;
  careInstructions: string;
  sizesText: string;
  colorsText: string;
  tags: ProductTag[];
  status: ProductStatus;
  stockStatus: StockStatus;
  sortOrder: string;
  mainImageUrl: string;
  imageFocusIndex: number;
};

const emptyForm = (): FormState => ({
  slug: "",
  name: "",
  description: "",
  longDescription: "",
  price: "",
  salePrice: "",
  filterGroup: "uomo",
  subcategoryId: "",
  gender: "uomo",
  material: "",
  fit: "Regular fit",
  careInstructions: "Lavaggio a 30°C. Non candeggiare.",
  sizesText: DEFAULT_SIZES.join(", "),
  colorsText: DEFAULT_COLORS.join(", "),
  tags: [],
  status: "draft",
  stockStatus: "in_stock",
  sortOrder: "0",
  mainImageUrl: "",
  imageFocusIndex: 0,
});

function adminProductToFormValues(product: AdminProduct): FormState {
  return {
    slug: product.slug,
    name: product.name,
    description: product.description,
    longDescription: product.longDescription,
    price: String(product.price),
    salePrice:
      product.salePrice != null && product.salePrice > 0
        ? String(product.salePrice)
        : "",
    filterGroup: product.filterGroup,
    subcategoryId: product.subcategoryId ?? "",
    gender: product.gender,
    material: product.material,
    fit: product.fit,
    careInstructions: product.careInstructions,
    sizesText: product.sizes.join(", "),
    colorsText: product.colors.join(", "),
    tags: product.tags,
    status: product.status,
    stockStatus: (product.stockStatus as StockStatus) || "in_stock",
    sortOrder: String(product.sortOrder ?? 0),
    mainImageUrl: product.image,
    imageFocusIndex: product.imageFocusIndex,
  };
}

type SubcategoryOption = { id: string; title: string };

export type ProductFormMode = "create" | "edit";

type ProductFormProps = {
  mode?: ProductFormMode;
  productId?: string;
};

export function ProductForm({ mode = "create", productId }: ProductFormProps) {
  const router = useRouter();
  const {
    addProduct,
    updateProduct,
    subcategories,
    categories,
    products,
    dataSource,
    loading: adminLoading,
  } = useAdmin();

  const [form, setForm] = useState<FormState>(emptyForm);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [formReady, setFormReady] = useState(mode === "create");
  const [notFound, setNotFound] = useState(false);

  const isEdit = mode === "edit" && Boolean(productId);

  const subsForGroup = useMemo((): SubcategoryOption[] => {
    return subcategories
      .filter((s) => s.filterGroup === form.filterGroup)
      .map((s) => ({ id: s.id, title: s.title }));
  }, [subcategories, form.filterGroup]);

  const hasSubcategories = subsForGroup.length > 0;

  const previewSrc =
    previewImage ?? (form.mainImageUrl.trim() || CATALOG_STUDIO_MODEL_01);

  const shopPublicId =
    dataSource === "supabase" ? form.slug.trim() : productId ?? form.slug;

  useEffect(() => {
    if (!isEdit || !productId) return;
    if (adminLoading) return;

    let cancelled = false;

    async function loadProduct() {
      const fromList = products.find((p) => p.id === productId);
      const product =
        fromList ??
        (await getProductById(productId!, categories)).data;

      if (cancelled) return;

      if (!product) {
        setNotFound(true);
        setFormReady(false);
        return;
      }

      setForm(adminProductToFormValues(product));
      setPreviewImage(null);
      setNotFound(false);
      setFormReady(true);
    }

    void loadProduct();

    return () => {
      cancelled = true;
    };
  }, [isEdit, productId, adminLoading, products, categories]);

  useEffect(() => {
    if (!formReady) return;

    if (!hasSubcategories) {
      if (form.subcategoryId !== "") {
        setForm((f) => ({ ...f, subcategoryId: "" }));
      }
      return;
    }

    const stillValid = subsForGroup.some((s) => s.id === form.subcategoryId);
    if (!stillValid && isEdit) {
      return;
    }
    if (!stillValid) {
      setForm((f) => ({ ...f, subcategoryId: subsForGroup[0].id }));
    }
  }, [
    form.filterGroup,
    form.subcategoryId,
    subsForGroup,
    hasSubcategories,
    formReady,
    isEdit,
  ]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
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
    setPreviewImage(URL.createObjectURL(file));
  }

  function buildPayload(slug: string, image: string) {
    const sale =
      form.salePrice.trim() === "" ? null : Number(form.salePrice) || null;

    return {
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
      salePrice: sale,
      image,
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
      stockStatus: form.stockStatus,
      sortOrder: Number(form.sortOrder) || 0,
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isEdit && !productId) return;

    setSaving(true);
    setFeedback(null);

    const slug =
      form.slug.trim() ||
      form.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const image =
      previewImage ??
      (form.mainImageUrl.trim() || CATALOG_STUDIO_MODEL_01);

    const payload = buildPayload(slug, image);

    let ok = false;

    if (isEdit) {
      ok = await updateProduct(productId!, payload);
      if (ok) {
        setFeedback(
          dataSource === "supabase"
            ? "Prodotto aggiornato nel database"
            : "Prodotto aggiornato (mock locale)"
        );
      } else {
        setFeedback("Errore durante l'aggiornamento del prodotto");
      }
    } else {
      const legacyId = slug.startsWith("ig-") ? slug : `ig-${slug}`;
      ok = await addProduct({
        ...payload,
        id: dataSource === "mock" ? legacyId : undefined,
      });
      if (ok) {
        setFeedback(
          dataSource === "supabase"
            ? "Prodotto creato nel database"
            : "Prodotto creato (mock locale)"
        );
      } else {
        setFeedback("Errore durante il salvataggio del prodotto");
      }
    }

    setSaving(false);

    if (ok) {
      setTimeout(() => router.push("/admin/products"), 800);
    }
  }

  if (isEdit && (adminLoading || !formReady) && !notFound) {
    return (
      <p className={`py-12 text-center ${adminMutedTextClass}`}>
        Caricamento prodotto…
      </p>
    );
  }

  if (isEdit && notFound) {
    return (
      <div className="mx-auto max-w-lg space-y-4 text-center">
        <p className="text-lg font-semibold text-white">Prodotto non trovato</p>
        <p className={adminMutedTextClass}>
          L&apos;ID <code className="text-zinc-400">{productId}</code> non esiste
          o non è accessibile.
        </p>
        <Link href="/admin/products" className={adminBtnSecondaryClass}>
          Torna ai prodotti
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-4xl space-y-8">
      {feedback && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            feedback.includes("Errore")
              ? "border-red-500/30 bg-red-500/10 text-red-300"
              : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
          }`}
        >
          {feedback}
          {!feedback.includes("Errore") && " — reindirizzamento…"}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
        <div className="space-y-6">
          <AdminCard className="p-6">
            <h2 className={`mb-6 ${adminSectionTitleClass}`}>
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
              <div>
                <label className={adminLabelClass}>Prezzo scontato (CHF)</label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={form.salePrice}
                  onChange={(e) => update("salePrice", e.target.value)}
                  className={adminInputClass}
                  placeholder="Opzionale"
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
            <h2 className={`mb-6 ${adminSectionTitleClass}`}>
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
                    <option value="">Nessuna sottocategoria disponibile</option>
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
                  <option value="archived">Archiviato</option>
                </select>
              </div>
              <div>
                <label className={adminLabelClass}>Disponibilità</label>
                <select
                  value={form.stockStatus}
                  onChange={(e) =>
                    update("stockStatus", e.target.value as StockStatus)
                  }
                  className={adminInputClass}
                >
                  {STOCK_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={adminLabelClass}>Ordine</label>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => update("sortOrder", e.target.value)}
                  className={adminInputClass}
                />
              </div>
            </div>
          </AdminCard>

          <AdminCard className="p-6">
            <h2 className={`mb-6 ${adminSectionTitleClass}`}>
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
                <label className={adminLabelClass}>
                  Taglie (separate da virgola)
                </label>
                <input
                  value={form.sizesText}
                  onChange={(e) => update("sizesText", e.target.value)}
                  className={adminInputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={adminLabelClass}>
                  Colori (separate da virgola)
                </label>
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
            <h2 className={`mb-4 ${adminSectionTitleClass}`}>Tag</h2>
            <div className="flex flex-wrap gap-2">
              {ALL_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                    form.tags.includes(tag)
                      ? "border-white/30 bg-white text-iron-950 shadow-sm"
                      : "border-white/15 bg-white/[0.06] text-zinc-300 hover:border-white/25 hover:bg-white/[0.1] hover:text-white"
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
            <h2 className={`mb-4 ${adminSectionTitleClass}`}>Immagine</h2>
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-white/10 bg-black/40">
              <Image
                src={previewSrc}
                alt="Anteprima"
                fill
                className={`object-cover ${productImageFocusClasses[form.imageFocusIndex]}`}
                unoptimized={previewSrc.startsWith("blob:")}
              />
            </div>
            <div className="mt-4">
              <label className={adminLabelClass}>URL immagine principale</label>
              <input
                value={form.mainImageUrl}
                onChange={(e) => {
                  update("mainImageUrl", e.target.value);
                  setPreviewImage(null);
                }}
                className={adminInputClass}
                placeholder="https://…"
              />
            </div>
            <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/20 bg-white/[0.06] px-4 py-8 text-center transition hover:border-white/30 hover:bg-white/[0.08]">
              <span className="text-xs font-semibold uppercase tracking-widest text-zinc-300">
                Carica immagine (anteprima locale)
              </span>
              <span className={`mt-1 ${adminCaptionClass}`}>
                PNG, JPG — anteprima; salva anche l&apos;URL sopra
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
              className={`${adminBtnPrimaryClass} min-h-12 w-full disabled:opacity-60`}
            >
              {saving
                ? "Salvataggio…"
                : isEdit
                  ? "Salva modifiche"
                  : "Salva prodotto"}
            </button>
            {isEdit && form.status === "published" && shopPublicId && (
              <Link
                href={getProductPath(shopPublicId)}
                target="_blank"
                className={`${adminBtnSecondaryClass} min-h-11 w-full`}
              >
                Vedi nello shop
              </Link>
            )}
            <Link
              href="/admin/products"
              className={`${adminBtnSecondaryClass} min-h-11 w-full`}
            >
              Annulla
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
}
