"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getAdminAuthErrorMessage } from "@/lib/admin/auth-messages";
import { adminInputClass, adminLabelClass } from "./admin-ui";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(
    getAdminAuthErrorMessage(queryError) || null
  );

  const supabaseReady = isSupabaseConfigured();

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

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
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

    if (!data.user) {
      setSubmitting(false);
      setError(getAdminAuthErrorMessage("invalid_credentials"));
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("admin_profiles")
      .select("id")
      .eq("id", data.user.id)
      .maybeSingle();

    if (profileError || !profile) {
      await supabase.auth.signOut();
      setSubmitting(false);
      setError(getAdminAuthErrorMessage("access_denied"));
      return;
    }

    router.push("/admin");
    router.refresh();
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
        <input
          id="admin-password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={adminInputClass}
          placeholder="••••••••"
          disabled={!supabaseReady || submitting}
        />
      </div>

      <button
        type="submit"
        disabled={!supabaseReady || submitting}
        className="w-full min-h-12 rounded-full bg-white text-sm font-semibold text-iron-950 transition hover:bg-silver-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Accesso in corso…" : "Accedi al pannello"}
      </button>
    </form>
  );
}
