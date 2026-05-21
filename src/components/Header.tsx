"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/components/cart/CartProvider";
import { IRON_GYM_HOME_INTRO_EVENT } from "@/lib/home-intro";

const nav = [
  { href: "/shop", label: "Shop" },
  { href: "/#abbigliamento", label: "Abbigliamento" },
  { href: "/about", label: "About" },
  { href: "/login", label: "Login" },
  { href: "/#contact", label: "Contact" },
];

function playHomeIntro() {
  window.dispatchEvent(new Event(IRON_GYM_HOME_INTRO_EVENT));
}

function ShoppingCartIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

const cartIconButtonClass =
  "relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-silver-500/30 bg-white/[0.04] text-silver-300 transition hover:border-silver-400/50 hover:bg-white/[0.07] hover:text-white";

function CartIconLink({
  className = cartIconButtonClass,
  iconClassName = "h-5 w-5",
  onNavigate,
}: {
  className?: string;
  iconClassName?: string;
  onNavigate?: () => void;
}) {
  const { itemCount, ready } = useCart();

  return (
    <Link
      href="/cart"
      onClick={onNavigate}
      aria-label="Apri carrello"
      className={className}
    >
      <span className="relative inline-flex items-center justify-center">
        <ShoppingCartIcon className={iconClassName} />
        {ready && itemCount > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold leading-none text-iron-950 ring-2 ring-iron-950">
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        ) : null}
      </span>
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-iron-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-block shrink-0 text-xl font-bold leading-[1.2] tracking-tight text-silver-200 transition hover:text-white sm:text-2xl"
        >
          Iron<span className="text-silver-500">Gym</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            onClick={playHomeIntro}
            className="text-sm font-medium text-silver-500 transition hover:text-silver-300"
          >
            Home
          </Link>
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

        <div className="flex items-center gap-2 sm:gap-3">
          <CartIconLink className={`${cartIconButtonClass} md:h-10 md:w-10`} />

          <Link
            href="/shop"
            className="hidden items-center justify-center rounded-full border border-silver-400/40 bg-white/[0.04] px-5 py-2 text-sm font-semibold text-silver-300 shadow-[0_0_0_1px_rgba(0,0,0,0.35)_inset] transition hover:border-silver-300/60 hover:bg-white/[0.07] hover:text-white md:inline-flex"
          >
            Shop Now
          </Link>

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
              <Link
                href="/"
                onClick={() => {
                  playHomeIntro();
                  setOpen(false);
                }}
                className="rounded-lg px-3 py-3 text-sm font-medium text-silver-400 transition hover:bg-white/[0.04] hover:text-silver-300"
              >
                Home
              </Link>
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
                href="/shop"
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
