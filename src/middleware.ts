import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getSubcategoryById,
  getSubcategoryPath,
  isProductId,
  isShopFilterGroup,
} from "@/data/shop";

export function middleware(request: NextRequest) {
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

  return NextResponse.next();
}

export const config = {
  matcher: ["/shop", "/shop/:segment"],
};
