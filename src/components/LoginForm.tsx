"use client";

import Link from "next/link";
import { useState } from "react";
import { Reveal } from "./Reveal";
import { IronGymMark } from "./IronGymMark";

const inputClass =
  "min-h-12 w-full rounded-xl border border-silver-400/45 bg-white/[0.08] px-4 text-sm text-silver-200 outline-none placeholder:text-silver-600 focus:border-silver-300/65 focus:bg-white/[0.12]";

export function LoginForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section className="border-b border-white/[0.06] py-16 sm:py-24">
      <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="ig-tilt-wrap ig-tilt-wrap--flush">
            <div className="ig-tilt relative isolate overflow-hidden rounded-3xl">
              <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(500px_220px_at_50%_0%,rgba(158,180,200,0.12),transparent_65%)]" />
              <div className="relative rounded-3xl ig-card-inner px-6 py-10 sm:px-10 sm:py-12">
                <div className="text-center">
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-silver-600">
                    Mitgliederkonto
                  </p>
                  <h1 className="mt-3 text-3xl leading-[1.15] tracking-tight sm:text-4xl">
                    <IronGymMark shimmer className="text-3xl sm:text-4xl" />
                  </h1>
                  <p className="mt-3 text-sm text-silver-500">
                    Melde dich an für Bestellungen, Drops und dein Profil.
                  </p>
                </div>

                {submitted ? (
                  <div className="mt-10 rounded-xl border border-silver-400/35 bg-white/[0.06] px-5 py-6 text-center">
                    <p className="text-sm font-medium text-silver-300">
                      Anmeldung erfasst.
                    </p>
                    <p className="mt-2 text-sm text-silver-500">
                      Die Kontoverwaltung wird bald aktiviert — danke für deine
                      Geduld.
                    </p>
                    <Link
                      href="/"
                      className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full border border-silver-400/45 px-6 text-sm font-semibold text-silver-300 transition hover:border-silver-300/70 hover:text-white"
                    >
                      Zur Startseite
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="mt-10 space-y-5">
                    <div>
                      <label
                        htmlFor="login-email"
                        className="mb-2 block text-xs font-semibold uppercase tracking-widest text-silver-600"
                      >
                        E-Mail
                      </label>
                      <input
                        id="login-email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="du@email.ch"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <label
                          htmlFor="login-password"
                          className="text-xs font-semibold uppercase tracking-widest text-silver-600"
                        >
                          Passwort
                        </label>
                        <Link
                          href="/login"
                          className="text-xs text-silver-500 transition hover:text-silver-300"
                        >
                          Passwort vergessen?
                        </Link>
                      </div>
                      <input
                        id="login-password"
                        name="password"
                        type="password"
                        required
                        autoComplete="current-password"
                        placeholder="••••••••"
                        className={inputClass}
                      />
                    </div>

                    <label className="flex cursor-pointer items-center gap-3 text-sm text-silver-500">
                      <input
                        type="checkbox"
                        name="remember"
                        className="h-4 w-4 rounded border-silver-500/50 bg-white/[0.06] text-silver-400 accent-silver-400"
                      />
                      Angemeldet bleiben
                    </label>

                    <button
                      type="submit"
                      className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-white text-sm font-semibold text-iron-950 transition hover:bg-silver-300"
                    >
                      Anmelden
                    </button>
                  </form>
                )}

                {!submitted && (
                  <p className="mt-8 border-t border-white/[0.08] pt-8 text-center text-sm text-silver-500">
                    Noch kein Konto?{" "}
                    <Link
                      href="/#contact"
                      className="font-semibold text-silver-300 transition hover:text-white"
                    >
                      Konto erstellen
                    </Link>
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
