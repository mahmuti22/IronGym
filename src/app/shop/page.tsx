import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ShopLanding } from "@/components/shop/ShopLanding";
import { ShopLegacyRedirect } from "@/components/shop/ShopLegacyRedirect";
import { getShopCatalog } from "@/lib/shop/catalog";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Shop — Abbigliamento Gym | IronGym",
  description:
    "Abbigliamento gym IronGym: uomo, donna, accessori e collezioni. Naviga per categoria e scopri ogni linea.",
};

export default async function ShopPage() {
  const catalog = await getShopCatalog();

  return (
    <>
      <Suspense fallback={null}>
        <ShopLegacyRedirect />
      </Suspense>
      <Header />
      <main className="border-b border-white/[0.06] pt-20 pb-20 sm:pb-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <ShopLanding
            groups={catalog.groups}
            subcategories={catalog.subcategories}
            products={catalog.products}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
