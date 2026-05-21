"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useAdmin } from "./AdminProvider";
import {
  AdminBadge,
  adminBtnDangerClass,
  adminBtnGhostClass,
  adminCaptionClass,
  adminInputClass,
  adminMutedTextClass,
  adminTableHeadCellClass,
  adminTableHeadRowClass,
  adminTableRowClass,
  adminTableShellClass,
} from "./admin-ui";
import {
  formatPrice,
  getProductPath,
  shopFilterLabels,
  productImageFocusClasses,
  type ShopFilterGroup,
} from "@/data/shop";

export function ProductsTable() {
  const {
    products,
    subcategories,
    removeProduct,
    toggleProductStatus,
    dataSource,
    loading,
  } = useAdmin();
  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState<ShopFilterGroup | "all">("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchGroup =
        groupFilter === "all" || p.filterGroup === groupFilter;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q);
      return matchGroup && matchSearch;
    });
  }, [products, search, groupFilter]);

  function resolveSub(subcategoryId: string | null) {
    if (!subcategoryId) return undefined;
    return subcategories.find(
      (s) => s.id === subcategoryId || s.slug === subcategoryId
    );
  }

  async function handleDelete(id: string, name: string) {
    if (
      !window.confirm(
        `Eliminare il prodotto "${name}"? Questa azione non può essere annullata.`
      )
    ) {
      return;
    }
    setDeletingId(id);
    await removeProduct(id);
    setDeletingId(null);
  }

  if (loading) {
    return (
      <p className={`py-12 text-center ${adminMutedTextClass}`}>
        Caricamento prodotti…
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          placeholder="Cerca per nome o ID…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`max-w-md ${adminInputClass}`}
        />
        <select
          value={groupFilter}
          onChange={(e) =>
            setGroupFilter(e.target.value as ShopFilterGroup | "all")
          }
          className={adminInputClass}
        >
          <option value="all">Tutte le linee</option>
          <option value="uomo">Uomo</option>
          <option value="donna">Donna</option>
          <option value="accessori">Accessori</option>
          <option value="collezioni">Collezioni</option>
        </select>
      </div>

      <div className={adminTableShellClass}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead>
              <tr className={adminTableHeadRowClass}>
                <th className={adminTableHeadCellClass}>
                  Prodotto
                </th>
                <th className={adminTableHeadCellClass}>
                  Categoria
                </th>
                <th className={adminTableHeadCellClass}>
                  Prezzo
                </th>
                <th className={adminTableHeadCellClass}>
                  Genere
                </th>
                <th className={adminTableHeadCellClass}>
                  Tag
                </th>
                <th className={adminTableHeadCellClass}>
                  Stato
                </th>
                <th className={adminTableHeadCellClass}>
                  Azioni
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className={`px-4 py-12 text-center ${adminMutedTextClass}`}
                  >
                    Nessun prodotto trovato.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const sub = resolveSub(p.subcategoryId);
                  const publicId =
                    dataSource === "supabase" ? p.slug : p.id;
                  return (
                    <tr
                      key={p.id}
                      className={adminTableRowClass}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-10 shrink-0 overflow-hidden rounded-lg bg-black/40">
                            <Image
                              src={p.image}
                              alt=""
                              fill
                              className={`object-cover ${productImageFocusClasses[p.imageFocusIndex]}`}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-zinc-100">
                              {p.name}
                            </p>
                            <p className={adminCaptionClass}>
                              {p.slug}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className={`px-4 py-3 ${adminMutedTextClass}`}>
                        <p>{shopFilterLabels[p.filterGroup]}</p>
                        <p className={adminCaptionClass}>
                          {sub?.title ?? p.subcategoryId ?? "—"}
                        </p>
                      </td>
                      <td className="px-4 py-3 font-medium text-zinc-100">
                        {formatPrice(p.price)}
                      </td>
                      <td className={`px-4 py-3 capitalize ${adminCaptionClass}`}>
                        {p.gender}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {p.tags.length > 0 ? (
                            p.tags.map((t) => (
                              <AdminBadge key={t}>{t}</AdminBadge>
                            ))
                          ) : (
                            <span className="text-zinc-500">—</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => toggleProductStatus(p.id)}
                          className="inline-block"
                        >
                          <AdminBadge
                            variant={
                              p.status === "published" ? "success" : "warning"
                            }
                          >
                            {p.status === "published"
                              ? "Pubblicato"
                              : "Bozza"}
                          </AdminBadge>
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <Link
                            href={getProductPath(publicId)}
                            target="_blank"
                            className={adminBtnGhostClass}
                          >
                            Vedi
                          </Link>
                          <button
                            type="button"
                            disabled={deletingId === p.id}
                            onClick={() => handleDelete(p.id, p.name)}
                            className={`${adminBtnDangerClass} disabled:opacity-50`}
                          >
                            {deletingId === p.id ? "…" : "Elimina"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      <p className={adminCaptionClass}>
        {filtered.length} di {products.length} prodotti —{" "}
        {dataSource === "supabase" ? "Supabase" : "sessione mock locale"}
      </p>
    </div>
  );
}
