"use client";

import Link from "next/link";
import { useState } from "react";
import { useAdmin } from "./AdminProvider";
import { AdminCard, adminInputClass, adminLabelClass } from "./admin-ui";
import { getGroupPath, getSubcategoryPath } from "@/data/shop";

export function CollectionsView() {
  const { groups, collectionSubcategories, updateSubcategory } = useAdmin();
  const [editingSub, setEditingSub] = useState<string | null>(null);

  const colGroup = groups.find((g) => g.slug === "collezioni");

  return (
    <div className="space-y-8">
      {colGroup && (
        <AdminCard className="p-6">
          <h2 className="text-lg font-semibold text-silver-200">
            {colGroup.title}
          </h2>
          <p className="mt-2 text-sm text-silver-500">{colGroup.description}</p>
          <Link
            href={getGroupPath("collezioni")}
            target="_blank"
            className="mt-4 inline-block text-xs font-semibold text-silver-400 hover:text-silver-200"
          >
            Vedi pagina collezioni →
          </Link>
        </AdminCard>
      )}

      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-silver-500">
          Linee collezione ({collectionSubcategories.length})
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {collectionSubcategories.map((sub) => (
            <AdminCard key={sub.id} className="p-5">
              {editingSub === sub.id ? (
                <div className="space-y-3">
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
                    className="text-xs font-semibold text-silver-400"
                  >
                    Salva (locale)
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="font-semibold text-silver-200">{sub.title}</h3>
                  <p className="mt-2 text-sm text-silver-500">{sub.description}</p>
                  <p className="mt-2 text-xs text-silver-600">
                    /shop/collezioni/{sub.slug}
                  </p>
                  <div className="mt-4 flex gap-3">
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
                      Vedi shop →
                    </Link>
                  </div>
                </>
              )}
            </AdminCard>
          ))}
        </div>
      </section>
    </div>
  );
}
