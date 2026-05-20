"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function LogoIntro() {
  return (
    <section
      id="home"
      aria-label="Airon Gym"
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
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-[min(92vw,720px)] sm:max-w-[min(88vw,900px)] lg:max-w-[min(85vw,1040px)]"
      >
        <Image
          src="/branding/airon-gym-logo.png"
          alt="Airon Gym — logo"
          width={1024}
          height={1024}
          priority
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 88vw, 1040px"
          className="h-auto w-full select-none object-contain drop-shadow-[0_0_80px_rgba(255,255,255,0.06)]"
        />
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
