import type {
  ProductTag,
  ShopFilterGroup,
  ShopGender,
  ShopGroup,
  ShopSubcategory,
} from "@/data/shop";

export type ProductStatus = "published" | "draft";

export type AdminProduct = {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  mainCategory: string;
  subcategoryId: string;
  filterGroup: ShopFilterGroup;
  gender: ShopGender;
  price: number;
  image: string;
  imageFocusIndex: number;
  tags: ProductTag[];
  sizes: string[];
  colors: string[];
  material: string;
  fit: string;
  careInstructions: string;
  status: ProductStatus;
  createdAt: string;
};

export type AdminProductInput = Omit<AdminProduct, "createdAt">;

export type { ShopGroup, ShopSubcategory };
