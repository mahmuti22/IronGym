import {
  MAIN_CATEGORY,
  shopGroups,
  shopSubcategories,
  shopProducts,
  getProductById,
  type ShopFilterGroup,
} from "@/data/shop";
import type {
  AdminCategory,
  AdminCollection,
  AdminProduct,
} from "@/lib/admin/types";

export function getMockProducts(): AdminProduct[] {
  return shopProducts.map((p) => {
    const full = getProductById(p.id)!;
    return {
      id: full.id,
      slug: full.id,
      name: full.name,
      description: full.description,
      longDescription: full.longDescription ?? full.description,
      mainCategory: MAIN_CATEGORY,
      categoryId: null,
      subcategoryId: full.subcategoryId,
      filterGroup: full.filterGroup,
      gender: full.gender,
      price: full.price,
      salePrice: null,
      image: full.image,
      imageFocusIndex: full.imageFocusIndex,
      tags: full.tags ?? [],
      sizes: full.sizes ?? [],
      colors: full.colors ?? [],
      material: full.material ?? "",
      fit: full.fit ?? "",
      careInstructions: full.careInstructions ?? "",
      status: "published",
      stockStatus: "in_stock",
      createdAt: "2026-01-15T10:00:00.000Z",
    };
  });
}

export function getMockCategories(): AdminCategory[] {
  return shopSubcategories
    .filter((s) => s.filterGroup !== "collezioni")
    .map((s) => ({
      id: s.id,
      slug: s.slug,
      name: s.title,
      description: s.description,
      imageUrl: null,
      parentId: null,
      groupSlug: s.filterGroup as ShopFilterGroup,
      status: "visible",
      sortOrder: 0,
      legacyId: s.id,
    }));
}

export function getMockCollections(): AdminCollection[] {
  return shopSubcategories
    .filter((s) => s.filterGroup === "collezioni")
    .map((s) => ({
      id: s.id,
      slug: s.slug,
      name: s.title,
      description: s.description,
      heroImageUrl: null,
      status: "visible",
      tags: [],
      sortOrder: 0,
      legacyId: s.id,
    }));
}

export function getMockGroups() {
  return [...shopGroups];
}

export function getMockSubcategories() {
  return [...shopSubcategories];
}
