import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export async function checkIsAdmin(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from("admin_profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (error) return false;
  return Boolean(data?.id);
}
