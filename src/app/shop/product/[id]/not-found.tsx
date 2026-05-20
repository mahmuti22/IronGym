import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function ProductNotFound() {
  return (
    <>
      <Header />
      <main className="flex min-h-[60dvh] flex-col items-center justify-center px-4 pt-24 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-silver-600">
          404
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-silver-200">
          Prodotto non trovato
        </h1>
        <p className="mt-4 max-w-md text-silver-500">
          Questo articolo non esiste nel catalogo IronGym.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-iron-950 transition hover:bg-silver-300"
        >
          Torna allo Shop
        </Link>
      </main>
      <Footer />
    </>
  );
}
