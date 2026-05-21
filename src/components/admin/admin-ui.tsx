import type { ReactNode } from "react";

/** Superficie card principale — allineata al look glass/metal del sito pubblico */
export const adminCardClass =
  "rounded-2xl border border-white/10 bg-white/[0.06] shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl";

/** Card annidate / righe interne */
export const adminCardInnerClass =
  "rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-sm";

export function AdminCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`${adminCardClass} ${className}`}>{children}</div>;
}

export const adminInputClass =
  "w-full rounded-xl border border-white/15 bg-white/[0.08] px-4 py-2.5 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-white/25 focus:bg-white/[0.1] focus:ring-2 focus:ring-white/10";

export const adminLabelClass =
  "mb-2 block text-xs font-semibold uppercase tracking-widest text-zinc-200";

export const adminSectionTitleClass =
  "text-sm font-semibold uppercase tracking-widest text-zinc-300";

export const adminBodyTextClass = "text-sm text-zinc-200";

export const adminMutedTextClass = "text-sm text-zinc-300";

export const adminCaptionClass = "text-xs text-zinc-400";

/** Tabella */
export const adminTableShellClass =
  "overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-xl";

export const adminTableHeadRowClass = "border-b border-white/10 bg-white/[0.08]";

export const adminTableHeadCellClass =
  "px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest text-zinc-300";

export const adminTableRowClass =
  "border-b border-white/[0.08] transition-colors hover:bg-white/[0.06]";

/** Bottoni */
export const adminBtnPrimaryClass =
  "inline-flex min-h-10 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-iron-950 shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition hover:bg-zinc-200";

export const adminBtnSecondaryClass =
  "inline-flex min-h-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] px-5 text-sm font-semibold text-zinc-200 backdrop-blur-sm transition hover:border-white/25 hover:bg-white/[0.1] hover:text-white";

export const adminBtnGhostClass =
  "text-xs font-semibold text-zinc-300 transition hover:text-white";

export const adminBtnDangerClass =
  "text-xs font-semibold text-red-300 transition hover:text-red-200";

export function AdminBadge({
  children,
  variant = "default",
}: {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "muted";
}) {
  const styles = {
    default: "border-white/15 bg-white/[0.08] text-zinc-200",
    success: "border-emerald-400/25 bg-emerald-500/15 text-emerald-200",
    warning: "border-amber-400/25 bg-amber-500/15 text-amber-100",
    muted: "border-white/10 bg-white/[0.04] text-zinc-400",
  };
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${styles[variant]}`}
    >
      {children}
    </span>
  );
}
