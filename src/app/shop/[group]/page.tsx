import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ShopBreadcrumbs } from "@/components/shop/ShopBreadcrumbs";
import { CategoryCard } from "@/components/shop/CategoryCard";
import { ProductGrid } from "@/components/shop/ProductGrid";
import {
  MAIN_CATEGORY,
  getAllGroupSlugs,
  getProductsByGroupSlug,
  getShopGroupBySlug,
  getSubcategoriesByGroupSlug,
  SHOP_RESERVED_SEGMENTS,
} from "@/data/shop";

type PageProps = {
  params: Promise<{ group: string }>;
};

export async function generateStaticParams() {
  return getAllGroupSlugs().map((group) => ({ group }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { group } = await params;
  const shopGroup = getShopGroupBySlug(group);
  if (!shopGroup) return { title: "Categoria non trovata — IronGym" };
  return {
    title: `${shopGroup.title} — Shop IronGym`,
    description: shopGroup.description,
  };
}

export default async function ShopGroupPage({ params }: PageProps) {
  const { group } = await params;

  if (SHOP_RESERVED_SEGMENTS.includes(group as (typeof SHOP_RESERVED_SEGMENTS)[number])) {
    notFound();
  }

  const shopGroup = getShopGroupBySlug(group);
  if (!shopGroup) {
    notFound();
  }

  const subcategories = getSubcategoriesByGroupSlug(group);
  const products = getProductsByGroupSlug(group);

  return (
    <>
      <Header />
      <main className="border-b border-white/[0.06] pt-20 pb-20 sm:pb-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <ShopBreadcrumbs
            items={[
              { label: "Shop", href: "/shop" },
              { label: shopGroup.title },
            ]}
          />

          <div className="mt-8 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-silver-600">
              {MAIN_CATEGORY}
            </p>
            <h1 className="mt-3 font-display text-4xl tracking-wide text-silver-100 sm:text-5xl lg:text-6xl">
              {shopGroup.title}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-silver-500">
              {shopGroup.description}
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-flex text-sm font-semibold text-silver-400 transition hover:text-silver-200"
            >
              ← Torna allo Shop
            </Link>
          </div>

          <section className="mt-14" aria-labelledby="group-subs">
            <h2
              id="group-subs"
              className="text-lg font-semibold tracking-tight text-silver-200"
            >
              Sottocategorie
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {subcategories.map((sub) => (
                <CategoryCard key={sub.id} category={sub} />
              ))}
            </div>
          </section>

          <section
            className="mt-14 border-t border-white/[0.06] pt-14"
            aria-labelledby="group-products"
          >
            <h2
              id="group-products"
              className="text-lg font-semibold tracking-tight text-silver-200"
            >
              Tutti i prodotti — {shopGroup.title}
            </h2>
            <p className="mt-1 text-sm text-silver-500">
              {products.length}{" "}
              {products.length === 1 ? "prodotto" : "prodotti"}
            </p>
            <div className="mt-8">
              <ProductGrid products={products} />
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
