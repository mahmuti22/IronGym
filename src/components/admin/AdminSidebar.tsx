"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/admin", label: "Dashboard", icon: "◆", exact: true },
  { href: "/admin/products", label: "Prodotti", icon: "▣", exact: true },
  { href: "/admin/products/new", label: "Nuovo prodotto", icon: "+", exact: true },
  { href: "/admin/categories", label: "Categorie", icon: "☰", exact: true },
  { href: "/admin/collections", label: "Collezioni", icon: "◎", exact: true },
] as const;

function isNavActive(pathname: string, href: string, exact: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-full flex-col border-r border-white/[0.08] bg-iron-900/80 lg:w-64 lg:shrink-0">
      <div className="border-b border-white/[0.08] px-5 py-6">
        <Link href="/admin" className="block">
          <span className="text-lg font-bold tracking-tight text-silver-200">
            Iron<span className="text-silver-500">Gym</span>
          </span>
          <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.35em] text-silver-600">
            Admin Panel
          </span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {nav.map((item) => {
          const active = isNavActive(pathname, item.href, item.exact);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-white/[0.1] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08)_inset]"
                  : "text-silver-500 hover:bg-white/[0.04] hover:text-silver-300"
              }`}
            >
              <span className="text-xs opacity-60" aria-hidden>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/[0.08] p-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-center rounded-xl border border-silver-500/30 bg-white/[0.03] px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-silver-400 transition hover:border-silver-400/50 hover:text-silver-200"
        >
          Vai al sito →
        </Link>
        <p className="mt-3 text-center text-[10px] text-silver-700">
          Solo UI · dati locali
        </p>
      </div>
    </aside>
  );
}
