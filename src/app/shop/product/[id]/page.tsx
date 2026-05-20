import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductDetail } from "@/components/shop/ProductDetail";
import { getAllProductIds } from "@/data/shop";
import {
  getCatalogProductBySlug,
  getCatalogSimilarProducts,
  getCatalogSubcategoryBySlug,
} from "@/lib/shop/catalog";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  return getAllProductIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const { product } = await getCatalogProductBySlug(id);

  if (!product) {
    return { title: "Prodotto non trovato — IronGym" };
  }

  return {
    title: `${product.name} — IronGym Shop`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const { product, catalog } = await getCatalogProductBySlug(id);

  if (!product) {
    notFound();
  }

  const sub = product.subcategorySlug
    ? getCatalogSubcategoryBySlug(
        catalog,
        product.filterGroup,
        product.subcategorySlug
      )
    : catalog.subcategories.find(
        (s) =>
          s.id === product.subcategoryId ||
          s.id === product.subcategoryUuid
      );

  const similar = getCatalogSimilarProducts(catalog, product, 4);

  return (
    <>
      <Header />
      <main className="border-b border-white/[0.06] pt-20 pb-20 sm:pb-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <ProductDetail
            product={product}
            subcategoryTitle={sub?.title ?? null}
            similarProducts={similar}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
