"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { IRON_GYM_HOME_INTRO_EVENT } from "@/lib/home-intro";

const INTRO_LETTERS = "IronGym".split("");
const TITLE_SIZE_CLASS = "text-[clamp(4rem,18vw,9rem)]";

const LETTER_SPRING = {
  type: "spring" as const,
  stiffness: 420,
  damping: 22,
};

const LETTER_STAGGER = 0.12;
const TAGLINE_DELAY =
  INTRO_LETTERS.length * LETTER_STAGGER + 0.35;

function letterColorClass(index: number): string {
  return index >= 4 ? "text-silver-500" : "text-silver-200";
}

export function LogoIntro() {
  const [playCount, setPlayCount] = useState(1);
  const [reducedMotion, setReducedMotion] = useState(false);

  const replayIntro = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    setPlayCount((c) => c + 1);
  }, []);

  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  useEffect(() => {
    const onReplay = () => replayIntro();
    window.addEventListener(IRON_GYM_HOME_INTRO_EVENT, onReplay);
    return () => window.removeEventListener(IRON_GYM_HOME_INTRO_EVENT, onReplay);
  }, [replayIntro]);

  return (
    <section
      id="home-logo-intro"
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

      <div className="relative z-10 text-center">
        <h1
          className={`ig-brand-wordmark m-0 ${TITLE_SIZE_CLASS} font-bold tracking-[-0.02em]`}
        >
          <Link
            href="/"
            onClick={(e) => {
              if (window.location.pathname === "/") {
                e.preventDefault();
                replayIntro();
              }
            }}
            className="inline-flex flex-row flex-nowrap items-center justify-center gap-[0.02em] whitespace-nowrap transition hover:opacity-90"
            aria-label="IronGym"
          >
            <span
              key={`logo-letters-${playCount}`}
              className="inline-flex flex-row flex-nowrap items-center justify-center gap-[0.02em] whitespace-nowrap"
            >
              {INTRO_LETTERS.map((letter, index) => (
                <motion.span
                  key={`${letter}-${index}-${playCount}`}
                  className={`inline-block leading-none ${letterColorClass(index)}`}
                  initial={
                    reducedMotion
                      ? { y: 0, opacity: 1, rotate: 0 }
                      : { y: "-55vh", opacity: 0, rotate: -8 }
                  }
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  transition={{
                    delay: reducedMotion ? 0 : index * LETTER_STAGGER,
                    ...LETTER_SPRING,
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </span>
          </Link>
        </h1>

        <motion.p
          key={`tagline-${playCount}`}
          className="mt-6 text-xs font-semibold uppercase tracking-[0.4em] text-silver-600"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: reducedMotion ? 0.1 : TAGLINE_DELAY,
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          Stronger everyday
        </motion.p>
      </div>
    </section>
  );
}
