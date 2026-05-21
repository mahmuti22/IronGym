import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProductsTable } from "@/components/admin/ProductsTable";
import { adminBtnPrimaryClass } from "@/components/admin/admin-ui";

export default function AdminProductsPage() {
  return (
    <AdminShell
      title="Prodotti"
      description="Gestisci il catalogo Abbigliamento Gym."
      action={
        <Link
          href="/admin/products/new"
          className={adminBtnPrimaryClass}
        >
          + Nuovo prodotto
        </Link>
      }
    >
      <ProductsTable />
    </AdminShell>
  );
}
