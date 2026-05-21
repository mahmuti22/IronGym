import { AdminShell } from "@/components/admin/AdminShell";
import { ProductForm } from "@/components/admin/ProductForm";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditProductPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <AdminShell
      title="Modifica prodotto"
      description="Aggiorna i dati del prodotto nel catalogo."
    >
      <ProductForm mode="edit" productId={id} />
    </AdminShell>
  );
}
