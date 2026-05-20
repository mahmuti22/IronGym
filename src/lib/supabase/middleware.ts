import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { getSupabaseEnv, isSupabaseConfigured } from "./config";

export function createMiddlewareSupabaseClient(
  request: NextRequest,
  response: NextResponse
): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured()) return null;

  const { url, anonKey } = getSupabaseEnv();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });
}

/**
 * Supabase SSR middleware client — recreates the response when auth cookies refresh.
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */
export function createMiddlewareSupabaseClientWithResponse(
  request: NextRequest
): {
  supabase: SupabaseClient<Database>;
  getResponse: () => NextResponse;
} | null {
  if (!isSupabaseConfigured()) return null;

  const { url, anonKey } = getSupabaseEnv();
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  return {
    supabase,
    getResponse: () => response,
  };
}
