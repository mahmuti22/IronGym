"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getAdminAuthErrorMessage } from "@/lib/admin/auth-messages";
import {
  fetchAdminProfile,
  logAdminAuthDebug,
  logSupabaseProjectDebug,
} from "@/lib/admin/auth-check";
import { adminBtnPrimaryClass, adminInputClass, adminLabelClass } from "./admin-ui";
import { PasswordInput } from "@/components/ui/PasswordInput";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabaseReady = isSupabaseConfigured();

  useEffect(() => {
    logSupabaseProjectDebug();
  }, []);

  useEffect(() => {
    if (queryError) {
      setError(getAdminAuthErrorMessage(queryError));
    }
  }, [queryError]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!supabaseReady) {
      setError(getAdminAuthErrorMessage("supabase_not_configured"));
      return;
    }

    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      setError(getAdminAuthErrorMessage("supabase_not_configured"));
      return;
    }

    setSubmitting(true);
    logSupabaseProjectDebug();

    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

    logAdminAuthDebug("login signInWithPassword", {
      userId: signInData.user?.id ?? null,
      userEmail: signInData.user?.email ?? null,
      session: signInData.session
        ? {
            expires_at: signInData.session.expires_at,
            user_id: signInData.session.user.id,
          }
        : null,
      signInError: signInError
        ? { message: signInError.message, code: signInError.code }
        : null,
    });

    if (signInError) {
      setSubmitting(false);
      setError(
        signInError.message.toLowerCase().includes("invalid")
          ? getAdminAuthErrorMessage("invalid_credentials")
          : signInError.message
      );
      return;
    }

    const user = signInData.user;
    if (!user) {
      setSubmitting(false);
      setError(getAdminAuthErrorMessage("invalid_credentials"));
      return;
    }

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    logAdminAuthDebug("login getSession after signIn", {
      userId: session?.user?.id ?? null,
      userEmail: session?.user?.email ?? null,
      sessionError: sessionError?.message ?? null,
    });

    if (!session) {
      setSubmitting(false);
      setError(
        "Sessione non disponibile dopo il login. Ricarica la pagina e riprova."
      );
      return;
    }

    const { isAdmin, profile, error: profileError } = await fetchAdminProfile(
      supabase,
      user.id,
      "login form"
    );

    logAdminAuthDebug("login admin_profiles result", {
      isAdmin,
      profile,
      profileError: profileError
        ? {
            code: profileError.code,
            message: profileError.message,
            details: profileError.details,
          }
        : null,
    });

    if (profileError || !isAdmin) {
      await supabase.auth.signOut();
      setSubmitting(false);
      setError(getAdminAuthErrorMessage("access_denied"));
      return;
    }

    // Sync auth cookies to server before navigating to protected routes.
    router.refresh();
    router.replace("/admin");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {!supabaseReady && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          {getAdminAuthErrorMessage("supabase_not_configured")}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div>
        <label className={adminLabelClass} htmlFor="admin-email">
          Email
        </label>
        <input
          id="admin-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={adminInputClass}
          placeholder="admin@irongym.ch"
          disabled={!supabaseReady || submitting}
        />
      </div>

      <div>
        <label className={adminLabelClass} htmlFor="admin-password">
          Password
        </label>
        <PasswordInput
          id="admin-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          inputClassName={adminInputClass}
          placeholder="••••••••"
          disabled={!supabaseReady || submitting}
        />
      </div>

      <button
        type="submit"
        disabled={!supabaseReady || submitting}
        className={`${adminBtnPrimaryClass} w-full min-h-12 disabled:cursor-not-allowed disabled:opacity-50`}
      >
        {submitting ? "Accesso in corso…" : "Accedi al pannello"}
      </button>
    </form>
  );
}
