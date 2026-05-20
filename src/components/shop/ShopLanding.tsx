import {
  MAIN_CATEGORY,
  shopGroups,
  shopSubcategories,
  shopProducts,
  getSubcategoryPath,
  getProductById,
} from "@/data/shop";
import { GroupCard } from "./GroupCard";
import { CategoryCard } from "./CategoryCard";
import { ProductGrid } from "./ProductGrid";

const featuredSubcategoryIds = [
  "uomo-joggers",
  "donna-leggings",
  "acc-gloves",
  "col-new",
  "uomo-hoodie",
  "donna-bra",
  "acc-bag",
  "col-bestseller",
];

export function ShopLanding() {
  const featuredSubs = featuredSubcategoryIds
    .map((id) => shopSubcategories.find((s) => s.id === id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const featuredProducts = shopProducts
    .filter((p) => p.tags?.includes("Best Seller") || p.tags?.includes("New"))
    .slice(0, 4)
    .map((p) => getProductById(p.id)!)
    .filter(Boolean);

  return (
    <div className="space-y-16 sm:space-y-20">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-silver-600">
          {MAIN_CATEGORY}
        </p>
        <h1 className="mt-3 font-display ig-title-shimmer text-4xl tracking-wide sm:text-5xl lg:text-6xl">
          Shop
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-silver-500">
          Scegli una categoria e scopri sottocategorie e prodotti su pagine
          dedicate — nessun filtro inline, solo navigazione pulita.
        </p>
      </div>

      <section aria-labelledby="shop-groups-heading">
        <h2
          id="shop-groups-heading"
          className="text-lg font-semibold tracking-tight text-silver-200 sm:text-xl"
        >
          Categorie principali
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {shopGroups.map((group) => (
            <GroupCard key={group.slug} group={group} />
          ))}
        </div>
      </section>

      <section aria-labelledby="shop-subs-heading">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2
            id="shop-subs-heading"
            className="text-lg font-semibold tracking-tight text-silver-200 sm:text-xl"
          >
            Sottocategorie
          </h2>
          <p className="text-xs text-silver-600">
            {shopSubcategories.length} linee disponibili
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredSubs.map((sub) => (
            <CategoryCard
              key={sub.id}
              category={sub}
              href={getSubcategoryPath(sub)}
            />
          ))}
        </div>
      </section>

      <section aria-labelledby="shop-featured-heading">
        <div className="flex flex-wrap items-end justify-between gap-4 border-t border-white/[0.06] pt-12">
          <div>
            <h2
              id="shop-featured-heading"
              className="text-lg font-semibold tracking-tight text-silver-200 sm:text-xl"
            >
              In evidenza
            </h2>
            <p className="mt-1 text-sm text-silver-500">
              Anteprima — apri il prodotto per taglie e dettagli
            </p>
          </div>
        </div>
        <div className="mt-8">
          <ProductGrid products={featuredProducts} />
        </div>
      </section>
    </div>
  );
}
