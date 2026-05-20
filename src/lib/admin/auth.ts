import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { checkIsAdmin } from "./auth-check";

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

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    redirect("/admin/login?error=supabase_not_configured");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login?error=session_required");
  }

  const isAdmin = await checkIsAdmin(supabase, user.id);
  if (!isAdmin) {
    redirect("/admin/login?error=access_denied");
  }

  return user;
}
