import { Reveal } from "./Reveal";

const features = [
  {
    title: "Premium Materials",
    body: "Technical blends with a cold, tactile finish — built to last rep after rep.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
        <path
          d="M12 3 4 7v5c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V7l-8-4Z"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinejoin="round"
        />
        <path
          d="m9 12 2 2 4-4"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Athletic Fit",
    body: "Patterned for shoulders and hips — mobility where you need it, structure where it counts.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
        <path
          d="M7 21h10M12 3v18M5 9l7-6 7 6"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Built for Training",
    body: "Anti-chafe zones, stable waistbands, fabrics that don’t quit on heavy days.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
        <path
          d="M4 19h16M6 19V8l6-3 6 3v11"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 12h4v7h-4z"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Minimal Streetwear Look",
    body: "Understated silhouettes that pair with steel, concrete and night runs home.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
        <path
          d="M4 7h16v10H4z"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinejoin="round"
        />
        <path
          d="M8 11h8M8 14h5"
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export function Features() {
  return (
    <section className="border-b border-white/[0.06] py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-silver-600">
              Engineering
            </p>
            <h2 className="mt-3 font-display text-4xl tracking-wide text-silver-300 sm:text-5xl">
              No noise. Only signal.
            </h2>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.05}>
              <div className="group flex h-full gap-5 rounded-2xl border border-silver-600/28 bg-iron-900/35 p-6 transition duration-500 hover:border-silver-400/50 hover:bg-iron-900/55 hover:shadow-[0_0_40px_rgba(0,0,0,0.35)] sm:p-7">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-silver-500/35 bg-white/[0.03] text-silver-400 transition group-hover:border-silver-300/45 group-hover:text-silver-300">
                  {f.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-silver-300">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-silver-600">
                    {f.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
