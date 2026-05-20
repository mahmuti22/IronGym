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
          <div className="ig-tilt-wrap ig-tilt-wrap--flush">
            <div className="ig-tilt relative isolate overflow-hidden rounded-3xl">
              <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(700px_280px_at_20%_0%,rgba(158,180,200,0.1),transparent_60%)]" />
              <div className="relative rounded-3xl ig-card-inner px-6 py-12 sm:px-12 sm:py-16">
                <div className="relative mx-auto max-w-2xl text-center">
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-silver-600">
                    Inner circle
                  </p>
                  <h2 className="mt-3 text-4xl leading-[1.15] tracking-tight sm:text-5xl">
                    <span className="ig-brand-wordmark ig-title-shimmer text-4xl sm:text-5xl">
                      Join the IronGym Movement
                    </span>
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
                      className="min-h-12 w-full flex-1 rounded-full border border-silver-400/45 bg-white/[0.08] px-5 text-sm text-silver-200 outline-none ring-0 placeholder:text-silver-600 focus:border-silver-300/65 focus:bg-white/[0.12]"
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
          </div>
        </Reveal>
      </div>
    </section>
  );
}
