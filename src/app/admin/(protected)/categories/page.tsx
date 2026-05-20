import { AdminShell } from "@/components/admin/AdminShell";
import { CategoriesView } from "@/components/admin/CategoriesView";

export default function AdminCategoriesPage() {
  return (
    <AdminShell
      title="Categorie"
      description="Uomo, donna, accessori e sottocategorie collegate."
    >
      <CategoriesView />
    </AdminShell>
  );
}
