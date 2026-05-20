"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { IRON_GYM_HOME_INTRO_EVENT } from "@/lib/home-intro";

type Phase = "enter" | "climax" | "transition" | "done";

const TIMELINE = {
  climax: 1900,
  transition: 2200,
  scroll: 2300,
  done: 3400,
} as const;

const REDUCED_TIMELINE = {
  climax: 300,
  transition: 400,
  scroll: 500,
  done: 900,
} as const;

/** Particelle deterministiche (posizione %, timing, dimensione px) */
const INTRO_SPARKS = [
  { left: 6, top: 38, delay: 0.55, dur: 1.35, size: 3 },
  { left: 14, top: 58, delay: 0.72, dur: 1.1, size: 2 },
  { left: 22, top: 32, delay: 0.48, dur: 1.5, size: 4 },
  { left: 31, top: 68, delay: 0.9, dur: 1.2, size: 2 },
  { left: 38, top: 44, delay: 0.62, dur: 1.4, size: 3 },
  { left: 46, top: 26, delay: 0.4, dur: 1.25, size: 2 },
  { left: 54, top: 62, delay: 0.78, dur: 1.45, size: 3 },
  { left: 61, top: 36, delay: 0.52, dur: 1.15, size: 2 },
  { left: 68, top: 72, delay: 0.95, dur: 1.3, size: 4 },
  { left: 74, top: 48, delay: 0.66, dur: 1.2, size: 2 },
  { left: 80, top: 30, delay: 0.44, dur: 1.55, size: 3 },
  { left: 86, top: 56, delay: 0.82, dur: 1.1, size: 2 },
  { left: 92, top: 40, delay: 0.58, dur: 1.35, size: 3 },
  { left: 18, top: 74, delay: 1.02, dur: 1.2, size: 2 },
  { left: 42, top: 22, delay: 0.38, dur: 1.4, size: 3 },
  { left: 58, top: 78, delay: 0.88, dur: 1.25, size: 2 },
  { left: 72, top: 18, delay: 0.5, dur: 1.5, size: 4 },
  { left: 50, top: 52, delay: 0.7, dur: 1.15, size: 2 },
] as const;

function setIntroDocumentState(active: boolean) {
  if (active) {
    document.documentElement.setAttribute("data-ig-home-intro", "");
  } else {
    document.documentElement.removeAttribute("data-ig-home-intro");
  }
}

export function HomeIntroAnimation() {
  const [isVisible, setIsVisible] = useState(true);
  const [phase, setPhase] = useState<Phase>("enter");
  const [playCount, setPlayCount] = useState(1);
  const isPlayingRef = useRef(false);
  const timersRef = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  const requestIntro = useCallback(() => {
    if (isPlayingRef.current) return;
    setIsVisible(true);
    setPhase("enter");
    setPlayCount((count) => count + 1);
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const timeline = reducedMotion ? REDUCED_TIMELINE : TIMELINE;

    clearTimers();
    isPlayingRef.current = true;
    setIsVisible(true);
    setPhase("enter");
    setIntroDocumentState(true);

    window.scrollTo({ top: 0, behavior: "auto" });

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const schedule = (fn: () => void, ms: number) => {
      const id = window.setTimeout(fn, ms);
      timersRef.current.push(id);
    };

    schedule(() => setPhase("climax"), timeline.climax);
    schedule(() => setPhase("transition"), timeline.transition);
    schedule(() => {
      if (!reducedMotion) {
        document
          .getElementById("home-content-start")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, timeline.scroll);
    schedule(() => {
      isPlayingRef.current = false;
      setPhase("done");
      setIsVisible(false);
      setIntroDocumentState(false);
      document.body.style.overflow = previousOverflow;

      if (reducedMotion) {
        document
          .getElementById("home-content-start")
          ?.scrollIntoView({ behavior: "auto", block: "start" });
      }
    }, timeline.done);

    return () => {
      clearTimers();
      isPlayingRef.current = false;
      setIntroDocumentState(false);
      document.body.style.overflow = previousOverflow;
    };
  }, [playCount, clearTimers]);

  useEffect(() => {
    const onReplay = () => requestIntro();
    window.addEventListener(IRON_GYM_HOME_INTRO_EVENT, onReplay);
    return () => window.removeEventListener(IRON_GYM_HOME_INTRO_EVENT, onReplay);
  }, [requestIntro]);

  if (!isVisible || phase === "done") return null;

  const overlayPhaseClass =
    phase === "climax"
      ? "ig-home-intro-overlay--climax"
      : phase === "transition"
        ? "ig-home-intro-overlay--transition"
        : "";

  const titlePhaseClass =
    phase === "climax"
      ? "ig-home-intro-title--climax"
      : phase === "transition"
        ? "ig-home-intro-title--disperse"
        : "";

  return (
    <div
      key={playCount}
      className={`ig-home-intro-overlay fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#010101] ${overlayPhaseClass}`}
      role="presentation"
      aria-hidden="true"
    >
      <div className="ig-home-intro-overlay__grid" aria-hidden />
      <div className="ig-home-intro-overlay__glow" aria-hidden />
      <div className="ig-home-intro-overlay__vignette" aria-hidden />

      <div
        className={`ig-home-intro-title-wrap relative z-10 px-4 text-center sm:px-8 ${titlePhaseClass}`}
      >
        <div className="ig-home-intro-title__glow" aria-hidden />

        {INTRO_SPARKS.map((spark, i) => (
          <span
            key={`${playCount}-spark-${i}`}
            className="ig-home-intro-spark"
            style={{
              left: `${spark.left}%`,
              top: `${spark.top}%`,
              width: spark.size,
              height: spark.size,
              animationDelay: `${spark.delay}s`,
              animationDuration: `${spark.dur}s`,
            }}
            aria-hidden
          />
        ))}

        <h1 key={`title-${playCount}`} className="ig-home-intro-title">
          <span className="ig-home-intro-title__text">IronGym</span>
          <span className="ig-home-intro-title__sweep" aria-hidden />
        </h1>
      </div>
    </div>
  );
}
