import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CheckoutCancelClient } from "@/components/checkout/CheckoutCancelClient";

export const metadata: Metadata = {
  title: "Pagamento annullato | IronGym",
  description: "Pagamento ordine annullato.",
};

type PageProps = {
  searchParams: Promise<{ order?: string }>;
};

export default async function CheckoutCancelPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const orderId = params.order?.trim() || null;

  return (
    <>
      <Header />
      <main className="border-b border-white/[0.06] pt-20 pb-20 sm:pb-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <CheckoutCancelClient orderId={orderId} />
        </div>
      </main>
      <Footer />
    </>
  );
}
