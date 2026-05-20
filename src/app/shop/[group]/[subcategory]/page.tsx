import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ShopBreadcrumbs } from "@/components/shop/ShopBreadcrumbs";
import { ProductGrid } from "@/components/shop/ProductGrid";
import {
  MAIN_CATEGORY,
  getAllSubcategoryParams,
  getGroupPath,
  getProductsBySubcategorySlug,
  getShopGroupBySlug,
  getSubcategoryBySlug,
  SHOP_RESERVED_SEGMENTS,
  shopFilterLabels,
} from "@/data/shop";

type PageProps = {
  params: Promise<{ group: string; subcategory: string }>;
};

export async function generateStaticParams() {
  return getAllSubcategoryParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { group, subcategory } = await params;
  const sub = getSubcategoryBySlug(group, subcategory);
  if (!sub) return { title: "Sottocategoria non trovata — IronGym" };
  return {
    title: `${sub.title} — ${shopFilterLabels[sub.filterGroup]} | IronGym`,
    description: sub.description,
  };
}

export default async function ShopSubcategoryPage({ params }: PageProps) {
  const { group, subcategory } = await params;

  if (SHOP_RESERVED_SEGMENTS.includes(group as (typeof SHOP_RESERVED_SEGMENTS)[number])) {
    notFound();
  }

  const shopGroup = getShopGroupBySlug(group);
  const sub = getSubcategoryBySlug(group, subcategory);

  if (!shopGroup || !sub) {
    notFound();
  }

  const products = getProductsBySubcategorySlug(group, subcategory);

  return (
    <>
      <Header />
      <main className="border-b border-white/[0.06] pt-20 pb-20 sm:pb-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <ShopBreadcrumbs
            items={[
              { label: "Shop", href: "/shop" },
              { label: shopGroup.title, href: getGroupPath(shopGroup.slug) },
              { label: sub.title },
            ]}
          />

          <div className="mt-8 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-silver-600">
              {MAIN_CATEGORY} · {shopGroup.title}
            </p>
            <h1 className="mt-3 font-display text-4xl tracking-wide text-silver-100 sm:text-5xl">
              {sub.title}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-silver-500">
              {sub.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href={getGroupPath(shopGroup.slug)}
                className="text-sm font-semibold text-silver-400 transition hover:text-silver-200"
              >
                ← Torna a {shopGroup.title}
              </Link>
              <Link
                href="/shop"
                className="text-sm font-semibold text-silver-600 transition hover:text-silver-400"
              >
                Shop
              </Link>
            </div>
          </div>

          <section
            className="mt-14 border-t border-white/[0.06] pt-14"
            aria-labelledby="sub-products"
          >
            <h2 id="sub-products" className="sr-only">
              Prodotti {sub.title}
            </h2>
            <p className="mb-8 text-sm text-silver-500">
              {products.length}{" "}
              {products.length === 1 ? "prodotto" : "prodotti"} in questa linea
            </p>
            <ProductGrid products={products} />
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
