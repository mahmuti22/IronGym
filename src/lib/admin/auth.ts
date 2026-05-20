import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  checkIsAdmin,
  logAdminAuthDebug,
  logSupabaseProjectDebug,
} from "./auth-check";

export { getAdminAuthErrorMessage } from "./auth-messages";
export type { AdminAuthErrorCode } from "./auth-messages";

export async function getAuthenticatedUser(): Promise<User | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function requireAdminSession(): Promise<User | null> {
  if (!isSupabaseConfigured()) return null;

  logSupabaseProjectDebug();

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    redirect("/admin/login?error=supabase_not_configured");
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  logAdminAuthDebug("requireAdminSession getUser", {
    userId: user?.id ?? null,
    userEmail: user?.email ?? null,
    userError: userError?.message ?? null,
  });

  if (!user) {
    redirect("/admin/login?error=session_required");
  }

  const isAdmin = await checkIsAdmin(
    supabase,
    user.id,
    "requireAdminSession layout"
  );

  if (!isAdmin) {
    logAdminAuthDebug("requireAdminSession access denied", {
      userId: user.id,
    });
    redirect("/admin/login?error=access_denied");
  }

  return user;
}
