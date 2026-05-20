import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getSubcategoryById,
  getSubcategoryPath,
  isProductId,
  isShopFilterGroup,
} from "@/data/shop";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createMiddlewareSupabaseClient } from "@/lib/supabase/middleware";
import { checkIsAdmin } from "@/lib/admin/auth-check";

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

async function handleAdminAuth(
  request: NextRequest
): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/admin/login";

  if (!isSupabaseConfigured()) {
    if (isLoginPage) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  const response = NextResponse.next({ request });
  const supabase = createMiddlewareSupabaseClient(request, response);

  if (!supabase) {
    return response;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isLoginPage) {
    if (user) {
      const isAdmin = await checkIsAdmin(supabase, user.id);
      if (isAdmin) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }
    return response;
  }

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("error", "session_required");
    return NextResponse.redirect(url);
  }

  const isAdmin = await checkIsAdmin(supabase, user.id);
  if (!isAdmin) {
    await supabase.auth.signOut();
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("error", "access_denied");
    return NextResponse.redirect(url);
  }

  return response;
}

export async function middleware(request: NextRequest) {
  const shopRedirect = handleShopRedirects(request);
  if (shopRedirect) return shopRedirect;

  const { pathname } = request.nextUrl;
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return handleAdminAuth(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/shop", "/shop/:path*", "/admin", "/admin/:path*"],
};
