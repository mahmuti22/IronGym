"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getSubcategoryById,
  getSubcategoryPath,
  isShopFilterGroup,
} from "@/data/shop";

/** Reindirizza vecchi URL ?group=&sub= verso route pulite */
export function ShopLegacyRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const group = searchParams.get("group");
    const subId = searchParams.get("sub");

    if (!group && !subId) return;

    if (subId) {
      const sub = getSubcategoryById(subId);
      if (sub) {
        router.replace(getSubcategoryPath(sub));
        return;
      }
    }

    if (group && isShopFilterGroup(group)) {
      router.replace(`/shop/${group}`);
    }
  }, [searchParams, router]);

  return null;
}
