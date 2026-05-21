import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export type CustomerProfileRow = Database["public"]["Tables"]["customer_profiles"]["Row"];

export type CustomerProfileCheckResult = {
  hasProfile: boolean;
  profile: CustomerProfileRow | null;
  error: PostgrestError | null;
};

export async function fetchCustomerProfile(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<CustomerProfileCheckResult> {
  const { data, error } = await supabase
    .from("customer_profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    return { hasProfile: false, profile: null, error };
  }

  return {
    hasProfile: Boolean(data),
    profile: data,
    error: null,
  };
}
