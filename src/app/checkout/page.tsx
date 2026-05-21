import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CheckoutPageClient } from "@/components/checkout/CheckoutPageClient";
import { profileToCheckoutForm } from "@/lib/customer/profile";
import { fetchCustomerProfile } from "@/lib/customer/auth-check";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isStripeConfigured } from "@/lib/payments/stripe-config";

export const metadata: Metadata = {
  title: "Checkout | IronGym",
  description: "Completa il tuo ordine IronGym.",
};

export default async function CheckoutPage() {
  let initialForm = undefined;

  const supabase = await createServerSupabaseClient();
  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user?.email) {
      const { profile } = await fetchCustomerProfile(supabase, user.id);
      if (profile) {
        initialForm = profileToCheckoutForm(profile, user.email);
      }
    }
  }

  const stripeEnabled = isStripeConfigured();

  return (
    <>
      <Header />
      <main className="border-b border-white/[0.06] pt-20 pb-20 sm:pb-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold tracking-tight text-silver-100 sm:text-4xl">
            Checkout
          </h1>
          <p className="mt-2 text-sm text-silver-500">
            {stripeEnabled
              ? "Riepilogo ordine e pagamento sicuro con Stripe."
              : "Riepilogo ordine e dati di spedizione — pagamento online non configurato."}
          </p>
          <div className="mt-10">
            <CheckoutPageClient
              initialForm={initialForm}
              stripeEnabled={stripeEnabled}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
