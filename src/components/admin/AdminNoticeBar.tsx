"use client";

import { useEffect } from "react";
import { useAdmin } from "./AdminProvider";

export function AdminNoticeBar() {
  const { notice, clearNotice, dataSource, loading } = useAdmin();

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => clearNotice(), 6000);
    return () => clearTimeout(t);
  }, [notice, clearNotice]);

  if (loading) {
    return (
      <div className="border-b border-white/10 bg-white/[0.05] px-4 py-2 text-center text-xs text-zinc-400 sm:px-8">
        Caricamento dati…
      </div>
    );
  }

  return (
    <div className="space-y-0">
      <div className="border-b border-white/10 bg-white/[0.05] px-4 py-2 text-center text-xs text-zinc-300 sm:px-8">
        Fonte dati:{" "}
        <span className="font-semibold text-zinc-100">
          {dataSource === "supabase" ? "Supabase" : "Mock locale"}
        </span>
      </div>
      {notice && (
        <div
          role="status"
          className={`border-b px-4 py-3 text-sm sm:px-8 ${
            notice.type === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
              : notice.type === "error"
                ? "border-red-500/30 bg-red-500/10 text-red-300"
                : "border-amber-500/30 bg-amber-500/10 text-amber-200"
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            <span>{notice.message}</span>
            <button
              type="button"
              onClick={clearNotice}
              className="shrink-0 text-xs font-semibold uppercase tracking-wider opacity-70 hover:opacity-100"
            >
              Chiudi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
