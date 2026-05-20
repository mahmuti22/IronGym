import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProductsTable } from "@/components/admin/ProductsTable";

export default function AdminProductsPage() {
  return (
    <AdminShell
      title="Prodotti"
      description="Gestisci il catalogo Abbigliamento Gym."
      action={
        <Link
          href="/admin/products/new"
          className="inline-flex min-h-10 items-center rounded-full bg-white px-5 text-sm font-semibold text-iron-950 transition hover:bg-silver-300"
        >
          + Nuovo prodotto
        </Link>
      }
    >
      <ProductsTable />
    </AdminShell>
  );
}
