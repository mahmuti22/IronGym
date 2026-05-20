import Link from "next/link";
import { Reveal } from "./Reveal";

const products = [
  {
    name: "IronGym Oversized Tee",
    desc: "Relaxed drape, heavy hand-feel, zero distraction seams.",
    price: "CHF 49",
    tone: "from-zinc-800/80 to-iron-950",
  },
  {
    name: "Performance Stringer",
    desc: "Racer back, sweat-wicking body, cut for serious volume.",
    price: "CHF 39",
    tone: "from-zinc-900/90 to-iron-950",
  },
  {
    name: "Heavyweight Hoodie",
    desc: "Dense fleece, structured hood, cold-gym warmth.",
    price: "CHF 119",
    tone: "from-neutral-900/85 to-iron-950",
  },
  {
    name: "Training Shorts",
    desc: "7” inseam, bonded hem, locked-in waist for heavy sets.",
    price: "CHF 69",
    tone: "from-stone-900/80 to-iron-950",
  },
];

export function ProductSection() {
  return (
    <section
      id="collection"
      className="border-b border-white/[0.06] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-silver-600">
              Drop 01
            </p>
            <h2 className="mt-3 font-display text-4xl tracking-wide text-silver-300 sm:text-5xl">
              IronGym Collection
            </h2>
            <p className="mt-4 text-silver-500">
              Four core pieces engineered for training — minimal outside the gym,
              uncompromising inside it.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.06}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-silver-600/30 bg-iron-900/40 p-[1px] shadow-[0_24px_80px_rgba(0,0,0,0.45)] transition duration-500 hover:border-silver-400/55 hover:shadow-[0_0_0_1px_rgba(214,214,214,0.12),0_28px_90px_rgba(0,0,0,0.55)]">
                <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-iron-900/80">
                  <div
                    className={`relative aspect-[4/5] overflow-hidden bg-gradient-to-br ${p.tone}`}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(214,214,214,0.14),transparent_55%)] opacity-80 transition group-hover:opacity-100" />
                    <div className="absolute inset-0 opacity-25 [background-image:repeating-linear-gradient(-18deg,rgba(255,255,255,0.05)_0_1px,transparent_1px_10px)]" />
                    <div className="absolute bottom-4 left-4 rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-silver-500 backdrop-blur">
                      IronGym Lab
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-lg font-semibold tracking-tight text-silver-300 transition group-hover:text-white">
                      {p.name}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-silver-600">
                      {p.desc}
                    </p>
                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
                      <span className="text-sm font-semibold text-silver-400">
                        {p.price}
                      </span>
                      <Link
                        href="#collection"
                        className="inline-flex items-center justify-center rounded-full border border-silver-500/40 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-silver-300 transition hover:border-silver-300/60 hover:bg-white/[0.08] hover:text-white"
                      >
                        View Product
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
