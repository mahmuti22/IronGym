"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  getCustomerAuthErrorMessage,
  getSignUpErrorMessage,
} from "@/lib/customer/auth-messages";
import { upsertCustomerProfile } from "@/lib/customer/profile";
import { logCustomerRegisterDebug } from "@/lib/customer/register-debug";
import { PasswordInput } from "@/components/ui/PasswordInput";

const inputClass =
  "min-h-12 w-full rounded-xl border border-silver-400/45 bg-white/[0.08] px-4 text-sm text-silver-200 outline-none placeholder:text-silver-600 focus:border-silver-300/65 focus:bg-white/[0.12]";

export function CustomerRegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryError = searchParams.get("error");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmEmailMessage, setConfirmEmailMessage] = useState(false);

  useEffect(() => {
    if (queryError) {
      setError(getCustomerAuthErrorMessage(queryError));
    }
  }, [queryError]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setConfirmEmailMessage(false);

    if (password.length < 6) {
      setError(getCustomerAuthErrorMessage("weak_password"));
      return;
    }

    if (password !== confirmPassword) {
      setError(getCustomerAuthErrorMessage("confirm_mismatch"));
      return;
    }

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

    const trimmedEmail = email.trim();

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
      options: {
        emailRedirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/login`
            : undefined,
        data: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
        },
      },
    });

    const user = data?.user ?? null;
    const session = data?.session ?? null;

    logCustomerRegisterDebug("signUp result", {
      userId: user?.id ?? null,
      userEmail: user?.email ?? trimmedEmail,
      sessionExists: Boolean(session),
      signUpError: signUpError
        ? { code: signUpError.code, message: signUpError.message }
        : null,
      identitiesCount: user?.identities?.length ?? 0,
    });

    if (signUpError) {
      setSubmitting(false);
      logCustomerRegisterDebug("signUp failed", {
        code: signUpError.code,
        message: signUpError.message,
      });
      setError(getSignUpErrorMessage(signUpError));
      return;
    }

    // Conferma email attiva: spesso user/session sono null senza errore
    if (!session) {
      setSubmitting(false);
      setConfirmEmailMessage(true);
      logCustomerRegisterDebug(
        "email confirmation required — profile via DB trigger or after login",
        { userId: user?.id ?? null }
      );
      return;
    }

    if (!user) {
      setSubmitting(false);
      setError(
        "Registrazione avviata ma sessione non disponibile. Prova ad accedere da /login."
      );
      logCustomerRegisterDebug("session without user — unexpected", { data });
      return;
    }

    const profileRes = await upsertCustomerProfile(supabase, {
      userId: user.id,
      email: user.email ?? trimmedEmail,
      firstName,
      lastName,
    });

    logCustomerRegisterDebug("customer_profiles upsert", {
      ok: profileRes.ok,
      code: profileRes.code ?? null,
      error: profileRes.error ?? null,
    });

    if (!profileRes.ok) {
      await supabase.auth.signOut();
      setSubmitting(false);
      setError(
        profileRes.error ??
          "Account creato ma profilo non salvato. Contatta il supporto."
      );
      return;
    }

    setSubmitting(false);
    router.refresh();
    router.replace("/account");
  }

  if (confirmEmailMessage) {
    return (
      <div className="mt-10 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-5 py-6 text-center">
        <p className="text-sm font-medium text-emerald-200">
          {getCustomerAuthErrorMessage("email_confirm")}
        </p>
        <p className="mt-2 text-sm text-silver-500">
          Dopo la conferma potrai accedere da Login con la tua email e password.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full border border-silver-400/45 px-6 text-sm font-semibold text-silver-300 transition hover:border-silver-300/70 hover:text-white"
        >
          Vai al login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-5">
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-silver-600">
            Nome
          </label>
          <input
            type="text"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={inputClass}
            disabled={submitting}
          />
        </div>
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-silver-600">
            Cognome
          </label>
          <input
            type="text"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={inputClass}
            disabled={submitting}
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-silver-600">
          Email
        </label>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
          disabled={submitting}
        />
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-silver-600">
          Password
        </label>
        <PasswordInput
          id="register-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          inputClassName={inputClass}
          disabled={submitting}
        />
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-silver-600">
          Conferma password
        </label>
        <PasswordInput
          id="register-password-confirm"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          inputClassName={inputClass}
          disabled={submitting}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-white text-sm font-semibold text-iron-950 transition hover:bg-silver-300 disabled:opacity-50"
      >
        {submitting ? "Creazione account…" : "Crea account"}
      </button>

      <p className="border-t border-white/[0.08] pt-6 text-center text-sm text-silver-500">
        Hai già un account?{" "}
        <Link
          href="/login"
          className="font-semibold text-silver-300 transition hover:text-white"
        >
          Accedi
        </Link>
      </p>
    </form>
  );
}
