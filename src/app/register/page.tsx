import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AuthCardShell } from "@/components/customer/AuthCardShell";
import { CustomerRegisterForm } from "@/components/customer/CustomerRegisterForm";

export const metadata: Metadata = {
  title: "Registrati | IronGym",
  description: "Crea il tuo account cliente IronGym.",
};

export default function RegisterPage() {
  return (
    <>
      <Header />
      <main>
        <AuthCardShell
          eyebrow="Nuovo account"
          subtitle="Registrati per ordinare più velocemente e seguire i tuoi ordini."
        >
          <Suspense
            fallback={
              <p className="mt-10 text-center text-sm text-silver-500">
                Caricamento…
              </p>
            }
          >
            <CustomerRegisterForm />
          </Suspense>
        </AuthCardShell>
      </main>
      <Footer />
    </>
  );
}
