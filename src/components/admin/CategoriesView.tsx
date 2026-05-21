"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useAdmin } from "./AdminProvider";
import {
  AdminCard,
  adminBtnDangerClass,
  adminBtnGhostClass,
  adminBtnPrimaryClass,
  adminBtnSecondaryClass,
  adminCaptionClass,
  adminCardInnerClass,
  adminInputClass,
  adminLabelClass,
  adminMutedTextClass,
  adminSectionTitleClass,
} from "./admin-ui";
import { countProductsForCategory } from "@/lib/admin/categories";
import { slugify } from "@/lib/admin/mappers";
import { categoryPathSlug } from "@/lib/shop/category-utils";
import { getGroupPath, shopFilterLabels } from "@/data/shop";
import type { AdminCategory } from "@/lib/admin/types";
import type { ShopFilterGroup } from "@/data/shop";

const GROUP_ORDER: ShopFilterGroup[] = [
  "uomo",
  "donna",
  "accessori",
  "collezioni",
];

type FormState = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  parentId: string | null;
  groupSlug: ShopFilterGroup;
  status: string;
  sortOrder: number;
};

const emptyForm = (group: ShopFilterGroup, parentId: string | null): FormState => ({
  name: "",
  slug: "",
  description: "",
  imageUrl: "",
  parentId,
  groupSlug: group,
  status: "visible",
  sortOrder: 0,
});

export function CategoriesView() {
  const {
    categories,
    dataSource,
    loading,
    saveCategory,
    deleteCategoryById,
  } = useAdmin();

  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    uomo: true,
    donna: true,
    accessori: true,
    collezioni: true,
  });
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);

  const topByGroup = useMemo(() => {
    const map = new Map<ShopFilterGroup, AdminCategory>();
    for (const g of GROUP_ORDER) {
      const top =
        categories.find((c) => !c.parentId && c.slug === g) ??
        categories.find((c) => !c.parentId && c.groupSlug === g);
      if (top) map.set(g, top);
    }
    return map;
  }, [categories]);

  const childrenByGroup = useMemo(() => {
    const map = new Map<ShopFilterGroup, AdminCategory[]>();
    for (const g of GROUP_ORDER) {
      const parent = topByGroup.get(g);
      const children = categories
        .filter((c) => c.parentId != null && c.groupSlug === g)
        .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
      map.set(g, children);
      if (!parent && children.length === 0) map.set(g, []);
    }
    return map;
  }, [categories, topByGroup]);

  function openCreateParent(group: ShopFilterGroup) {
    setForm(emptyForm(group, null));
  }

  function openCreateChild(group: ShopFilterGroup) {
    const parent = topByGroup.get(group);
    setForm(emptyForm(group, parent?.id ?? null));
  }

  function openEdit(cat: AdminCategory) {
    setForm({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description ?? "",
      imageUrl: cat.imageUrl ?? "",
      parentId: cat.parentId,
      groupSlug: (cat.groupSlug ?? "uomo") as ShopFilterGroup,
      status: cat.status,
      sortOrder: cat.sortOrder,
    });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    await saveCategory({
      id: form.id,
      slug: form.slug.trim() || slugify(form.name),
      name: form.name.trim(),
      description: form.description.trim() || null,
      imageUrl: form.imageUrl.trim() || null,
      parentId: form.parentId,
      groupSlug: form.groupSlug,
      status: form.status,
      sortOrder: form.sortOrder,
    });
    setSaving(false);
    setForm(null);
  }

  async function handleDelete(cat: AdminCategory) {
    const count =
      dataSource === "supabase"
        ? await countProductsForCategory(cat.id)
        : 0;

    const msg =
      count > 0
        ? `"${cat.name}" ha ${count} prodotto/i collegati. Eliminarla comunque? I prodotti resteranno senza quel collegamento.`
        : `Eliminare "${cat.name}"?`;

    if (!window.confirm(msg)) return;

    await deleteCategoryById(cat.id);
  }

  if (loading) {
    return (
      <p className={`py-12 text-center ${adminMutedTextClass}`}>
        Caricamento categorie…
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {dataSource === "mock" && (
        <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          Supabase non configurato — le modifiche restano solo in memoria.
        </p>
      )}

      {form && (
        <AdminCard className="p-6">
          <h3 className={adminSectionTitleClass}>
            {form.id ? "Modifica categoria" : "Nuova categoria"}
          </h3>
          <form onSubmit={handleSave} className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label className={adminLabelClass}>Nome *</label>
              <input
                required
                value={form.name}
                onChange={(e) =>
                  setForm((f) =>
                    f
                      ? {
                          ...f,
                          name: e.target.value,
                          slug: f.slug || slugify(e.target.value),
                        }
                      : f
                  )
                }
                className={adminInputClass}
              />
            </div>
            <div>
              <label className={adminLabelClass}>Slug *</label>
              <input
                required
                value={form.slug}
                onChange={(e) =>
                  setForm((f) => (f ? { ...f, slug: e.target.value } : f))
                }
                className={adminInputClass}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={adminLabelClass}>Descrizione</label>
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) =>
                  setForm((f) => (f ? { ...f, description: e.target.value } : f))
                }
                className={adminInputClass}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={adminLabelClass}>URL immagine</label>
              <input
                value={form.imageUrl}
                onChange={(e) =>
                  setForm((f) => (f ? { ...f, imageUrl: e.target.value } : f))
                }
                className={adminInputClass}
                placeholder="https://…"
              />
            </div>
            <div>
              <label className={adminLabelClass}>Gruppo</label>
              <select
                value={form.groupSlug}
                onChange={(e) =>
                  setForm((f) =>
                    f
                      ? {
                          ...f,
                          groupSlug: e.target.value as ShopFilterGroup,
                        }
                      : f
                  )
                }
                className={adminInputClass}
                disabled={Boolean(form.parentId)}
              >
                {GROUP_ORDER.map((g) => (
                  <option key={g} value={g}>
                    {shopFilterLabels[g]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={adminLabelClass}>Stato</label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm((f) => (f ? { ...f, status: e.target.value } : f))
                }
                className={adminInputClass}
              >
                <option value="visible">Visibile</option>
                <option value="hidden">Nascosta</option>
              </select>
            </div>
            <div>
              <label className={adminLabelClass}>Ordine</label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) =>
                  setForm((f) =>
                    f ? { ...f, sortOrder: Number(e.target.value) } : f
                  )
                }
                className={adminInputClass}
              />
            </div>
            <div className="flex flex-wrap gap-3 sm:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className={`${adminBtnPrimaryClass} disabled:opacity-50`}
              >
                {saving ? "Salvataggio…" : "Salva"}
              </button>
              <button
                type="button"
                onClick={() => setForm(null)}
                className={adminBtnGhostClass}
              >
                Annulla
              </button>
            </div>
          </form>
        </AdminCard>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => openCreateParent("uomo")}
          className={`${adminBtnSecondaryClass} px-4 py-2 text-xs uppercase tracking-wider`}
        >
          + Categoria principale
        </button>
      </div>

      {GROUP_ORDER.map((group) => {
        const parent = topByGroup.get(group);
        const children = childrenByGroup.get(group) ?? [];
        const isOpen = expanded[group] ?? true;

        return (
          <AdminCard key={group} className="overflow-hidden">
            <button
              type="button"
              onClick={() =>
                setExpanded((e) => ({ ...e, [group]: !isOpen }))
              }
              className="flex w-full items-center justify-between gap-4 border-b border-white/10 bg-white/[0.06] px-5 py-4 text-left transition hover:bg-white/[0.08]"
            >
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {shopFilterLabels[group]}
                </h3>
                <p className={adminCaptionClass}>
                  {children.length} sottocategorie
                  {parent ? ` · principale: ${parent.name}` : " · principale non creata"}
                </p>
              </div>
              <span className="text-zinc-400">{isOpen ? "−" : "+"}</span>
            </button>

            {isOpen && (
              <div className="space-y-4 p-5">
                {parent ? (
                  <div className={`${adminCardInnerClass} p-4`}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-zinc-100">
                          {parent.name}
                        </p>
                        <p className={adminCaptionClass}>
                          /{parent.slug} · {parent.status}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(parent)}
                          className={adminBtnGhostClass}
                        >
                          Modifica
                        </button>
                        <Link
                          href={getGroupPath(group)}
                          target="_blank"
                          className={adminBtnGhostClass}
                        >
                          Shop →
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => openCreateParent(group)}
                    className={`text-sm ${adminMutedTextClass} hover:text-white`}
                  >
                    Crea categoria principale «{shopFilterLabels[group]}»
                  </button>
                )}

                <div className="space-y-2">
                  {children.length === 0 ? (
                    <p className={adminMutedTextClass}>
                      Nessuna sottocategoria. Aggiungine una per il form
                      prodotto.
                    </p>
                  ) : (
                    children.map((child) => (
                      <div
                        key={child.id}
                        className={`flex flex-wrap items-center justify-between gap-3 ${adminCardInnerClass} px-4 py-3`}
                      >
                        <div>
                          <p className="text-sm font-medium text-zinc-100">
                            {child.name}
                          </p>
                          <p className={adminCaptionClass}>
                            /shop/{group}/
                            {categoryPathSlug(child.slug, child.groupSlug)} ·{" "}
                            {child.status}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(child)}
                            className={adminBtnGhostClass}
                          >
                            Modifica
                          </button>
                          <Link
                            href={`/shop/${group}/${categoryPathSlug(child.slug, child.groupSlug)}`}
                            target="_blank"
                            className={adminBtnGhostClass}
                          >
                            Vedi →
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(child)}
                            className={adminBtnDangerClass}
                          >
                            Elimina
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => openCreateChild(group)}
                  disabled={!parent}
                  className={`${adminBtnGhostClass} uppercase tracking-wider disabled:opacity-40`}
                >
                  + Aggiungi sottocategoria
                </button>
              </div>
            )}
          </AdminCard>
        );
      })}
    </div>
  );
}
