import { Reveal } from "./Reveal";

export function BrandStory() {
  return (
    <section
      id="about"
      className="border-b border-white/[0.06] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-silver-600">
              Why IronGym?
            </p>
            <h2 className="mt-3 font-display text-4xl tracking-wide text-silver-300 sm:text-5xl">
              Discipline in every stitch.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-silver-500">
              IronGym is built for people who train with discipline. Every piece
              is designed to move with you, stay durable and look sharp inside
              and outside the gym.
            </p>
            <dl className="mt-10 grid gap-6 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <div className="rounded-xl border border-silver-600/25 bg-white/[0.02] p-4">
                <dt className="text-[11px] font-semibold uppercase tracking-widest text-silver-600">
                  Durability
                </dt>
                <dd className="mt-2 text-sm text-silver-400">
                  Reinforced seams & abrasion-tested fabrics.
                </dd>
              </div>
              <div className="rounded-xl border border-silver-600/25 bg-white/[0.02] p-4">
                <dt className="text-[11px] font-semibold uppercase tracking-widest text-silver-600">
                  Aesthetic
                </dt>
                <dd className="mt-2 text-sm text-silver-400">
                  Dark-metal palette. No loud logos. Pure presence.
                </dd>
              </div>
              <div className="rounded-xl border border-silver-600/25 bg-white/[0.02] p-4">
                <dt className="text-[11px] font-semibold uppercase tracking-widest text-silver-600">
                  Performance
                </dt>
                <dd className="mt-2 text-sm text-silver-400">
                  Moisture control & stretch mapped to real lifts.
                </dd>
              </div>
            </dl>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="metal-border relative overflow-hidden rounded-2xl bg-gradient-to-br from-iron-850 to-iron-950 p-8 sm:p-10">
              <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full border border-silver-500/15" />
              <div className="absolute -bottom-16 left-8 h-56 w-56 rounded-full bg-steel-400/5 blur-3xl" />
              <div className="relative space-y-6">
                <div className="flex items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-silver-600">
                      Brand code
                    </p>
                    <p className="mt-2 font-display text-4xl text-white">IRON</p>
                  </div>
                  <div className="rounded-xl border border-silver-500/30 bg-black/40 px-4 py-3 text-right backdrop-blur">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-silver-600">
                      Series
                    </p>
                    <p className="mt-1 text-sm font-semibold text-silver-300">
                      Midnight Alloy
                    </p>
                  </div>
                </div>
                <blockquote className="text-base italic leading-relaxed text-silver-500">
                  “Train like it&apos;s private. Look like it&apos;s public.”
                </blockquote>
                <div className="flex flex-wrap gap-2">
                  {["Zürich", "Basel", "Geneva"].map((city) => (
                    <span
                      key={city}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-silver-500"
                    >
                      {city}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
