import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Admin Login — IronGym",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-iron-950 px-4 py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_55%)]" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-silver-600">
            IronGym
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-silver-100">
            Admin Panel
          </h1>
          <p className="mt-2 text-sm text-silver-500">
            Accedi con le credenziali autorizzate
          </p>
        </div>

        <div className="rounded-2xl border border-silver-500/25 bg-white/[0.03] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-sm">
          <Suspense
            fallback={
              <p className="text-center text-sm text-silver-500">
                Caricamento…
              </p>
            }
          >
            <AdminLoginForm />
          </Suspense>
        </div>

        <p className="mt-6 text-center text-xs text-silver-600">
          Solo utenti presenti in{" "}
          <code className="text-silver-500">admin_profiles</code>
        </p>
      </div>
    </div>
  );
}
