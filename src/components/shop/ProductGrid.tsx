import type { ShopProduct } from "@/data/shop";
import { ProductCard } from "./ProductCard";

type ProductGridProps = {
  products: ShopProduct[];
  emptyMessage?: string;
};

export function ProductGrid({
  products,
  emptyMessage = "Prodotti in arrivo — questa selezione sarà presto disponibile.",
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-silver-500/25 bg-white/[0.03] px-6 py-16 text-center">
        <p className="text-sm font-medium text-silver-400">{emptyMessage}</p>
        <p className="mt-2 text-sm text-silver-600">
          Torna presto per nuovi drop IronGym.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <div key={product.id} className="h-full">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
