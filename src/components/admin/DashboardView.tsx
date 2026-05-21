"use client";

import Link from "next/link";
import { useAdmin } from "./AdminProvider";
import {
  AdminCard,
  AdminBadge,
  adminBtnPrimaryClass,
  adminBtnSecondaryClass,
  adminCaptionClass,
  adminMutedTextClass,
  adminSectionTitleClass,
} from "./admin-ui";
import { shopFilterLabels } from "@/data/shop";

export function DashboardView() {
  const {
    products,
    groups,
    subcategories,
    collectionSubcategories,
    dataSource,
    loading,
  } = useAdmin();

  function resolveSub(subcategoryId: string | null) {
    if (!subcategoryId) return undefined;
    return subcategories.find(
      (s) => s.id === subcategoryId || s.slug === subcategoryId
    );
  }

  const published = products.filter((p) => p.status === "published").length;
  const draft = products.filter((p) => p.status === "draft").length;

  const stats = [
    { label: "Prodotti totali", value: products.length },
    { label: "Pubblicati", value: published },
    { label: "Bozze", value: draft },
    { label: "Categorie", value: groups.length },
    { label: "Sottocategorie", value: subcategories.length },
    { label: "Collezioni", value: collectionSubcategories.length },
  ];

  if (loading) {
    return (
      <p className={`py-12 text-center ${adminMutedTextClass}`}>
        Caricamento dashboard…
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((s) => (
          <AdminCard key={s.label} className="p-5">
            <p className={adminSectionTitleClass}>
              {s.label}
            </p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {s.value}
            </p>
          </AdminCard>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AdminCard className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-white">Azioni rapide</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/products/new"
              className={adminBtnPrimaryClass}
            >
              + Nuovo prodotto
            </Link>
            <Link
              href="/admin/products"
              className={adminBtnSecondaryClass}
            >
              Gestisci prodotti
            </Link>
            <Link
              href="/admin/categories"
              className={adminBtnSecondaryClass}
            >
              Categorie
            </Link>
          </div>
        </AdminCard>

        <AdminCard className="p-5">
          <h2 className="font-semibold text-white">Ultimi prodotti</h2>
          <ul className="mt-4 space-y-3">
            {products.slice(0, 5).map((p) => {
              const sub = resolveSub(p.subcategoryId);
              return (
                <li
                  key={p.id}
                  className="flex items-center justify-between gap-3 border-b border-white/[0.06] pb-3 last:border-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-zinc-100">
                      {p.name}
                    </p>
                    <p className={adminCaptionClass}>
                      {shopFilterLabels[p.filterGroup]}
                      {sub ? ` · ${sub.title}` : ""}
                    </p>
                  </div>
                  <AdminBadge
                    variant={p.status === "published" ? "success" : "warning"}
                  >
                    {p.status === "published" ? "Live" : "Bozza"}
                  </AdminBadge>
                </li>
              );
            })}
          </ul>
        </AdminCard>
      </div>

      <AdminCard className="overflow-hidden">
        <div className="border-b border-white/[0.08] px-5 py-4">
          <p className={adminCaptionClass}>
            {dataSource === "supabase" ? (
              <>
                Dati caricati da <strong className="text-zinc-100">Supabase</strong>.
                Le modifiche vengono salvate nel database.
              </>
            ) : (
              <>
                Fallback mock da{" "}
                <code className="text-zinc-400">src/data/shop.ts</code> — imposta{" "}
                <code className="text-zinc-400">NEXT_PUBLIC_SUPABASE_URL</code> e{" "}
                <code className="text-zinc-400">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{" "}
                in <code className="text-zinc-400">.env.local</code>.
              </>
            )}
          </p>
        </div>
      </AdminCard>
    </div>
  );
}
