"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const nav = [
  { href: "/admin", label: "Dashboard", icon: "◆", exact: true },
  { href: "/admin/products", label: "Prodotti", icon: "▣", exact: true },
  { href: "/admin/products/new", label: "Nuovo prodotto", icon: "+", exact: true },
  { href: "/admin/categories", label: "Categorie", icon: "☰", exact: true },
  { href: "/admin/collections", label: "Collezioni", icon: "◎", exact: true },
  { href: "/admin/orders", label: "Ordini", icon: "◇", exact: false },
] as const;

function isNavActive(pathname: string, href: string, exact: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    if (!isSupabaseConfigured()) {
      router.push("/admin/login");
      return;
    }

    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      router.push("/admin/login");
      return;
    }

    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex w-full flex-col border-r border-white/10 bg-[#14141c]/85 backdrop-blur-xl lg:w-64 lg:shrink-0">
      <div className="border-b border-white/10 px-5 py-6">
        <Link href="/admin" className="block">
          <span className="text-lg font-bold tracking-tight text-zinc-100">
            Iron<span className="text-zinc-400">Gym</span>
          </span>
          <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.35em] text-zinc-400">
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
                  ? "bg-white/[0.12] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.12)_inset]"
                  : "text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-100"
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

      <div className="border-t border-white/10 p-4 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-zinc-300 transition hover:border-white/25 hover:bg-white/[0.1] hover:text-white"
        >
          Vai al sito →
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex w-full items-center justify-center rounded-xl border border-red-500/25 bg-red-500/5 px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-red-300/90 transition hover:border-red-400/40 hover:bg-red-500/10 disabled:opacity-50"
        >
          {loggingOut ? "Uscita…" : "Logout"}
        </button>
      </div>
    </aside>
  );
}
