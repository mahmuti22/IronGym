"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  shopGroups,
  shopSubcategories,
  shopProducts,
  getProductById,
} from "@/data/shop";
import type {
  AdminProduct,
  AdminProductInput,
  ShopGroup,
  ShopSubcategory,
} from "@/lib/admin/types";

type AdminContextValue = {
  products: AdminProduct[];
  groups: ShopGroup[];
  subcategories: ShopSubcategory[];
  addProduct: (input: AdminProductInput) => void;
  removeProduct: (id: string) => void;
  updateProduct: (id: string, input: Partial<AdminProductInput>) => void;
  updateGroup: (slug: ShopGroup["slug"], data: Partial<ShopGroup>) => void;
  updateSubcategory: (id: string, data: Partial<ShopSubcategory>) => void;
  collectionSubcategories: ShopSubcategory[];
  categorySubcategories: ShopSubcategory[];
};

const AdminContext = createContext<AdminContextValue | null>(null);

function seedProducts(): AdminProduct[] {
  return shopProducts.map((p) => {
    const full = getProductById(p.id)!;
    return {
      id: full.id,
      name: full.name,
      description: full.description,
      longDescription: full.longDescription ?? full.description,
      mainCategory: full.mainCategory,
      subcategoryId: full.subcategoryId,
      filterGroup: full.filterGroup,
      gender: full.gender,
      price: full.price,
      image: full.image,
      imageFocusIndex: full.imageFocusIndex,
      tags: full.tags ?? [],
      sizes: full.sizes ?? [],
      colors: full.colors ?? [],
      material: full.material ?? "",
      fit: full.fit ?? "",
      careInstructions: full.careInstructions ?? "",
      status: "published",
      createdAt: "2026-01-15T10:00:00.000Z",
    };
  });
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<AdminProduct[]>(seedProducts);
  const [groups, setGroups] = useState<ShopGroup[]>(() => [...shopGroups]);
  const [subcategories, setSubcategories] = useState<ShopSubcategory[]>(
    () => [...shopSubcategories]
  );

  const addProduct = useCallback((input: AdminProductInput) => {
    setProducts((prev) => [
      {
        ...input,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  }, []);

  const removeProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const updateProduct = useCallback(
    (id: string, input: Partial<AdminProductInput>) => {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...input } : p))
      );
    },
    []
  );

  const updateGroup = useCallback(
    (slug: ShopGroup["slug"], data: Partial<ShopGroup>) => {
      setGroups((prev) =>
        prev.map((g) => (g.slug === slug ? { ...g, ...data } : g))
      );
    },
    []
  );

  const updateSubcategory = useCallback(
    (id: string, data: Partial<ShopSubcategory>) => {
      setSubcategories((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...data } : s))
      );
    },
    []
  );

  const collectionSubcategories = useMemo(
    () => subcategories.filter((s) => s.filterGroup === "collezioni"),
    [subcategories]
  );

  const categorySubcategories = useMemo(
    () => subcategories.filter((s) => s.filterGroup !== "collezioni"),
    [subcategories]
  );

  const value = useMemo(
    () => ({
      products,
      groups,
      subcategories,
      addProduct,
      removeProduct,
      updateProduct,
      updateGroup,
      updateSubcategory,
      collectionSubcategories,
      categorySubcategories,
    }),
    [
      products,
      groups,
      subcategories,
      addProduct,
      removeProduct,
      updateProduct,
      updateGroup,
      updateSubcategory,
      collectionSubcategories,
      categorySubcategories,
    ]
  );

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    throw new Error("useAdmin must be used within AdminProvider");
  }
  return ctx;
}
