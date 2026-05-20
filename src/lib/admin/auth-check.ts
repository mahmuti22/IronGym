import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { getSupabaseEnv } from "@/lib/supabase/config";

export type AdminProfileRow = {
  id: string;
  email: string;
  role: string;
};

export type AdminProfileCheckResult = {
  isAdmin: boolean;
  profile: AdminProfileRow | null;
  error: PostgrestError | null;
};

function isDev(): boolean {
  return process.env.NODE_ENV === "development";
}

/** Dev-only auth diagnostics (never logs passwords or full API keys). */
export function logAdminAuthDebug(
  label: string,
  payload?: Record<string, unknown>
): void {
  if (!isDev()) return;
  console.log(`[IronGym Admin Auth] ${label}`, payload ?? "");
}

export function logSupabaseProjectDebug(): void {
  if (!isDev()) return;
  const { url, anonKey } = getSupabaseEnv();
  console.log("[IronGym Admin Auth] Supabase project", {
    url,
    anonKeyPrefix: anonKey ? `${anonKey.slice(0, 12)}…` : "(missing)",
  });
}

export async function fetchAdminProfile(
  supabase: SupabaseClient<Database>,
  userId: string,
  debugLabel?: string
): Promise<AdminProfileCheckResult> {
  const { data, error } = await supabase
    .from("admin_profiles")
    .select("id, email, role")
    .eq("id", userId)
    .eq("role", "admin")
    .maybeSingle();

  if (isDev() && debugLabel) {
    logAdminAuthDebug(`${debugLabel} — admin_profiles query`, {
      userId,
      data,
      error: error
        ? {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint,
          }
        : null,
    });
  }

  if (error) {
    return { isAdmin: false, profile: null, error };
  }

  return {
    isAdmin: Boolean(data?.id),
    profile: data,
    error: null,
  };
}

export async function checkIsAdmin(
  supabase: SupabaseClient<Database>,
  userId: string,
  debugLabel = "checkIsAdmin"
): Promise<boolean> {
  const result = await fetchAdminProfile(supabase, userId, debugLabel);
  return result.isAdmin;
}
