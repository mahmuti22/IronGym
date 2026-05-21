"use client";

import type { ReactNode } from "react";
import { Reveal } from "@/components/Reveal";
import { IronGymMark } from "@/components/IronGymMark";

type AuthCardShellProps = {
  eyebrow: string;
  title?: string;
  subtitle: string;
  children: ReactNode;
};

export function AuthCardShell({
  eyebrow,
  title,
  subtitle,
  children,
}: AuthCardShellProps) {
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
                    {eyebrow}
                  </p>
                  <h1 className="mt-3 text-3xl leading-[1.15] tracking-tight sm:text-4xl">
                    {title ? (
                      <span className="text-silver-200">{title}</span>
                    ) : (
                      <IronGymMark shimmer className="text-3xl sm:text-4xl" />
                    )}
                  </h1>
                  <p className="mt-3 text-sm text-silver-500">{subtitle}</p>
                </div>
                {children}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
