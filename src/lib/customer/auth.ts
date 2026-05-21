import { redirect } from "next/navigation";
import { checkIsAdmin } from "@/lib/admin/auth-check";
import { fetchCustomerProfile } from "@/lib/customer/auth-check";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function getAuthenticatedCustomerUser() {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function requireCustomerSession() {
  if (!isSupabaseConfigured()) {
    redirect("/login?error=supabase_not_configured");
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    redirect("/login?error=supabase_not_configured");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?error=session_required");
  }

  const isAdmin = await checkIsAdmin(supabase, user.id);
  const { hasProfile } = await fetchCustomerProfile(supabase, user.id);

  if (!hasProfile && isAdmin) {
    redirect("/admin");
  }

  if (!hasProfile) {
    redirect("/register?error=profile_missing");
  }

  const { profile } = await fetchCustomerProfile(supabase, user.id);

  return { supabase, user, profile };
}

export async function getCustomerSessionForPage() {
  const user = await getAuthenticatedCustomerUser();
  if (!user) return { user: null, profile: null };

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { user, profile: null };

  const { profile } = await fetchCustomerProfile(supabase, user.id);
  return { user, profile };
}
