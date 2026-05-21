import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CheckoutPageClient } from "@/components/checkout/CheckoutPageClient";

export const metadata: Metadata = {
  title: "Checkout | IronGym",
  description: "Completa il tuo ordine IronGym.",
};

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <main className="border-b border-white/[0.06] pt-20 pb-20 sm:pb-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold tracking-tight text-silver-100 sm:text-4xl">
            Checkout
          </h1>
          <p className="mt-2 text-sm text-silver-500">
            Riepilogo ordine e dati di spedizione — pagamento non ancora attivo.
          </p>
          <div className="mt-10">
            <CheckoutPageClient />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
