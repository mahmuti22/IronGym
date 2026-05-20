import { AdminShell } from "@/components/admin/AdminShell";
import { ProductForm } from "@/components/admin/ProductForm";

export default function AdminNewProductPage() {
  return (
    <AdminShell
      title="Nuovo prodotto"
      description="Compila il form e salva nel database Supabase."
    >
      <ProductForm />
    </AdminShell>
  );
}
