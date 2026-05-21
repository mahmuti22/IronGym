import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartPageClient } from "@/components/cart/CartPageClient";

export const metadata: Metadata = {
  title: "Carrello | IronGym",
  description: "Il tuo carrello IronGym — abbigliamento gym premium.",
};

export default function CartPage() {
  return (
    <>
      <Header />
      <main className="border-b border-white/[0.06] pt-20 pb-20 sm:pb-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold tracking-tight text-silver-100 sm:text-4xl">
            Carrello
          </h1>
          <p className="mt-2 text-sm text-silver-500">
            I tuoi articoli restano salvati in questo browser.
          </p>
          <div className="mt-10">
            <CartPageClient />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
