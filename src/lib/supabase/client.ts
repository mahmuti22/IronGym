import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { getSupabaseEnv, isSupabaseConfigured } from "./config";

export function createBrowserSupabaseClient(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured()) return null;

  const { url, anonKey } = getSupabaseEnv();
  return createBrowserClient<Database>(url, anonKey);
}
