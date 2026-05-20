"use client";

import Link from "next/link";
import { useAdmin } from "./AdminProvider";
import { AdminCard, AdminBadge } from "./admin-ui";
import {
  shopFilterLabels,
  getSubcategoryById,
} from "@/data/shop";

export function DashboardView() {
  const { products, groups, subcategories, collectionSubcategories } =
    useAdmin();

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

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((s) => (
          <AdminCard key={s.label} className="p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-silver-600">
              {s.label}
            </p>
            <p className="mt-2 text-3xl font-semibold text-silver-100">
              {s.value}
            </p>
          </AdminCard>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AdminCard className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-silver-200">Azioni rapide</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/products/new"
              className="inline-flex min-h-10 items-center rounded-full bg-white px-5 text-sm font-semibold text-iron-950 transition hover:bg-silver-300"
            >
              + Nuovo prodotto
            </Link>
            <Link
              href="/admin/products"
              className="inline-flex min-h-10 items-center rounded-full border border-silver-500/35 px-5 text-sm font-semibold text-silver-300 transition hover:border-silver-400/50"
            >
              Gestisci prodotti
            </Link>
            <Link
              href="/admin/categories"
              className="inline-flex min-h-10 items-center rounded-full border border-silver-500/35 px-5 text-sm font-semibold text-silver-300 transition hover:border-silver-400/50"
            >
              Categorie
            </Link>
          </div>
        </AdminCard>

        <AdminCard className="p-5">
          <h2 className="font-semibold text-silver-200">Ultimi prodotti</h2>
          <ul className="mt-4 space-y-3">
            {products.slice(0, 5).map((p) => {
              const sub = getSubcategoryById(p.subcategoryId);
              return (
                <li
                  key={p.id}
                  className="flex items-center justify-between gap-3 border-b border-white/[0.06] pb-3 last:border-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-silver-300">
                      {p.name}
                    </p>
                    <p className="text-xs text-silver-600">
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
          <p className="text-xs text-silver-600">
            Dati mock da <code className="text-silver-500">src/data/shop.ts</code>{" "}
            — modifiche solo in memoria (sessione corrente).
          </p>
        </div>
      </AdminCard>
    </div>
  );
}
