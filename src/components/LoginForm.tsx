"use client";

import { Suspense } from "react";
import { AuthCardShell } from "@/components/customer/AuthCardShell";
import { CustomerLoginForm } from "@/components/customer/CustomerLoginForm";

export function LoginForm() {
  return (
    <AuthCardShell
      eyebrow="Account cliente"
      subtitle="Accedi per vedere ordini e gestire il tuo profilo IronGym."
    >
      <Suspense fallback={<p className="mt-10 text-center text-sm text-silver-500">Caricamento…</p>}>
        <CustomerLoginForm />
      </Suspense>
    </AuthCardShell>
  );
}
