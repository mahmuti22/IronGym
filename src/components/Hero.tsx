"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CATALOG_STUDIO_MODEL_01 } from "@/data/catalog";

const badges = ["New Drop 2026", "Performance Fit", "Premium Fabric"];

export function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden border-b border-white/[0.06] pt-28 pb-16 sm:pt-32 sm:pb-24"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-steel-400/10 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-silver-400/5 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-silver-600"
          >
            IronGym — Swiss engineered attitude
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="font-display ig-title-shimmer text-5xl leading-[0.95] sm:text-6xl lg:text-7xl"
          >
            Built for Iron.
            <br />
            Made for Motion.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-xl text-base leading-relaxed text-silver-500 sm:text-lg"
          >
            Premium gym wear designed for discipline, strength and everyday
            performance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link
              href="#collection"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-7 text-sm font-semibold text-iron-950 shadow-[0_0_0_1px_rgba(255,255,255,0.12)_inset] transition hover:bg-silver-300 hover:shadow-[0_0_40px_rgba(214,214,214,0.18)]"
            >
              Shop Collection
            </Link>
            <Link
              href="/about"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-silver-400/45 bg-white/[0.03] px-7 text-sm font-semibold text-silver-300 transition hover:border-silver-300/70 hover:bg-white/[0.06] hover:text-white"
            >
              Explore Brand
            </Link>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.28 }}
            className="mt-10 flex flex-wrap gap-2"
          >
            {badges.map((b) => (
              <li
                key={b}
                className="rounded-full border border-silver-600/35 bg-iron-900/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-silver-400 backdrop-blur-sm"
              >
                {b}
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative ig-tilt-wrap"
        >
          <div className="ig-tilt metal-glow relative rounded-2xl">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-iron-950 sm:aspect-[5/6]">
              <Image
                src={CATALOG_STUDIO_MODEL_01}
                alt="Performance compression tee — studio lookbook"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-[50%_14%]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/35" />
              <div className="pointer-events-none absolute inset-0 opacity-[0.28] [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:22px_22px]" />

              <div className="relative flex h-full flex-col justify-end p-6 sm:p-8">
                <div className="mb-auto pt-6">
                  <div className="inline-flex items-center gap-2 rounded-full border border-silver-500/35 bg-white/[0.08] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-silver-400 backdrop-blur-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-silver-400/90 shadow-[0_0_14px_rgba(214,214,214,0.35)]" />
                    In stock — limited run
                  </div>
                </div>

                <div className="rounded-xl border border-silver-400/45 ig-card-inner p-4 shadow-[0_0_0_1px_rgba(0,0,0,0.25)_inset] backdrop-blur-md sm:p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-silver-600">
                    Visual drop
                  </p>
                  <p className="mt-2 font-display ig-title-shimmer text-3xl tracking-wide sm:text-4xl">
                    HEAVY SILENCE
                  </p>
                  <p className="mt-2 text-sm text-silver-400">
                    Matte black kit. Cold steel details. Built to look sharp
                    under any bar.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute -bottom-6 -right-4 hidden h-28 w-28 rounded-full border border-silver-400/35 sm:block" />
        </motion.div>
      </div>
    </section>
  );
}
