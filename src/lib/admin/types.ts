import type {
  ProductTag,
  ShopFilterGroup,
  ShopGender,
  ShopGroup,
  ShopSubcategory,
} from "@/data/shop";

export type ProductStatus = "published" | "draft";
export type DataSource = "supabase" | "mock";

export type AdminCategory = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  parentId: string | null;
  groupSlug: ShopFilterGroup | null;
  status: string;
  sortOrder: number;
  /** Legacy mock id when in fallback mode */
  legacyId?: string;
};

export type AdminCollection = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  heroImageUrl: string | null;
  status: string;
  tags: string[];
  sortOrder: number;
  legacyId?: string;
};

export type AdminProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  mainCategory: string;
  categoryId: string | null;
  subcategoryId: string | null;
  filterGroup: ShopFilterGroup;
  gender: ShopGender;
  price: number;
  salePrice: number | null;
  image: string;
  imageFocusIndex: number;
  tags: ProductTag[];
  sizes: string[];
  colors: string[];
  material: string;
  fit: string;
  careInstructions: string;
  status: ProductStatus;
  stockStatus: string;
  createdAt: string;
  updatedAt?: string;
};

export type AdminProductInput = Omit<
  AdminProduct,
  "createdAt" | "updatedAt" | "id"
> & {
  id?: string;
};

export type AdminActionResult<T = void> = {
  ok: boolean;
  data?: T;
  error?: string;
};

export type { ShopGroup, ShopSubcategory };
