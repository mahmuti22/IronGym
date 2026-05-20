import type { ReactNode } from "react";

export function AdminCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-silver-500/25 bg-white/[0.03] shadow-[0_0_0_1px_rgba(0,0,0,0.35)_inset] ${className}`}
    >
      {children}
    </div>
  );
}

export const adminInputClass =
  "w-full rounded-xl border border-silver-500/35 bg-white/[0.05] px-4 py-2.5 text-sm text-silver-200 outline-none transition placeholder:text-silver-600 focus:border-silver-400/55 focus:bg-white/[0.08]";

export const adminLabelClass =
  "mb-2 block text-xs font-semibold uppercase tracking-widest text-silver-600";

export function AdminBadge({
  children,
  variant = "default",
}: {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "muted";
}) {
  const styles = {
    default: "border-silver-500/35 bg-white/[0.06] text-silver-300",
    success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    warning: "border-amber-500/30 bg-amber-500/10 text-amber-200",
    muted: "border-silver-600/25 bg-transparent text-silver-500",
  };
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${styles[variant]}`}
    >
      {children}
    </span>
  );
}
