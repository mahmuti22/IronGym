import Link from "next/link";

const social = [
  { href: "https://instagram.com", label: "Instagram" },
  { href: "https://tiktok.com", label: "TikTok" },
  { href: "#contact", label: "Contact" },
  { href: "#", label: "Privacy" },
];

export function Footer() {
  return (
    <footer className="py-12 sm:py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div>
          <Link
            href="#home"
            className="text-xl font-bold tracking-tight text-silver-200 transition hover:text-white sm:text-2xl"
          >
            Iron<span className="text-silver-500">Gym</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm text-silver-600">
            Swiss-minded gym wear — dark, precise, made to earn its place in your
            rotation.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-silver-500">
          {social.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className="transition hover:text-silver-300"
            >
              {s.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mx-auto mt-10 max-w-6xl border-t border-white/[0.06] px-4 pt-8 text-center text-xs text-silver-600 sm:px-6 sm:text-left lg:px-8">
        <p>© 2026 IronGym. All rights reserved.</p>
      </div>
    </footer>
  );
}
