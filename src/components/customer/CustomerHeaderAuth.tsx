"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { fetchCustomerProfile } from "@/lib/customer/auth-check";
import { checkIsAdmin } from "@/lib/admin/auth-check";

type AuthState = "loading" | "guest" | "customer" | "admin";

export function CustomerHeaderAuth({
  linkClassName,
}: {
  linkClassName: string;
}) {
  const [state, setState] = useState<AuthState>("loading");

  useEffect(() => {
    void (async () => {
      if (!isSupabaseConfigured()) {
        setState("guest");
        return;
      }

      const supabase = createBrowserSupabaseClient();
      if (!supabase) {
        setState("guest");
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setState("guest");
        return;
      }

      const isAdmin = await checkIsAdmin(supabase, user.id);
      const { hasProfile } = await fetchCustomerProfile(supabase, user.id);

      if (hasProfile) {
        setState("customer");
        return;
      }

      if (isAdmin) {
        setState("admin");
        return;
      }

      setState("guest");
    })();
  }, []);

  if (state === "loading") {
    return (
      <span className={`${linkClassName} opacity-0`} aria-hidden>
        Login
      </span>
    );
  }

  if (state === "customer") {
    return (
      <Link href="/account" className={linkClassName}>
        Account
      </Link>
    );
  }

  if (state === "admin") {
    return (
      <Link href="/admin" className={linkClassName}>
        Admin
      </Link>
    );
  }

  return (
    <Link href="/login" className={linkClassName}>
      Login
    </Link>
  );
}
