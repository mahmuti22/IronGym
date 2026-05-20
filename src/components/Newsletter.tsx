"use client";

import { useState } from "react";
import { Reveal } from "./Reveal";

export function Newsletter() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section
      id="contact"
      className="border-b border-white/[0.06] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-silver-500/35 bg-gradient-to-br from-iron-850/90 via-iron-900 to-iron-950 p-[1px] shadow-[0_0_0_1px_rgba(0,0,0,0.45)_inset,0_32px_100px_rgba(0,0,0,0.55)]">
            <div className="relative rounded-[calc(1.5rem-1px)] bg-iron-900/70 px-6 py-12 sm:px-12 sm:py-16">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_280px_at_20%_0%,rgba(158,180,200,0.08),transparent_60%)]" />
              <div className="relative mx-auto max-w-2xl text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-silver-600">
                  Inner circle
                </p>
                <h2 className="mt-3 font-display text-4xl tracking-wide text-silver-300 sm:text-5xl">
                  Join the IronGym Movement
                </h2>
                <p className="mt-4 text-silver-500">
                  Early access to drops, restocks in CH, and training notes from
                  our team — no spam, ever.
                </p>

                <form
                  onSubmit={handleSubmit}
                  className="mx-auto mt-10 flex max-w-lg flex-col gap-3 sm:flex-row sm:items-stretch"
                >
                  <label htmlFor="email" className="sr-only">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@email.com"
                    className="min-h-12 w-full flex-1 rounded-full border border-silver-600/40 bg-black/35 px-5 text-sm text-silver-300 outline-none ring-0 placeholder:text-silver-600 focus:border-silver-300/60 focus:bg-black/45"
                  />
                  <button
                    type="submit"
                    className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-iron-950 transition hover:bg-silver-300"
                  >
                    Get Early Access
                  </button>
                </form>
                {submitted && (
                  <p className="mt-4 text-sm font-medium text-silver-400">
                    You&apos;re on the list. Welcome to the movement.
                  </p>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
