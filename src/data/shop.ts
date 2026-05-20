import { CATALOG_STUDIO_MODEL_01, productImageFocusClasses } from "./catalog";

export const MAIN_CATEGORY = "Abbigliamento Gym" as const;

export type ShopFilterGroup = "uomo" | "donna" | "accessori" | "collezioni";
export type ShopGender = "uomo" | "donna" | "unisex";
export type ProductTag = "New" | "Best Seller" | "Sale";

export type ShopSubcategory = {
  id: string;
  slug: string;
  title: string;
  description: string;
  filterGroup: ShopFilterGroup;
  /** Indice per ritaglio immagine lookbook condivisa */
  imageFocusIndex: number;
};

export type ShopGroup = {
  slug: ShopFilterGroup;
  title: string;
  description: string;
  imageFocusIndex: number;
};

export const shopGroups: ShopGroup[] = [
  {
    slug: "uomo",
    title: "Uomo",
    description:
      "T-shirt, tank, joggers, hoodie e compression — pezzi da palestra con taglio preciso e materiali premium.",
    imageFocusIndex: 0,
  },
  {
    slug: "donna",
    title: "Donna",
    description:
      "Leggings, sports bra, set coordinati e layer tecnici — design sculpt, zero distrazioni.",
    imageFocusIndex: 1,
  },
  {
    slug: "accessori",
    title: "Accessori Gym",
    description:
      "Guanti, cinture, straps, borracce e borse — gear essenziale per ogni sessione.",
    imageFocusIndex: 2,
  },
  {
    slug: "collezioni",
    title: "Collezioni",
    description:
      "New arrivals, best seller, oversize, compression e selezioni stagionali IronGym.",
    imageFocusIndex: 3,
  },
];

/** Segmenti riservati — non usare come slug categoria */
export const SHOP_RESERVED_SEGMENTS = ["product"] as const;

export const DEFAULT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;
export const DEFAULT_COLORS = [
  "Midnight Black",
  "Steel Grey",
  "Graphite",
] as const;
export const ACCESSORY_SIZES = ["S/M", "L/XL"] as const;
export const ACCESSORY_COLORS = ["Midnight Black", "Steel"] as const;

export type ShopProduct = {
  id: string;
  name: string;
  description: string;
  mainCategory: typeof MAIN_CATEGORY;
  subcategoryId: string;
  filterGroup: ShopFilterGroup;
  gender: ShopGender;
  price: number;
  image: string;
  imageFocusIndex: number;
  tags?: ProductTag[];
  longDescription?: string;
  sizes?: string[];
  colors?: string[];
  images?: string[];
  material?: string;
  fit?: string;
  careInstructions?: string;
};

export const shopFilterLabels: Record<ShopFilterGroup, string> = {
  uomo: "Uomo",
  donna: "Donna",
  accessori: "Accessori",
  collezioni: "Collezioni",
};

export const shopSubcategories: ShopSubcategory[] = [
  // Uomo
  { id: "uomo-t-shirt", slug: "t-shirt", title: "T-shirt palestra", description: "Taglio training, tessuti premium e fit pulito.", filterGroup: "uomo", imageFocusIndex: 0 },
  { id: "uomo-tank", slug: "tank-top", title: "Tank top / canottiere", description: "Massima libertà di movimento per spalle e braccia.", filterGroup: "uomo", imageFocusIndex: 1 },
  { id: "uomo-hoodie", slug: "hoodie", title: "Hoodie / felpe", description: "Calore strutturato per warm-up e uscita dalla palestra.", filterGroup: "uomo", imageFocusIndex: 2 },
  { id: "uomo-joggers", slug: "joggers", title: "Joggers", description: "Taper moderno, comfort tutto il giorno.", filterGroup: "uomo", imageFocusIndex: 3 },
  { id: "uomo-shorts", slug: "shorts", title: "Shorts", description: "Leg day e cardio con vestibilità stabile.", filterGroup: "uomo", imageFocusIndex: 0 },
  { id: "uomo-compression", slug: "compression-shirt", title: "Compression shirt", description: "Supporto muscolare e look tecnico.", filterGroup: "uomo", imageFocusIndex: 1 },
  { id: "uomo-leggings", slug: "leggings", title: "Leggings uomo", description: "Compression fit per performance e recovery.", filterGroup: "uomo", imageFocusIndex: 2 },
  { id: "uomo-socks", slug: "calze-sportive", title: "Calze sportive", description: "Grip, traspirazione e comfort sotto carico.", filterGroup: "uomo", imageFocusIndex: 3 },
  { id: "uomo-caps", slug: "cappellini-accessori", title: "Cappellini / accessori", description: "Finish pulito per completare il kit.", filterGroup: "uomo", imageFocusIndex: 0 },
  // Donna
  { id: "donna-top", slug: "top-sportivi", title: "Top sportivi", description: "Supporto e stile per ogni tipo di sessione.", filterGroup: "donna", imageFocusIndex: 1 },
  { id: "donna-bra", slug: "sports-bra", title: "Sports bra", description: "Supporto medio-alto, seamless feel.", filterGroup: "donna", imageFocusIndex: 2 },
  { id: "donna-leggings", slug: "leggings", title: "Leggings", description: "Sculpt fit, zero distraction.", filterGroup: "donna", imageFocusIndex: 3 },
  { id: "donna-shorts", slug: "shorts", title: "Shorts", description: "Leggeri, sicuri, pronti per HIIT e pesi.", filterGroup: "donna", imageFocusIndex: 0 },
  { id: "donna-t-shirt", slug: "t-shirt", title: "T-shirt palestra", description: "Minimal fuori, performante dentro.", filterGroup: "donna", imageFocusIndex: 1 },
  { id: "donna-hoodie", slug: "hoodie", title: "Hoodie / felpe", description: "Layer premium pre e post workout.", filterGroup: "donna", imageFocusIndex: 2 },
  { id: "donna-joggers", slug: "joggers", title: "Joggers", description: "Silhouette pulita, tessuto pesante.", filterGroup: "donna", imageFocusIndex: 3 },
  { id: "donna-sets", slug: "set-coordinati", title: "Set coordinati", description: "Look completo, zero pensieri.", filterGroup: "donna", imageFocusIndex: 0 },
  { id: "donna-socks", slug: "calze-sportive", title: "Calze sportive", description: "Dettaglio tecnico per ogni passo.", filterGroup: "donna", imageFocusIndex: 1 },
  { id: "donna-accessori", slug: "accessori", title: "Accessori", description: "Completamenti essenziali per la donna attiva.", filterGroup: "donna", imageFocusIndex: 2 },
  // Accessori Gym
  { id: "acc-gloves", slug: "guanti-palestra", title: "Guanti palestra", description: "Grip e protezione per tirate pesanti.", filterGroup: "accessori", imageFocusIndex: 0 },
  { id: "acc-belt", slug: "cinture-sollevamento", title: "Cinture sollevamento", description: "Stabilità core per squat e stacco.", filterGroup: "accessori", imageFocusIndex: 1 },
  { id: "acc-wrist", slug: "fasce-polsi", title: "Fasce polsi", description: "Supporto articolare sotto carico.", filterGroup: "accessori", imageFocusIndex: 2 },
  { id: "acc-straps", slug: "straps", title: "Straps", description: "Presa sicura quando il grip cede.", filterGroup: "accessori", imageFocusIndex: 3 },
  { id: "acc-bottle", slug: "borracce", title: "Borracce", description: "Idratazione con estetica IronGym.", filterGroup: "accessori", imageFocusIndex: 0 },
  { id: "acc-towel", slug: "asciugamani", title: "Asciugamani", description: "Asciugatura rapida, formato gym.", filterGroup: "accessori", imageFocusIndex: 1 },
  { id: "acc-bag", slug: "borse-palestra", title: "Borse palestra", description: "Spazio smart per scarpe, gear e essentials.", filterGroup: "accessori", imageFocusIndex: 2 },
  // Collezioni
  { id: "col-new", slug: "new-arrivals", title: "New arrivals", description: "Ultimi drop e pezzi appena arrivati.", filterGroup: "collezioni", imageFocusIndex: 0 },
  { id: "col-bestseller", slug: "best-seller", title: "Best seller", description: "I preferiti della community IronGym.", filterGroup: "collezioni", imageFocusIndex: 1 },
  { id: "col-oversize", slug: "oversize", title: "Oversize collection", description: "Volumi larghi, attitude forte.", filterGroup: "collezioni", imageFocusIndex: 2 },
  { id: "col-compression", slug: "compression", title: "Compression collection", description: "Second skin per performance.", filterGroup: "collezioni", imageFocusIndex: 3 },
  { id: "col-summer", slug: "summer-wear", title: "Summer gym wear", description: "Leggero, traspirante, pronto per il caldo.", filterGroup: "collezioni", imageFocusIndex: 0 },
  { id: "col-winter", slug: "winter-wear", title: "Winter gym wear", description: "Layer caldi per sessioni fredde.", filterGroup: "collezioni", imageFocusIndex: 1 },
  { id: "col-sale", slug: "sale", title: "Sale", description: "Selezione in promozione — stock limitato.", filterGroup: "collezioni", imageFocusIndex: 2 },
];

export const shopProducts: ShopProduct[] = [
  {
    id: "ig-oversize-tee",
    name: "IronGym Oversize T-Shirt",
    description: "Cotone pesante, drop shoulder, logo discreto.",
    mainCategory: MAIN_CATEGORY,
    subcategoryId: "uomo-t-shirt",
    filterGroup: "uomo",
    gender: "uomo",
    price: 49,
    image: CATALOG_STUDIO_MODEL_01,
    imageFocusIndex: 0,
    tags: ["New", "Best Seller"],
  },
  {
    id: "ig-performance-tank",
    name: "IronGym Performance Tank",
    description: "Canotta racer-back, traspirante, per spalle libere.",
    mainCategory: MAIN_CATEGORY,
    subcategoryId: "uomo-tank",
    filterGroup: "uomo",
    gender: "uomo",
    price: 39,
    image: CATALOG_STUDIO_MODEL_01,
    imageFocusIndex: 1,
    tags: ["Best Seller"],
  },
  {
    id: "ig-compression-shirt",
    name: "IronGym Compression Shirt",
    description: "Fit aderente, supporto muscolare, finitura tecnica.",
    mainCategory: MAIN_CATEGORY,
    subcategoryId: "uomo-compression",
    filterGroup: "uomo",
    gender: "uomo",
    price: 59,
    image: CATALOG_STUDIO_MODEL_01,
    imageFocusIndex: 1,
    tags: ["New"],
  },
  {
    id: "ig-training-shorts",
    name: "IronGym Training Shorts",
    description: "Inseam 7\", vita stabile, tessuto resistente.",
    mainCategory: MAIN_CATEGORY,
    subcategoryId: "uomo-shorts",
    filterGroup: "uomo",
    gender: "uomo",
    price: 69,
    image: CATALOG_STUDIO_MODEL_01,
    imageFocusIndex: 3,
  },
  {
    id: "ig-premium-joggers",
    name: "IronGym Premium Joggers",
    description: "Fleece tecnico, taper pulito, tasche zip.",
    mainCategory: MAIN_CATEGORY,
    subcategoryId: "uomo-joggers",
    filterGroup: "uomo",
    gender: "uomo",
    price: 89,
    image: CATALOG_STUDIO_MODEL_01,
    imageFocusIndex: 3,
    tags: ["Best Seller"],
  },
  {
    id: "ig-hoodie",
    name: "IronGym Hoodie",
    description: "Felpa strutturata, interno brushed, hood profonda.",
    mainCategory: MAIN_CATEGORY,
    subcategoryId: "uomo-hoodie",
    filterGroup: "uomo",
    gender: "unisex",
    price: 119,
    image: CATALOG_STUDIO_MODEL_01,
    imageFocusIndex: 2,
    tags: ["Best Seller"],
  },
  {
    id: "ig-w-leggings",
    name: "IronGym Women Seamless Leggings",
    description: "Seamless sculpt, vita alta, zero cuciture visibili.",
    mainCategory: MAIN_CATEGORY,
    subcategoryId: "donna-leggings",
    filterGroup: "donna",
    gender: "donna",
    price: 79,
    image: CATALOG_STUDIO_MODEL_01,
    imageFocusIndex: 2,
    tags: ["New", "Best Seller"],
  },
  {
    id: "ig-sports-bra",
    name: "IronGym Sports Bra",
    description: "Supporto medio-alto, back design pulito.",
    mainCategory: MAIN_CATEGORY,
    subcategoryId: "donna-bra",
    filterGroup: "donna",
    gender: "donna",
    price: 45,
    image: CATALOG_STUDIO_MODEL_01,
    imageFocusIndex: 1,
    tags: ["New"],
  },
  {
    id: "ig-w-top",
    name: "IronGym Sport Top",
    description: "Top leggero, dry-touch, per training e cardio.",
    mainCategory: MAIN_CATEGORY,
    subcategoryId: "donna-top",
    filterGroup: "donna",
    gender: "donna",
    price: 42,
    image: CATALOG_STUDIO_MODEL_01,
    imageFocusIndex: 0,
  },
  {
    id: "ig-w-set",
    name: "IronGym Coordinated Set",
    description: "Top + leggings abbinati, palette Midnight Alloy.",
    mainCategory: MAIN_CATEGORY,
    subcategoryId: "donna-sets",
    filterGroup: "donna",
    gender: "donna",
    price: 129,
    image: CATALOG_STUDIO_MODEL_01,
    imageFocusIndex: 3,
    tags: ["New"],
  },
  {
    id: "ig-gloves",
    name: "IronGym Gym Gloves",
    description: "Palmo rinforzato, chiusura velcro, grip sicuro.",
    mainCategory: MAIN_CATEGORY,
    subcategoryId: "acc-gloves",
    filterGroup: "accessori",
    gender: "unisex",
    price: 35,
    image: CATALOG_STUDIO_MODEL_01,
    imageFocusIndex: 0,
  },
  {
    id: "ig-straps",
    name: "IronGym Lifting Straps",
    description: "Cotton blend, lunghezza pro, per deadlift e row.",
    mainCategory: MAIN_CATEGORY,
    subcategoryId: "acc-straps",
    filterGroup: "accessori",
    gender: "unisex",
    price: 29,
    image: CATALOG_STUDIO_MODEL_01,
    imageFocusIndex: 3,
  },
  {
    id: "ig-belt",
    name: "IronGym Lifting Belt",
    description: "Cintura 10mm, buckle steel, supporto lumbar.",
    mainCategory: MAIN_CATEGORY,
    subcategoryId: "acc-belt",
    filterGroup: "accessori",
    gender: "unisex",
    price: 89,
    image: CATALOG_STUDIO_MODEL_01,
    imageFocusIndex: 1,
    tags: ["Best Seller"],
  },
  {
    id: "ig-shaker",
    name: "IronGym Shaker Bottle",
    description: "700ml, chiusura leak-proof, finish opaco.",
    mainCategory: MAIN_CATEGORY,
    subcategoryId: "acc-bottle",
    filterGroup: "accessori",
    gender: "unisex",
    price: 24,
    image: CATALOG_STUDIO_MODEL_01,
    imageFocusIndex: 0,
  },
  {
    id: "ig-bag",
    name: "IronGym Training Bag",
    description: "Comparto scarpe, strap spalla, tasche organizzate.",
    mainCategory: MAIN_CATEGORY,
    subcategoryId: "acc-bag",
    filterGroup: "accessori",
    gender: "unisex",
    price: 95,
    image: CATALOG_STUDIO_MODEL_01,
    imageFocusIndex: 2,
    tags: ["Best Seller"],
  },
  {
    id: "ig-compression-line",
    name: "IronGym Compression Line Tee",
    description: "Parte della compression collection — fit second skin.",
    mainCategory: MAIN_CATEGORY,
    subcategoryId: "col-compression",
    filterGroup: "collezioni",
    gender: "unisex",
    price: 55,
    image: CATALOG_STUDIO_MODEL_01,
    imageFocusIndex: 1,
    tags: ["New"],
  },
  {
    id: "ig-sale-tee",
    name: "IronGym Core Tee — Sale",
    description: "Essential tee in promozione, colori limitati.",
    mainCategory: MAIN_CATEGORY,
    subcategoryId: "col-sale",
    filterGroup: "collezioni",
    gender: "unisex",
    price: 34,
    image: CATALOG_STUDIO_MODEL_01,
    imageFocusIndex: 0,
    tags: ["Sale"],
  },
];

export function formatPrice(chf: number): string {
  return `CHF ${chf}`;
}

function applyProductDefaults(product: ShopProduct): ShopProduct {
  const isAccessory = product.filterGroup === "accessori";
  const isOversize = product.name.toLowerCase().includes("oversize");

  return {
    ...product,
    longDescription:
      product.longDescription ??
      `${product.description} Progettato per sessioni intense in palestra. Finitura IronGym — minimal, resistente, pronto per ogni serie e ogni rep.`,
    sizes:
      product.sizes ??
      (isAccessory ? [...ACCESSORY_SIZES] : [...DEFAULT_SIZES]),
    colors:
      product.colors ??
      (isAccessory ? [...ACCESSORY_COLORS] : [...DEFAULT_COLORS]),
    images: product.images ?? [product.image],
    material:
      product.material ??
      (isAccessory
        ? "Nylon rinforzato / PU"
        : "Cotone tecnico con elastan"),
    fit:
      product.fit ??
      (isAccessory ? "Standard" : isOversize ? "Oversize" : "Regular fit"),
    careInstructions:
      product.careInstructions ??
      "Lavaggio a 30°C. Non candeggiare. Non asciugatrice. Stirare a bassa temperatura.",
  };
}

export function getProductById(id: string): ShopProduct | undefined {
  const product = shopProducts.find((p) => p.id === id);
  return product ? applyProductDefaults(product) : undefined;
}

export function getAllProductIds(): string[] {
  return shopProducts.map((p) => p.id);
}

export function getSimilarProducts(
  product: ShopProduct,
  limit = 4
): ShopProduct[] {
  const scored = shopProducts
    .filter((p) => p.id !== product.id)
    .map((p) => {
      let score = 0;
      if (p.subcategoryId === product.subcategoryId) score += 3;
      if (p.filterGroup === product.filterGroup) score += 2;
      if (p.gender === product.gender) score += 1;
      return { p, score };
    })
    .sort((a, b) => b.score - a.score);

  const picked = scored.filter((s) => s.score > 0).map((s) => s.p);
  const fallback = shopProducts.filter((p) => p.id !== product.id);
  const list = picked.length > 0 ? picked : fallback;

  return list.slice(0, limit).map(applyProductDefaults);
}

export function isShopFilterGroup(slug: string): slug is ShopFilterGroup {
  return shopGroups.some((g) => g.slug === slug);
}

export function getShopGroupBySlug(slug: string): ShopGroup | undefined {
  return shopGroups.find((g) => g.slug === slug);
}

export function getGroupPath(groupSlug: ShopFilterGroup): string {
  return `/shop/${groupSlug}`;
}

export function getSubcategoryPath(sub: ShopSubcategory): string {
  return `/shop/${sub.filterGroup}/${sub.slug}`;
}

export function getProductPath(productId: string): string {
  return `/shop/product/${productId}`;
}

export function getSubcategoryById(id: string): ShopSubcategory | undefined {
  return shopSubcategories.find((s) => s.id === id);
}

export function getSubcategoryBySlug(
  groupSlug: string,
  subcategorySlug: string
): ShopSubcategory | undefined {
  if (!isShopFilterGroup(groupSlug)) return undefined;
  return shopSubcategories.find(
    (s) => s.filterGroup === groupSlug && s.slug === subcategorySlug
  );
}

export function getSubcategoriesByGroupSlug(
  groupSlug: string
): ShopSubcategory[] {
  if (!isShopFilterGroup(groupSlug)) return [];
  return shopSubcategories.filter((s) => s.filterGroup === groupSlug);
}

/** @deprecated Usa getSubcategoriesByGroupSlug */
export function filterSubcategories(group: ShopFilterGroup | "all"): ShopSubcategory[] {
  if (group === "all") return shopSubcategories;
  return getSubcategoriesByGroupSlug(group);
}

export function getAllGroupSlugs(): ShopFilterGroup[] {
  return shopGroups.map((g) => g.slug);
}

export function getAllSubcategoryParams(): {
  group: ShopFilterGroup;
  subcategory: string;
}[] {
  return shopSubcategories.map((s) => ({
    group: s.filterGroup,
    subcategory: s.slug,
  }));
}

export function getProductsByGroupSlug(groupSlug: string): ShopProduct[] {
  if (!isShopFilterGroup(groupSlug)) return [];
  return shopProducts
    .filter((p) => p.filterGroup === groupSlug)
    .map(applyProductDefaults);
}

export function getProductsBySubcategorySlug(
  groupSlug: string,
  subcategorySlug: string
): ShopProduct[] {
  const sub = getSubcategoryBySlug(groupSlug, subcategorySlug);
  if (!sub) return [];

  if (sub.filterGroup === "collezioni") {
    return productsForCollection(sub.id).map(applyProductDefaults);
  }

  return shopProducts
    .filter((p) => p.subcategoryId === sub.id)
    .map(applyProductDefaults);
}

export function filterProducts(
  group: ShopFilterGroup | "all",
  subcategoryId: string | null
): ShopProduct[] {
  let list = shopProducts;
  if (group !== "all") {
    list = list.filter((p) => p.filterGroup === group);
  }
  if (subcategoryId) {
    list = list.filter((p) => p.subcategoryId === subcategoryId);
  }
  return list.map(applyProductDefaults);
}

/** Prodotti legati a una collezione (per card collezioni senza match diretto) */
export function productsForCollection(subcategoryId: string): ShopProduct[] {
  const map: Record<string, (p: ShopProduct) => boolean> = {
    "col-new": (p) => p.tags?.includes("New") ?? false,
    "col-bestseller": (p) => p.tags?.includes("Best Seller") ?? false,
    "col-oversize": (p) => p.name.toLowerCase().includes("oversize"),
    "col-compression": (p) =>
      p.name.toLowerCase().includes("compression") || p.subcategoryId.includes("compression"),
    "col-summer": (p) => ["uomo-shorts", "uomo-tank", "donna-shorts", "donna-top"].includes(p.subcategoryId),
    "col-winter": (p) => ["uomo-hoodie", "donna-hoodie", "uomo-joggers", "donna-joggers"].includes(p.subcategoryId),
    "col-sale": (p) => p.tags?.includes("Sale") ?? false,
  };
  const fn = map[subcategoryId];
  if (!fn) return shopProducts.filter((p) => p.filterGroup === "collezioni");
  return shopProducts.filter(fn);
}

export function getProductsForView(
  group: ShopFilterGroup | "all",
  subcategoryId: string | null
): ShopProduct[] {
  if (subcategoryId?.startsWith("col-")) {
    const colProducts = productsForCollection(subcategoryId);
    if (group === "all" || group === "collezioni") {
      return colProducts.map(applyProductDefaults);
    }
    return colProducts
      .filter((p) => p.filterGroup === group)
      .map(applyProductDefaults);
  }
  return filterProducts(group, subcategoryId);
}

export function isProductId(segment: string): boolean {
  return shopProducts.some((p) => p.id === segment);
}

export { productImageFocusClasses };
