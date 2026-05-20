import Image from "next/image";
import { Reveal } from "./Reveal";

/** Swap `photoSrc` to e.g. `/founders/irfan.jpg` after adding files under `public/founders/`. */
const founders = [
  {
    name: "Irfan Mahmuti",
    role: "Co-founder",
    photoSrc: "/founders/irfan.svg",
  },
  {
    name: "Arxhend Isenaj",
    role: "Co-founder",
    photoSrc: "/founders/arxhend.svg",
  },
] as const;

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
            <h2 className="mt-3 font-display ig-title-shimmer text-4xl tracking-wide sm:text-5xl">
              Discipline in every stitch.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-silver-500">
              IronGym is built for people who train with discipline. Every piece
              is designed to move with you, stay durable and look sharp inside
              and outside the gym.
            </p>
            <dl className="mt-10 grid gap-6 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <div className="ig-tilt-wrap">
                <div className="ig-tilt-sm rounded-xl p-4">
                  <dt className="text-[11px] font-semibold uppercase tracking-widest text-silver-600">
                    Durability
                  </dt>
                  <dd className="mt-2 text-sm text-silver-400">
                    Reinforced seams & abrasion-tested fabrics.
                  </dd>
                </div>
              </div>
              <div className="ig-tilt-wrap">
                <div className="ig-tilt-sm rounded-xl p-4">
                  <dt className="text-[11px] font-semibold uppercase tracking-widest text-silver-600">
                    Aesthetic
                  </dt>
                  <dd className="mt-2 text-sm text-silver-400">
                    Dark-metal palette. No loud logos. Pure presence.
                  </dd>
                </div>
              </div>
              <div className="ig-tilt-wrap">
                <div className="ig-tilt-sm rounded-xl p-4">
                  <dt className="text-[11px] font-semibold uppercase tracking-widest text-silver-600">
                    Performance
                  </dt>
                  <dd className="mt-2 text-sm text-silver-400">
                    Moisture control & stretch mapped to real lifts.
                  </dd>
                </div>
              </div>
            </dl>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="ig-tilt-wrap">
              <div className="ig-tilt relative rounded-2xl p-8 sm:p-10">
                <div className="pointer-events-none absolute inset-0 ig-card-inner-muted opacity-90" />
                <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full border border-silver-400/25" />
                <div className="absolute -bottom-16 left-8 h-56 w-56 rounded-full bg-steel-400/8 blur-3xl" />
                <div className="relative space-y-6">
                  <div className="flex items-center justify-between gap-4 border-b border-silver-500/20 pb-6">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-silver-600">
                        Brand code
                      </p>
                      <p className="mt-2 font-display ig-title-shimmer text-4xl">IRON</p>
                    </div>
                    <div className="rounded-xl border border-silver-400/45 ig-card-inner px-4 py-3 text-right shadow-[0_0_0_1px_rgba(0,0,0,0.2)_inset] backdrop-blur">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-silver-600">
                        Series
                      </p>
                      <p className="mt-1 text-sm font-semibold text-silver-300">
                        Midnight Alloy
                      </p>
                    </div>
                  </div>
                  <blockquote className="text-base italic leading-relaxed text-silver-400">
                    “Train like it&apos;s private. Look like it&apos;s public.”
                  </blockquote>
                  <div className="flex flex-wrap gap-2">
                    {["Zürich", "Basel", "Geneva"].map((city) => (
                      <span
                        key={city}
                        className="rounded-full border border-silver-400/35 bg-white/[0.08] px-3 py-1 text-xs text-silver-400"
                      >
                        {city}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-20 border-t border-white/[0.06] pt-16 sm:mt-24 sm:pt-20">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-silver-600">
              About us
            </p>
            <h2 className="mt-3 font-display ig-title-shimmer text-4xl tracking-wide sm:text-5xl">
              Built by two. For everyone who trains.
            </h2>
            <p className="mt-4 text-silver-500">
              IronGym is led by co-founders who live the same standard we design
              into every piece — discipline first, noise never.
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 sm:gap-10 lg:gap-12">
            {founders.map((f) => (
              <div key={f.name} className="ig-tilt-wrap">
                <article className="ig-tilt group flex flex-col rounded-3xl">
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-t-3xl bg-iron-950">
                    <Image
                      src={f.photoSrc}
                      alt={f.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      unoptimized={f.photoSrc.endsWith(".svg")}
                      className="object-cover object-center transition duration-500 ease-out"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1a1a22]/95 via-transparent to-transparent opacity-90" />
                  </div>
                  <div className="ig-card-inner rounded-b-3xl border-t border-silver-500/20 px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-11">
                    <h3 className="font-display ig-title-shimmer text-3xl tracking-wide sm:text-4xl lg:text-[2.75rem] lg:leading-none">
                      {f.name}
                    </h3>
                    <p className="mt-3 text-sm font-semibold uppercase tracking-[0.28em] text-silver-500 sm:text-base">
                      {f.role}
                    </p>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
