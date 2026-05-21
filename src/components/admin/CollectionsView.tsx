"use client";

import Link from "next/link";
import { useState } from "react";
import { useAdmin } from "./AdminProvider";
import {
  AdminCard,
  adminBtnGhostClass,
  adminBtnPrimaryClass,
  adminCaptionClass,
  adminInputClass,
  adminLabelClass,
  adminMutedTextClass,
  adminSectionTitleClass,
} from "./admin-ui";
import { getGroupPath, getSubcategoryPath } from "@/data/shop";

export function CollectionsView() {
  const {
    groups,
    collectionSubcategories,
    collections,
    updateSubcategory,
    updateCollection,
    dataSource,
    loading,
  } = useAdmin();
  const [editingSub, setEditingSub] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function saveCollection(subId: string) {
    const sub = collectionSubcategories.find((s) => s.id === subId);
    const col = collections.find(
      (c) => c.id === subId || c.legacyId === subId || c.slug === sub?.slug
    );
    setSaving(true);
    if (col) {
      await updateCollection(col.id, {
        name: sub?.title,
        description: sub?.description,
        slug: sub?.slug,
      });
    } else {
      await updateSubcategory(subId, {});
    }
    setSaving(false);
    setEditingSub(null);
  }

  if (loading) {
    return (
      <p className={`py-12 text-center ${adminMutedTextClass}`}>
        Caricamento collezioni…
      </p>
    );
  }

  const colGroup = groups.find((g) => g.slug === "collezioni");

  return (
    <div className="space-y-8">
      {colGroup && (
        <AdminCard className="p-6">
          <h2 className="text-lg font-semibold text-white">
            {colGroup.title}
          </h2>
          <p className={`mt-2 ${adminMutedTextClass}`}>{colGroup.description}</p>
          <Link
            href={getGroupPath("collezioni")}
            target="_blank"
            className={`mt-4 inline-block ${adminBtnGhostClass}`}
          >
            Vedi pagina collezioni →
          </Link>
        </AdminCard>
      )}

      <section>
        <h2 className={`mb-4 ${adminSectionTitleClass}`}>
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
                    disabled={saving}
                    onClick={() => saveCollection(sub.id)}
                    className={`${adminBtnPrimaryClass} px-4 py-2 text-xs disabled:opacity-50`}
                  >
                    {saving
                      ? "Salvataggio…"
                      : dataSource === "supabase"
                        ? "Salva nel database"
                        : "Salva (mock locale)"}
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="font-semibold text-white">{sub.title}</h3>
                  <p className={`mt-2 ${adminMutedTextClass}`}>{sub.description}</p>
                  <p className={`mt-2 ${adminCaptionClass}`}>
                    /shop/collezioni/{sub.slug}
                  </p>
                  <div className="mt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setEditingSub(sub.id)}
                      className={adminBtnGhostClass}
                    >
                      Modifica
                    </button>
                    <Link
                      href={getSubcategoryPath(sub)}
                      target="_blank"
                      className={adminBtnGhostClass}
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
