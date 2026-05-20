import Image from "next/image";
import Link from "next/link";
import { Reveal } from "./Reveal";
import {
  CATALOG_STUDIO_MODEL_01,
  productImageFocusClasses,
} from "@/data/catalog";

const products = [
  {
    name: "IronGym Oversized Tee",
    desc: "Relaxed drape, heavy hand-feel, zero distraction seams.",
    price: "CHF 49",
    focusIndex: 0,
  },
  {
    name: "Performance Stringer",
    desc: "Racer back, sweat-wicking body, cut for serious volume.",
    price: "CHF 39",
    focusIndex: 1,
  },
  {
    name: "Heavyweight Hoodie",
    desc: "Dense fleece, structured hood, cold-gym warmth.",
    price: "CHF 119",
    focusIndex: 2,
  },
  {
    name: "Training Shorts",
    desc: "7” inseam, bonded hem, locked-in waist for heavy sets.",
    price: "CHF 69",
    focusIndex: 3,
  },
] as const;

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
            <h2 className="mt-3 text-4xl leading-[1.15] tracking-tight sm:text-5xl">
              <span className="ig-brand-wordmark ig-title-shimmer text-4xl sm:text-5xl">
                IronGym Collection
              </span>
            </h2>
            <p className="mt-4 text-silver-500">
              Four core pieces engineered for training — minimal outside the gym,
              uncompromising inside it.
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-flex text-sm font-semibold text-silver-300 transition hover:text-white"
            >
              Tutto l&apos;Abbigliamento Gym →
            </Link>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.06}>
              <div className="ig-tilt-wrap h-full">
                <article className="ig-tilt group relative flex h-full flex-col rounded-2xl">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-t-2xl bg-iron-950">
                    <Image
                      src={CATALOG_STUDIO_MODEL_01}
                      alt={`${p.name} — lookbook studio`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className={`object-cover ${productImageFocusClasses[p.focusIndex]}`}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/25" />
                    <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:repeating-linear-gradient(-18deg,rgba(255,255,255,0.04)_0_1px,transparent_1px_10px)]" />
                    <div className="absolute bottom-4 left-4 rounded-full border border-silver-500/35 bg-black/45 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-silver-300 backdrop-blur-md">
                      IronGym Lab
                    </div>
                  </div>
                  <div className="ig-card-inner flex flex-1 flex-col rounded-b-2xl border-t border-silver-500/15 p-5">
                    <h3 className="text-lg font-semibold tracking-tight text-silver-200 transition group-hover:text-white">
                      {p.name}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-silver-500">
                      {p.desc}
                    </p>
                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-silver-500/15 pt-4">
                      <span className="text-sm font-semibold text-silver-400">
                        {p.price}
                      </span>
                      <Link
                        href="/shop"
                        className="inline-flex items-center justify-center rounded-full border border-silver-400/45 bg-white/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-silver-200 transition hover:border-silver-300/70 hover:bg-white/[0.14] hover:text-white"
                      >
                        View Product
                      </Link>
                    </div>
                  </div>
                </article>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
