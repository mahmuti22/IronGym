export {
  getShopCatalog,
  getCatalogProductBySlug,
  getCatalogProductsByGroup,
  getCatalogProductsBySubcategory,
  getCatalogGroup,
  getCatalogSubcategoriesByGroup,
  getCatalogSubcategoryBySlug,
  getCatalogSimilarProducts,
  getCatalogProductSlugs,
  getCatalogSubcategoryParams,
  mapPublishedRowToShopProduct,
  type ShopCatalog,
  type ShopCatalogSource,
} from "./catalog";

/** @deprecated Usa getShopCatalog */
export async function fetchPublishedShopProducts() {
  const { getShopCatalog } = await import("./catalog");
  const catalog = await getShopCatalog();
  return { products: catalog.products, source: catalog.source };
}

/** @deprecated Usa getCatalogProductBySlug */
export async function fetchPublishedProductBySlug(slug: string) {
  const { getCatalogProductBySlug } = await import("./catalog");
  const { product } = await getCatalogProductBySlug(slug);
  return product;
}
