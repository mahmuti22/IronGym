"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCustomerAuthErrorMessage } from "@/lib/customer/auth-messages";
import { fetchCustomerProfile } from "@/lib/customer/auth-check";
import { checkIsAdmin } from "@/lib/admin/auth-check";
import { upsertCustomerProfile } from "@/lib/customer/profile";
import { logCustomerRegisterDebug } from "@/lib/customer/register-debug";
import { PasswordInput } from "@/components/ui/PasswordInput";

const inputClass =
  "min-h-12 w-full rounded-xl border border-silver-400/45 bg-white/[0.08] px-4 text-sm text-silver-200 outline-none placeholder:text-silver-600 focus:border-silver-300/65 focus:bg-white/[0.12]";

export function CustomerLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (queryError) {
      setError(getCustomerAuthErrorMessage(queryError));
    }
  }, [queryError]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isSupabaseConfigured()) {
      setError(getCustomerAuthErrorMessage("supabase_not_configured"));
      return;
    }

    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      setError(getCustomerAuthErrorMessage("supabase_not_configured"));
      return;
    }

    setSubmitting(true);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setSubmitting(false);
      setError(
        signInError.message.toLowerCase().includes("invalid")
          ? getCustomerAuthErrorMessage("invalid_credentials")
          : signInError.message
      );
      return;
    }

    const user = data.user;
    if (!user) {
      setSubmitting(false);
      setError(getCustomerAuthErrorMessage("invalid_credentials"));
      return;
    }

    const isAdmin = await checkIsAdmin(supabase, user.id);
    let { hasProfile } = await fetchCustomerProfile(supabase, user.id);

    if (isAdmin && !hasProfile) {
      setSubmitting(false);
      router.refresh();
      router.replace("/admin");
      return;
    }

    if (!hasProfile) {
      const meta = user.user_metadata as Record<string, unknown> | undefined;
      const profileRes = await upsertCustomerProfile(supabase, {
        userId: user.id,
        email: user.email ?? email.trim(),
        firstName: String(meta?.first_name ?? ""),
        lastName: String(meta?.last_name ?? ""),
      });

      logCustomerRegisterDebug("login profile upsert (was missing)", {
        ok: profileRes.ok,
        code: profileRes.code ?? null,
        error: profileRes.error ?? null,
      });

      if (!profileRes.ok) {
        setSubmitting(false);
        setError(
          profileRes.error ??
            getCustomerAuthErrorMessage("profile_missing")
        );
        return;
      }

      hasProfile = true;
    }

    router.refresh();
    router.replace("/account");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-5">
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="login-email"
          className="mb-2 block text-xs font-semibold uppercase tracking-widest text-silver-600"
        >
          Email
        </label>
        <input
          id="login-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.ch"
          className={inputClass}
          disabled={submitting}
        />
      </div>

      <div>
        <label
          htmlFor="login-password"
          className="mb-2 block text-xs font-semibold uppercase tracking-widest text-silver-600"
        >
          Password
        </label>
        <PasswordInput
          id="login-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          inputClassName={inputClass}
          placeholder="••••••••"
          disabled={submitting}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-white text-sm font-semibold text-iron-950 transition hover:bg-silver-300 disabled:opacity-50"
      >
        {submitting ? "Accesso…" : "Accedi"}
      </button>

      <p className="border-t border-white/[0.08] pt-6 text-center text-sm text-silver-500">
        Non hai un account?{" "}
        <Link
          href="/register"
          className="font-semibold text-silver-300 transition hover:text-white"
        >
          Registrati
        </Link>
      </p>
    </form>
  );
}
