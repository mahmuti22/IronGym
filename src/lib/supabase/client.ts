import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { getSupabaseEnv, isSupabaseConfigured } from "./config";

function parseDocumentCookies(): { name: string; value: string }[] {
  if (typeof document === "undefined") return [];

  return document.cookie
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const eq = part.indexOf("=");
      if (eq === -1) return { name: part, value: "" };
      return {
        name: part.slice(0, eq),
        value: decodeURIComponent(part.slice(eq + 1)),
      };
    });
}

function serializeCookie(
  name: string,
  value: string,
  options?: {
    path?: string;
    maxAge?: number;
    sameSite?: "lax" | "strict" | "none";
    secure?: boolean;
  }
): string {
  const segments = [
    `${name}=${encodeURIComponent(value)}`,
    `path=${options?.path ?? "/"}`,
  ];

  if (options?.maxAge != null) {
    segments.push(`max-age=${options.maxAge}`);
  }

  const sameSite = options?.sameSite ?? "lax";
  segments.push(`samesite=${sameSite}`);

  if (options?.secure) {
    segments.push("secure");
  }

  return segments.join("; ");
}

export function createBrowserSupabaseClient(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured()) return null;

  const { url, anonKey } = getSupabaseEnv();

  return createBrowserClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return parseDocumentCookies();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          document.cookie = serializeCookie(name, value, {
            path: options?.path,
            maxAge: options?.maxAge,
            sameSite: options?.sameSite as "lax" | "strict" | "none" | undefined,
            secure: options?.secure,
          });
        });
      },
    },
  });
}
