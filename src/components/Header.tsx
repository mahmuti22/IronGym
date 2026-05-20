"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
const nav = [
  { href: "/", label: "Home" },
  { href: "/#collection", label: "Collection" },
  { href: "/about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-iron-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-silver-200 transition hover:text-white sm:text-2xl"
        >
          Iron<span className="text-silver-500">Gym</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-silver-500 transition hover:text-silver-300"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link
            href="/#collection"
            className="inline-flex items-center justify-center rounded-full border border-silver-400/40 bg-white/[0.04] px-5 py-2 text-sm font-semibold text-silver-300 shadow-[0_0_0_1px_rgba(0,0,0,0.35)_inset] transition hover:border-silver-300/60 hover:bg-white/[0.07] hover:text-white"
          >
            Shop Now
          </Link>
        </div>

        <button
          type="button"
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-silver-600/35 bg-white/[0.03] text-silver-300 transition hover:border-silver-400/50 hover:text-white md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? "Chiudi menu" : "Apri menu"}</span>
          <span
            className={`absolute left-2.5 top-[15px] block h-0.5 w-5 rounded-full bg-current transition-transform duration-300 ${open ? "translate-y-[7px] rotate-45" : ""}`}
          />
          <span
            className={`absolute left-2.5 top-[19px] block h-0.5 w-5 rounded-full bg-current transition-opacity duration-200 ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`absolute left-2.5 top-[23px] block h-0.5 w-5 rounded-full bg-current transition-transform duration-300 ${open ? "-translate-y-[7px] -rotate-45" : ""}`}
          />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-white/[0.06] md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4 sm:px-6">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-sm font-medium text-silver-400 transition hover:bg-white/[0.04] hover:text-silver-300"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/#collection"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex items-center justify-center rounded-full border border-silver-400/40 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-silver-300"
              >
                Shop Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
