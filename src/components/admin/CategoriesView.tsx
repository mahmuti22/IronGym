"use client";

import Link from "next/link";
import { useState } from "react";
import { useAdmin } from "./AdminProvider";
import { AdminCard, adminInputClass, adminLabelClass } from "./admin-ui";
import { getGroupPath, getSubcategoryPath } from "@/data/shop";

export function CategoriesView() {
  const { groups, categorySubcategories, updateGroup, updateSubcategory } =
    useAdmin();
  const [editingGroup, setEditingGroup] = useState<string | null>(null);
  const [editingSub, setEditingSub] = useState<string | null>(null);

  const shopGroupsOnly = groups.filter((g) => g.slug !== "collezioni");

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-silver-500">
          Categorie principali
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shopGroupsOnly.map((group) => (
            <AdminCard key={group.slug} className="p-5">
              {editingGroup === group.slug ? (
                <div className="space-y-3">
                  <input
                    value={group.title}
                    onChange={(e) =>
                      updateGroup(group.slug, { title: e.target.value })
                    }
                    className={adminInputClass}
                  />
                  <textarea
                    rows={3}
                    value={group.description}
                    onChange={(e) =>
                      updateGroup(group.slug, {
                        description: e.target.value,
                      })
                    }
                    className={adminInputClass}
                  />
                  <button
                    type="button"
                    onClick={() => setEditingGroup(null)}
                    className="text-xs font-semibold text-silver-400 hover:text-white"
                  >
                    Fine modifica
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-silver-200">
                    {group.title}
                  </h3>
                  <p className="mt-2 text-sm text-silver-500 line-clamp-3">
                    {group.description}
                  </p>
                  <p className="mt-2 text-xs text-silver-600">/{group.slug}</p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setEditingGroup(group.slug)}
                      className="text-xs font-semibold text-silver-400 hover:text-white"
                    >
                      Modifica
                    </button>
                    <Link
                      href={getGroupPath(group.slug)}
                      target="_blank"
                      className="text-xs font-semibold text-silver-500 hover:text-silver-300"
                    >
                      Vedi shop →
                    </Link>
                  </div>
                </>
              )}
            </AdminCard>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-silver-500">
          Sottocategorie ({categorySubcategories.length})
        </h2>
        <div className="space-y-3">
          {categorySubcategories.map((sub) => (
            <AdminCard key={sub.id} className="p-4">
              {editingSub === sub.id ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className={adminLabelClass}>Titolo</label>
                    <input
                      value={sub.title}
                      onChange={(e) =>
                        updateSubcategory(sub.id, { title: e.target.value })
                      }
                      className={adminInputClass}
                    />
                  </div>
                  <div>
                    <label className={adminLabelClass}>Slug</label>
                    <input
                      value={sub.slug}
                      onChange={(e) =>
                        updateSubcategory(sub.id, { slug: e.target.value })
                      }
                      className={adminInputClass}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={adminLabelClass}>Descrizione</label>
                    <textarea
                      rows={2}
                      value={sub.description}
                      onChange={(e) =>
                        updateSubcategory(sub.id, {
                          description: e.target.value,
                        })
                      }
                      className={adminInputClass}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingSub(null)}
                    className="text-xs font-semibold text-silver-400 sm:col-span-2"
                  >
                    Salva (locale)
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-silver-200">{sub.title}</p>
                    <p className="text-xs text-silver-600">
                      /shop/{sub.filterGroup}/{sub.slug}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setEditingSub(sub.id)}
                      className="text-xs font-semibold text-silver-400 hover:text-white"
                    >
                      Modifica
                    </button>
                    <Link
                      href={getSubcategoryPath(sub)}
                      target="_blank"
                      className="text-xs font-semibold text-silver-500 hover:text-silver-300"
                    >
                      Vedi →
                    </Link>
                  </div>
                </div>
              )}
            </AdminCard>
          ))}
        </div>
      </section>
    </div>
  );
}
