import Link from "next/link";
import { IronGymMark } from "./IronGymMark";

type FooterLink = { href: string; label: string };

const columns: { title: string; links: FooterLink[] }[] = [
  {
    title: "Kundenservice",
    links: [
      { href: "/#contact", label: "Häufig gestellte Fragen" },
      { href: "/#contact", label: "Rücksendung & Umtausch" },
      { href: "/#contact", label: "Zahlung" },
      { href: "/#contact", label: "Versand & Lieferung" },
      { href: "/#contact", label: "Kontakt" },
      { href: "/shop", label: "Grössentabelle" },
    ],
  },
  {
    title: "IronGym für dich",
    links: [
      { href: "/#contact", label: "Mitgliedervorteile" },
      { href: "/login", label: "Mein Konto" },
      { href: "/#contact", label: "Studentenrabatt" },
      { href: "/#contact", label: "Newsletter" },
    ],
  },
  {
    title: "Stores",
    links: [
      { href: "/#contact", label: "Filialfinder" },
      { href: "/#contact", label: "Zürich" },
      { href: "/#contact", label: "Basel" },
      { href: "/#contact", label: "Genf" },
    ],
  },
  {
    title: "Über IronGym",
    links: [
      { href: "/about", label: "Unsere Geschichte" },
      { href: "/about", label: "Nachhaltigkeit" },
      { href: "/about", label: "Stellenangebote" },
      { href: "/about", label: "Co-Founder" },
    ],
  },
];

const legal: FooterLink[] = [
  { href: "/#contact", label: "Allgemeine Geschäftsbedingungen" },
  { href: "/#contact", label: "Datenschutz und Cookie-Erklärung" },
  { href: "/#contact", label: "Cookie-Einstellungen" },
  { href: "/#contact", label: "Barrierefreiheit" },
];

const social = [
  { href: "https://facebook.com", label: "Facebook", icon: IconFacebook },
  { href: "https://instagram.com", label: "Instagram", icon: IconInstagram },
  { href: "https://tiktok.com", label: "TikTok", icon: IconTikTok },
  { href: "https://pinterest.com", label: "Pinterest", icon: IconPinterest },
  { href: "https://youtube.com", label: "YouTube", icon: IconYouTube },
] as const;

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-white">
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-[13px] leading-snug text-silver-500 transition hover:text-silver-300"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-iron-850 text-silver-400">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
        {/* Top: link columns + large logo */}
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
          <div className="grid flex-1 grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-10 md:grid-cols-4 lg:max-w-3xl lg:gap-x-8 xl:max-w-4xl">
            {columns.map((col) => (
              <FooterColumn key={col.title} title={col.title} links={col.links} />
            ))}
          </div>

          <Link
            href="/"
            className="group shrink-0 self-start lg:self-center"
            aria-label="IronGym — Home"
          >
            <IronGymMark
              shimmer
              className="block text-[clamp(3.25rem,14vw,9rem)] text-white transition group-hover:opacity-90"
            />
          </Link>
        </div>

        <div className="my-10 h-px bg-white/[0.12] sm:my-12" />

        {/* Row: social · locale · payments */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
          <div className="flex flex-wrap items-center gap-5">
            {social.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-white transition hover:text-silver-400"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>

          <button
            type="button"
            className="inline-flex w-fit items-center gap-2 text-[13px] text-silver-400 transition hover:text-silver-300"
            aria-haspopup="listbox"
            aria-label="Sprache und Region"
          >
            <IconGlobe className="h-4 w-4 shrink-0" />
            <span>Schweiz / Deutsch</span>
            <IconChevron className="h-3 w-3 shrink-0 opacity-70" />
          </button>

          <div
            className="flex flex-wrap items-center gap-2 sm:gap-2.5 lg:justify-end"
            aria-label="Zahlungsmethoden"
          >
            <PaymentBadge label="Mastercard">
              <IconMastercard />
            </PaymentBadge>
            <PaymentBadge label="Visa">
              <IconVisa />
            </PaymentBadge>
            <PaymentBadge label="American Express">
              <IconAmex />
            </PaymentBadge>
            <PaymentBadge label="PayPal">
              <IconPayPal />
            </PaymentBadge>
            <PaymentBadge label="Klarna">
              <IconKlarna />
            </PaymentBadge>
            <PaymentBadge label="Google Pay">
              <IconGooglePay />
            </PaymentBadge>
            <PaymentBadge label="Apple Pay">
              <IconApplePay />
            </PaymentBadge>
            <PaymentBadge label="TWINT">
              <IconTwint />
            </PaymentBadge>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-6 border-t border-white/[0.08] pt-8 sm:mt-12 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <div className="space-y-4">
            <p className="text-[12px] text-silver-600">
              © 2026 IronGym. Alle Rechte vorbehalten.
            </p>
            <nav className="flex flex-wrap gap-x-4 gap-y-2">
              {legal.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-[12px] text-silver-600 underline-offset-2 transition hover:text-silver-400 hover:underline"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <p className="shrink-0 font-display text-2xl tracking-wide text-white sm:text-3xl">
            Own every rep.
          </p>
        </div>
      </div>
    </footer>
  );
}

function PaymentBadge({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <span
      title={label}
      className="inline-flex h-7 min-w-[2.75rem] items-center justify-center rounded bg-white px-1.5"
    >
      {children}
    </span>
  );
}

function IconGlobe({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.8 4 6.2 4 9s-1.5 6.2-4 9M12 3c-2.5 2.8-4 6.2-4 9s1.5 6.2 4 9" />
    </svg>
  );
}

function IconChevron({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M2.5 4.5 6 8l3.5-3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconFacebook({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.027 4.388 11.023 10.125 11.91v-8.41H7.078v-3.5h3.047V9.413c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97H16.4c-1.491 0-1.956.93-1.956 1.886v2.26h3.328l-.532 3.5h-2.796v8.41C19.612 23.096 24 18.1 24 12.073z" />
    </svg>
  );
}

function IconInstagram({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function IconTikTok({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" />
    </svg>
  );
}

function IconPinterest({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.403.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
    </svg>
  );
}

function IconYouTube({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function IconMastercard() {
  return (
    <svg viewBox="0 0 38 24" className="h-4 w-auto" aria-hidden>
      <circle cx="15" cy="12" r="7" fill="#EB001B" />
      <circle cx="23" cy="12" r="7" fill="#F79E1B" />
      <path d="M19 7.5a7 7 0 010 9 7 7 0 000-9z" fill="#FF5F00" />
    </svg>
  );
}

function IconVisa() {
  return (
    <svg viewBox="0 0 38 24" className="h-3.5 w-auto" aria-hidden>
      <path fill="#1A1F71" d="M16.2 15.5h-2.9l1.8-9h2.9l-1.8 9zm9.5-8.8c-.6-.2-1.5-.5-2.6-.5-2.9 0-4.9 1.5-4.9 3.7 0 1.6 1.5 2.5 2.6 3 1.1.5 1.5.8 1.5 1.3 0 .7-.9 1-1.7 1-1.1 0-1.7-.2-2.6-.6l-.4-.2-.4 2.5c.7.3 2 .6 3.3.6 3.1 0 5.1-1.5 5.1-3.8 0-1.3-.8-2.2-2.5-3-.9-.5-1.5-.8-1.5-1.3 0-.4.5-.9 1.6-.9.9 0 1.6.2 2.1.4l.3.1.4-2.4zm7.2-.2h-2.2c-.7 0-1.2.2-1.5 1l-4.2 8h3l.6-1.6h3.7l.3 1.6h2.6l-2.3-9zm-3.7 5.8l1.5-4.1.8 4.1h-2.3zM12 6.7L9.4 15.5H6.5l1.3-8.8h2.2z" />
    </svg>
  );
}

function IconAmex() {
  return (
    <svg viewBox="0 0 38 24" className="h-3.5 w-auto" aria-hidden>
      <rect width="38" height="24" rx="2" fill="#016FD0" />
      <path fill="#fff" d="M8.5 14.5l1.2-7h2l-.5 2.8.9-2.8h1.9l-1.2 7h-2l.4-2.5-.9 2.5H9.8l.9-2.5-.5 2.5H8.5zm9.2-7h3.2c1.2 0 2 .8 2 2 0 1.5-1.1 2.3-2.5 2.3h-1.2l-.4 2.7h-2l1.9-7zm2.5 3.5c.5 0 .9-.3.9-.8 0-.6-.5-.8-1-.8h-.8l-.3 1.6h.2zm5.5-3.5l-1.9 7h2l.4-1h2.4l.2 1h2.1l-1.3-7h-2.2l-.3 1.6h-2.1l-.3-1.6h-2z" />
    </svg>
  );
}

function IconPayPal() {
  return (
    <svg viewBox="0 0 38 24" className="h-3.5 w-auto" aria-hidden>
      <path fill="#003087" d="M14 6h4.5c2.5 0 4 1.4 3.6 3.5-.4 2.4-2.4 3.5-4.8 3.5h-1.2l-.5 3h-2.4L14 6zm2.2 5.5h1c1.2 0 2.2-.7 2.4-2 .2-1.2-.6-2-1.9-2h-1.1l-.4 4z" />
      <path fill="#009CDE" d="M24 6h4.3c2 0 3.2 1 2.9 2.8-.3 1.5-1.4 2.2-2.8 2.2h-1l-.4 2.5h-2.2L24 6zm2 5h.9c.9 0 1.6-.5 1.7-1.4.1-.8-.5-1.3-1.4-1.3h-.9l-.3 2.7z" />
    </svg>
  );
}

function IconKlarna() {
  return (
    <svg viewBox="0 0 38 24" className="h-3 w-auto" aria-hidden>
      <path fill="#FFB3C7" d="M6 8h3v8H6V8zm5 0h2.5c2.8 0 4.5 1.6 4.5 4s-1.7 4-4.5 4H11V8zm2.3 6.2c1.4 0 2.2-.8 2.2-2.2S14.7 9.8 13.3 9.8H13v4.4h.3zm8-6.2h3l2.2 5.5L28.5 8h3l-4 8h-2.8l-2.2-5.3L20.5 16h-2.8l-4-8z" />
    </svg>
  );
}

function IconGooglePay() {
  return (
    <svg viewBox="0 0 38 24" className="h-3.5 w-auto" aria-hidden>
      <path fill="#5F6368" d="M8 12.2v-1.5h6.8c.1.4.1.8.1 1.2 0 1.5-.4 3.3-1.7 4.6-1.3 1.3-3 2-5.2 2-4.1 0-7.5-3.3-7.5-7.5S4.9 3.5 9 3.5c2.3 0 3.9.9 5.1 2.1l-1.4 1.4C11.8 6 10.5 5.3 9 5.3 5.9 5.3 3.5 7.7 3.5 10.8S5.9 16.3 9 16.3c2.3 0 3.6-.9 4.4-1.8.7-.7 1.1-1.7 1.3-3.1H9v-1.2H8z" />
      <path fill="#4285F4" d="M24.5 10.5h-5.8V8.8h7.5v1.3h-1.7v7.4h-1.5v-7.4z" />
      <path fill="#34A853" d="M30 14.2l2.2 1.5-1.3 2.4-2.5-1.7V14.2z" />
    </svg>
  );
}

function IconApplePay() {
  return (
    <svg viewBox="0 0 38 24" className="h-3.5 w-auto" aria-hidden>
      <path fill="#000" d="M11.2 6.8c-.7.8-1.8 1.4-2.9 1.3-.1-1.1.4-2.3 1-3.1.7-.9 1.9-1.5 2.8-1.6.1 1.2-.3 2.4-1 3.4zm.9 1.4c-1.6-.1-3 .9-3.8.9-.8 0-2-.9-3.3-.8-1.7 0-3.2 1-4 2.5-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3.1 2.4 1.2-.1 1.7-.8 3.2-.8 1.5 0 1.9.8 3.2.8 1.3 0 2.1-1.2 2.9-2.4 1-1.4 1.4-2.8 1.4-2.9-.1 0-2.8-1.1-2.8-4.3 0-2.7 2.2-4 2.3-4.1-1.2-1.8-3.1-2-3.8-2z" />
      <path fill="#000" d="M28 8.2h-2.5l-3 7.8h2.1l.6-1.6h2.9l.6 1.6h2.2L28 8.2zm-2.6 4.7l1-2.7 1 2.7h-2z" />
    </svg>
  );
}

function IconTwint() {
  return (
    <svg viewBox="0 0 38 24" className="h-3.5 w-auto" aria-hidden>
      <path fill="#000" d="M8 7h4l3 5 3-5h4l-5.5 9.5L26 17h-4l-3-5-3 5H12l5.5-9.5L8 7z" />
    </svg>
  );
}
