import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getSubcategoryById,
  getSubcategoryPath,
  isProductId,
  isShopFilterGroup,
} from "@/data/shop";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createMiddlewareSupabaseClientWithResponse } from "@/lib/supabase/middleware";
import { checkIsAdmin, logAdminAuthDebug } from "@/lib/admin/auth-check";
import { fetchCustomerProfile } from "@/lib/customer/auth-check";

function handleShopRedirects(request: NextRequest): NextResponse | null {
  const { pathname, searchParams } = request.nextUrl;

  const singleMatch = pathname.match(/^\/shop\/([^/]+)$/);
  if (singleMatch) {
    const segment = singleMatch[1];
    if (segment !== "product" && isProductId(segment)) {
      const url = request.nextUrl.clone();
      url.pathname = `/shop/product/${segment}`;
      return NextResponse.redirect(url, 308);
    }
  }

  if (pathname === "/shop") {
    const group = searchParams.get("group");
    const subId = searchParams.get("sub");
    if (group && isShopFilterGroup(group)) {
      const url = request.nextUrl.clone();
      url.search = "";
      if (subId) {
        const sub = getSubcategoryById(subId);
        url.pathname = sub ? getSubcategoryPath(sub) : `/shop/${group}`;
      } else {
        url.pathname = `/shop/${group}`;
      }
      return NextResponse.redirect(url, 308);
    }
  }

  return null;
}

function adminLoginRedirect(request: NextRequest, error?: string): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = "/admin/login";
  url.search = "";
  if (error) {
    url.searchParams.set("error", error);
  }
  return NextResponse.redirect(url);
}

function customerLoginRedirect(
  request: NextRequest,
  error?: string
): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.search = "";
  if (error) {
    url.searchParams.set("error", error);
  }
  return NextResponse.redirect(url);
}

async function handleAdminAuth(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/admin/login";

  if (!isSupabaseConfigured()) {
    if (isLoginPage) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  const clientBundle = createMiddlewareSupabaseClientWithResponse(request);
  if (!clientBundle) {
    return NextResponse.next();
  }

  const { supabase, getResponse } = clientBundle;

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  logAdminAuthDebug("middleware getUser", {
    pathname,
    userId: user?.id ?? null,
    userEmail: user?.email ?? null,
    userError: userError?.message ?? null,
  });

  if (isLoginPage) {
    if (user) {
      const isAdmin = await checkIsAdmin(
        supabase,
        user.id,
        "middleware /admin/login"
      );
      if (isAdmin) {
        const url = request.nextUrl.clone();
        url.pathname = "/admin";
        url.search = "";
        return NextResponse.redirect(url);
      }
    }
    return getResponse();
  }

  if (!user) {
    return adminLoginRedirect(request, "session_required");
  }

  const isAdmin = await checkIsAdmin(
    supabase,
    user.id,
    `middleware ${pathname}`
  );

  if (!isAdmin) {
    logAdminAuthDebug("middleware access denied", { userId: user.id });
    return adminLoginRedirect(request, "access_denied");
  }

  return getResponse();
}

async function handleCustomerAuth(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/login";
  const isRegisterPage = pathname === "/register";

  if (!isSupabaseConfigured()) {
    return NextResponse.next();
  }

  const clientBundle = createMiddlewareSupabaseClientWithResponse(request);
  if (!clientBundle) {
    return NextResponse.next();
  }

  const { supabase, getResponse } = clientBundle;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isLoginPage || isRegisterPage) {
    if (user) {
      const { hasProfile } = await fetchCustomerProfile(supabase, user.id);
      const isAdmin = await checkIsAdmin(supabase, user.id);
      if (hasProfile) {
        const url = request.nextUrl.clone();
        url.pathname = "/account";
        url.search = "";
        return NextResponse.redirect(url);
      }
      if (isAdmin && !hasProfile) {
        const url = request.nextUrl.clone();
        url.pathname = "/admin";
        url.search = "";
        return NextResponse.redirect(url);
      }
    }
    return getResponse();
  }

  if (!user) {
    return customerLoginRedirect(request, "session_required");
  }

  const { hasProfile } = await fetchCustomerProfile(supabase, user.id);
  const isAdmin = await checkIsAdmin(supabase, user.id);

  if (!hasProfile) {
    if (isAdmin) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    const url = request.nextUrl.clone();
    url.pathname = "/register";
    url.searchParams.set("error", "profile_missing");
    return NextResponse.redirect(url);
  }

  return getResponse();
}

export async function middleware(request: NextRequest) {
  const shopRedirect = handleShopRedirects(request);
  if (shopRedirect) return shopRedirect;

  const { pathname } = request.nextUrl;

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return handleAdminAuth(request);
  }

  if (
    pathname === "/account" ||
    pathname.startsWith("/account/") ||
    pathname === "/login" ||
    pathname === "/register"
  ) {
    return handleCustomerAuth(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/shop",
    "/shop/:path*",
    "/admin",
    "/admin/:path*",
    "/account",
    "/account/:path*",
    "/login",
    "/register",
  ],
};
