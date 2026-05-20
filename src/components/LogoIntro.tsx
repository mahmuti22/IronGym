"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function LogoIntro() {
  return (
    <section
      id="home"
      aria-label="IronGym"
      className="relative flex min-h-[100dvh] items-center justify-center bg-[#010101] px-5 pb-16 pt-[5.75rem] sm:px-8 sm:pb-20 sm:pt-24"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_50%_38%,rgba(120,125,140,0.12),transparent_62%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4] [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:32px_32px]"
        aria-hidden
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 text-center"
      >
        <Link
          href="/"
          className="font-display ig-title-shimmer text-[clamp(4rem,18vw,9rem)] leading-[0.9] tracking-wide text-silver-200 transition hover:text-white"
        >
          Iron<span className="text-silver-500">Gym</span>
        </Link>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.4em] text-silver-600">
          Stronger everyday
        </p>
      </motion.div>

      <p
        className="pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-[10px] font-semibold uppercase tracking-[0.4em] text-silver-600 sm:bottom-10"
        aria-hidden
      >
        Scroll
      </p>
    </section>
  );
}
