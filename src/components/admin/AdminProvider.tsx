"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { shopGroups } from "@/data/shop";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { fetchProducts, createProduct, updateProduct, deleteProduct, setProductStatus } from "@/lib/admin/products";
import {
  fetchCategories,
  upsertCategory,
  deleteCategory,
  type CategoryInput,
} from "@/lib/admin/categories";
import { fetchCollections, upsertCollection } from "@/lib/admin/collections";
import { categoriesToSubcategories, slugify } from "@/lib/admin/mappers";
import {
  getMockCategories,
  getMockCollections,
  getMockGroups,
  getMockSubcategories,
} from "@/lib/admin/mock-data";
import type {
  AdminProduct,
  AdminProductInput,
  AdminCategory,
  AdminCollection,
  DataSource,
  ShopGroup,
  ShopSubcategory,
} from "@/lib/admin/types";

export type AdminNotice =
  | { type: "success"; message: string }
  | { type: "info"; message: string }
  | { type: "error"; message: string };

type AdminContextValue = {
  products: AdminProduct[];
  groups: ShopGroup[];
  subcategories: ShopSubcategory[];
  categories: AdminCategory[];
  collections: AdminCollection[];
  dataSource: DataSource;
  loading: boolean;
  notice: AdminNotice | null;
  clearNotice: () => void;
  addProduct: (input: AdminProductInput) => Promise<boolean>;
  removeProduct: (id: string) => Promise<boolean>;
  updateProduct: (id: string, input: Partial<AdminProductInput>) => Promise<boolean>;
  toggleProductStatus: (id: string) => Promise<boolean>;
  updateGroup: (slug: ShopGroup["slug"], data: Partial<ShopGroup>) => void;
  updateSubcategory: (id: string, data: Partial<ShopSubcategory>) => Promise<boolean>;
  saveCategory: (input: CategoryInput) => Promise<boolean>;
  deleteCategoryById: (id: string) => Promise<boolean>;
  updateCollection: (id: string, data: Partial<AdminCollection>) => Promise<boolean>;
  collectionSubcategories: ShopSubcategory[];
  categorySubcategories: ShopSubcategory[];
  refresh: () => Promise<void>;
};

const AdminContext = createContext<AdminContextValue | null>(null);

function buildMockProduct(input: AdminProductInput): AdminProduct {
  const slug =
    input.slug?.trim() ||
    (input.id?.trim()
      ? input.id.replace(/^ig-/, "")
      : slugify(input.name)) ||
    `product-${Date.now()}`;
  const id = input.id?.trim() || (slug.startsWith("ig-") ? slug : `ig-${slug}`);

  return {
    ...input,
    id,
    slug: input.slug ?? slug,
    salePrice: input.salePrice ?? null,
    stockStatus: input.stockStatus ?? "in_stock",
    categoryId: input.categoryId ?? null,
    createdAt: new Date().toISOString(),
  };
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [collections, setCollections] = useState<AdminCollection[]>([]);
  const [groups, setGroups] = useState<ShopGroup[]>(() => getMockGroups());
  const [subcategories, setSubcategories] = useState<ShopSubcategory[]>(
    () => getMockSubcategories()
  );
  const [dataSource, setDataSource] = useState<DataSource>("mock");
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<AdminNotice | null>(null);

  const clearNotice = useCallback(() => setNotice(null), []);

  const loadAll = useCallback(async () => {
    setLoading(true);

    const configured = isSupabaseConfigured();

    const [catRes, colRes] = await Promise.all([
      fetchCategories(),
      fetchCollections(),
    ]);

    let cats = catRes.data;
    let cols = colRes.data;

    if (configured && catRes.source === "supabase") {
      setCategories(cats);
      const subsFromCats = categoriesToSubcategories(cats);
      const subsFromCols = cols.map((c) => ({
        id: c.legacyId ?? c.id,
        slug: c.slug,
        title: c.name,
        description: c.description ?? "",
        filterGroup: "collezioni" as const,
        imageFocusIndex: 0,
        dbSlug: c.slug,
      }));
      setSubcategories([...subsFromCats, ...subsFromCols]);

      const tops = cats.filter((c) => !c.parentId && c.groupSlug);
      if (tops.length > 0) {
        setGroups(
          tops.map((t) => {
            const staticG = shopGroups.find((g) => g.slug === t.groupSlug);
            return {
              slug: t.groupSlug!,
              title: t.name,
              description: t.description ?? staticG?.description ?? "",
              imageFocusIndex: staticG?.imageFocusIndex ?? 0,
            };
          })
        );
      }
    } else {
      cats = getMockCategories();
      cols = getMockCollections();
      setCategories(cats);
      setSubcategories(getMockSubcategories());
      setNotice({
        type: "info",
        message:
          "Using local mock data because Supabase is not configured",
      });
    }

    setCollections(cols);

    const prodRes = await fetchProducts(cats);
    setProducts(prodRes.data);

    if (configured && prodRes.source === "supabase") {
      setDataSource("supabase");
    } else {
      setDataSource("mock");
    }

    if (catRes.error || colRes.error || prodRes.error) {
      setNotice({
        type: "error",
        message: catRes.error ?? colRes.error ?? prodRes.error ?? "Load error",
      });
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  const addProduct = useCallback(
    async (input: AdminProductInput): Promise<boolean> => {
      if (dataSource === "supabase") {
        const slug =
          input.slug?.trim() ||
          (input.id?.trim()
            ? input.id.replace(/^ig-/, "")
            : slugify(input.name));

        const result = await createProduct(
          { ...input, slug },
          categories
        );

        if (!result.ok || !result.data) {
          setNotice({
            type: "error",
            message: result.error ?? "Error while saving product",
          });
          return false;
        }

        setProducts((prev) => [result.data!, ...prev]);
        setNotice({ type: "success", message: "Saved to database" });
        return true;
      }

      const product = buildMockProduct(input);
      setProducts((prev) => [product, ...prev]);
      setNotice({
        type: "info",
        message:
          "Using local mock data because Supabase is not configured",
      });
      return true;
    },
    [dataSource, categories]
  );

  const removeProduct = useCallback(
    async (id: string): Promise<boolean> => {
      if (dataSource === "supabase") {
        const result = await deleteProduct(id);
        if (!result.ok) {
          setNotice({
            type: "error",
            message: result.error ?? "Error while deleting product",
          });
          return false;
        }
        setProducts((prev) => prev.filter((p) => p.id !== id));
        setNotice({ type: "success", message: "Saved to database" });
        return true;
      }

      setProducts((prev) => prev.filter((p) => p.id !== id));
      return true;
    },
    [dataSource]
  );

  const updateProductFn = useCallback(
    async (id: string, input: Partial<AdminProductInput>): Promise<boolean> => {
      if (dataSource === "supabase") {
        const result = await updateProduct(id, input, categories);
        if (!result.ok || !result.data) {
          setNotice({
            type: "error",
            message: result.error ?? "Error while saving product",
          });
          return false;
        }
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? result.data! : p))
        );
        setNotice({ type: "success", message: "Saved to database" });
        return true;
      }

      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...input } : p))
      );
      return true;
    },
    [dataSource, categories]
  );

  const toggleProductStatus = useCallback(
    async (id: string): Promise<boolean> => {
      const product = products.find((p) => p.id === id);
      if (!product) return false;
      const next =
        product.status === "published" ? "draft" : "published";

      if (dataSource === "supabase") {
        const result = await setProductStatus(id, next, categories);
        if (!result.ok || !result.data) {
          setNotice({
            type: "error",
            message: result.error ?? "Error while saving product",
          });
          return false;
        }
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? result.data! : p))
        );
        setNotice({ type: "success", message: "Saved to database" });
        return true;
      }

      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: next } : p))
      );
      return true;
    },
    [dataSource, categories, products]
  );

  const updateGroup = useCallback(
    (slug: ShopGroup["slug"], data: Partial<ShopGroup>) => {
      setGroups((prev) =>
        prev.map((g) => (g.slug === slug ? { ...g, ...data } : g))
      );
      if (dataSource === "mock") {
        setNotice({
          type: "info",
          message:
            "Using local mock data because Supabase is not configured",
        });
      }
    },
    [dataSource]
  );

  const updateSubcategory = useCallback(
    async (id: string, data: Partial<ShopSubcategory>): Promise<boolean> => {
      const sub = subcategories.find((s) => s.id === id);
      if (!sub) return false;

      setSubcategories((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...data } : s))
      );

      if (dataSource === "supabase") {
        const cat = categories.find(
          (c) => c.id === id || c.legacyId === id || c.slug === sub.slug
        );
        if (!cat) return true;

        const result = await upsertCategory({
          id: cat.id,
          slug: data.slug ?? cat.slug,
          name: data.title ?? cat.name,
          description: data.description ?? cat.description,
          groupSlug: sub.filterGroup,
          parentId: cat.parentId,
          status: cat.status,
          sortOrder: cat.sortOrder,
        });

        if (!result.ok) {
          setNotice({
            type: "error",
            message: result.error ?? "Error while saving category",
          });
          return false;
        }
        setNotice({ type: "success", message: "Saved to database" });
      } else {
        setNotice({
          type: "info",
          message:
            "Using local mock data because Supabase is not configured",
        });
      }
      return true;
    },
    [dataSource, subcategories, categories]
  );

  const saveCategory = useCallback(
    async (input: CategoryInput): Promise<boolean> => {
      if (dataSource !== "supabase") {
        setNotice({
          type: "info",
          message:
            "Using local mock data because Supabase is not configured",
        });
        return false;
      }

      const result = await upsertCategory(input);
      if (!result.ok) {
        setNotice({
          type: "error",
          message: result.error ?? "Error while saving category",
        });
        return false;
      }

      await loadAll();
      setNotice({ type: "success", message: "Saved to database" });
      return true;
    },
    [dataSource, loadAll]
  );

  const deleteCategoryById = useCallback(
    async (id: string): Promise<boolean> => {
      if (dataSource !== "supabase") {
        setNotice({
          type: "info",
          message:
            "Using local mock data because Supabase is not configured",
        });
        return false;
      }

      const result = await deleteCategory(id);
      if (!result.ok) {
        setNotice({
          type: "error",
          message: result.error ?? "Error while deleting category",
        });
        return false;
      }

      await loadAll();
      setNotice({ type: "success", message: "Saved to database" });
      return true;
    },
    [dataSource, loadAll]
  );

  const updateCollection = useCallback(
    async (id: string, data: Partial<AdminCollection>): Promise<boolean> => {
      const col = collections.find((c) => c.id === id || c.legacyId === id);
      if (!col) return false;

      setCollections((prev) =>
        prev.map((c) => (c.id === col.id ? { ...c, ...data } : c))
      );
      setSubcategories((prev) =>
        prev.map((s) =>
          s.id === id
            ? {
                ...s,
                title: data.name ?? s.title,
                description: data.description ?? s.description,
                slug: data.slug ?? s.slug,
              }
            : s
        )
      );

      if (dataSource === "supabase") {
        const result = await upsertCollection({
          id: col.id,
          slug: data.slug ?? col.slug,
          name: data.name ?? col.name,
          description: data.description ?? col.description,
          heroImageUrl: data.heroImageUrl ?? col.heroImageUrl,
          status: data.status ?? col.status,
          tags: data.tags ?? col.tags,
          sortOrder: col.sortOrder,
        });

        if (!result.ok) {
          setNotice({
            type: "error",
            message: result.error ?? "Error while saving collection",
          });
          return false;
        }
        setNotice({ type: "success", message: "Saved to database" });
      } else {
        setNotice({
          type: "info",
          message:
            "Using local mock data because Supabase is not configured",
        });
      }
      return true;
    },
    [dataSource, collections]
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
      groups: groups.length ? groups : [...shopGroups],
      subcategories,
      categories,
      collections,
      dataSource,
      loading,
      notice,
      clearNotice,
      addProduct,
      removeProduct,
      updateProduct: updateProductFn,
      toggleProductStatus,
      updateGroup,
      updateSubcategory,
      saveCategory,
      deleteCategoryById,
      updateCollection,
      collectionSubcategories,
      categorySubcategories,
      refresh: loadAll,
    }),
    [
      products,
      groups,
      subcategories,
      categories,
      collections,
      dataSource,
      loading,
      notice,
      clearNotice,
      addProduct,
      removeProduct,
      updateProductFn,
      toggleProductStatus,
      updateGroup,
      updateSubcategory,
      saveCategory,
      deleteCategoryById,
      updateCollection,
      collectionSubcategories,
      categorySubcategories,
      loadAll,
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
