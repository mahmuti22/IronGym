import { AdminShell } from "@/components/admin/AdminShell";
import { CollectionsView } from "@/components/admin/CollectionsView";

export default function AdminCollectionsPage() {
  return (
    <AdminShell
      title="Collezioni"
      description="New arrivals, best seller, oversize, sale e linee stagionali."
    >
      <CollectionsView />
    </AdminShell>
  );
}
