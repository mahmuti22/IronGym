import Link from "next/link";

export default function AccountPage() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Link
        href="/account/orders"
        className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-white/20 hover:bg-white/[0.06]"
      >
        <h2 className="text-lg font-semibold text-silver-100">I miei ordini</h2>
        <p className="mt-2 text-sm text-silver-500">
          Storico ordini, stato spedizione e dettagli acquisti.
        </p>
      </Link>
      <Link
        href="/account/profile"
        className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-white/20 hover:bg-white/[0.06]"
      >
        <h2 className="text-lg font-semibold text-silver-100">Profilo</h2>
        <p className="mt-2 text-sm text-silver-500">
          Nome, contatti e indirizzo predefinito per il checkout.
        </p>
      </Link>
      <Link
        href="/shop"
        className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-white/20 hover:bg-white/[0.06] sm:col-span-2"
      >
        <h2 className="text-lg font-semibold text-silver-100">Continua lo shopping</h2>
        <p className="mt-2 text-sm text-silver-500">
          Scopri la collezione IronGym.
        </p>
      </Link>
    </div>
  );
}
