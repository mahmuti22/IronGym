"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

const links = [
  { href: "/account", label: "Panoramica", exact: true },
  { href: "/account/orders", label: "I miei ordini", exact: false },
  { href: "/account/profile", label: "Profilo", exact: false },
] as const;

export function AccountNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createBrowserSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.refresh();
    router.replace("/");
  }

  return (
    <nav className="mt-8 flex flex-wrap items-center gap-2 border-b border-white/[0.08] pb-4">
      {links.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              active
                ? "border-silver-300/50 bg-white/[0.08] text-white"
                : "border-white/10 bg-transparent text-silver-400 hover:border-white/20 hover:text-silver-200"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
      <button
        type="button"
        onClick={handleLogout}
        className="ml-auto rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-silver-400 transition hover:border-red-400/30 hover:text-red-200"
      >
        Esci
      </button>
    </nav>
  );
}
