import Image from "next/image";
import { Reveal } from "./Reveal";

const founders = [
  {
    name: "Irfan Mahmuti",
    role: "Co-founder",
    photoSrc: "/founders/irfan.png",
  },
  {
    name: "Arxhend Isenaj",
    role: "Co-founder",
    photoSrc: "/founders/arxhend.png",
  },
] as const;

export function AboutUs() {
  return (
    <section className="border-b border-white/[0.06] py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-silver-600">
              About us
            </p>
            <h1 className="mt-3 font-display ig-title-shimmer text-4xl tracking-wide sm:text-5xl lg:text-6xl">
              Built by two. For everyone who trains.
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-silver-500">
              IronGym is led by co-founders who live the same standard we design
              into every piece — discipline first, noise never.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 sm:gap-10 lg:mt-16 lg:gap-12">
          {founders.map((f, i) => (
            <Reveal key={f.name} delay={i * 0.06}>
              <div className="ig-tilt-wrap">
                <article className="ig-tilt group flex flex-col rounded-3xl">
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-t-3xl bg-iron-950">
                    <Image
                      src={f.photoSrc}
                      alt={f.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover object-center transition duration-500 ease-out"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1a1a22]/95 via-transparent to-transparent opacity-90" />
                  </div>
                  <div className="ig-card-inner rounded-b-3xl border-t border-silver-500/20 px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-11">
                    <h2 className="font-display ig-title-shimmer text-3xl tracking-wide sm:text-4xl lg:text-[2.75rem] lg:leading-none">
                      {f.name}
                    </h2>
                    <p className="mt-3 text-sm font-semibold uppercase tracking-[0.28em] text-silver-500 sm:text-base">
                      {f.role}
                    </p>
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
