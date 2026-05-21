import { AdminShell } from "@/components/admin/AdminShell";
import { OrdersTable } from "@/components/admin/OrdersTable";

export default function AdminOrdersPage() {
  return (
    <AdminShell
      title="Ordini"
      description="Gestisci gli ordini ricevuti dallo shop."
    >
      <OrdersTable />
    </AdminShell>
  );
}
