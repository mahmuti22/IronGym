import { AdminShell } from "@/components/admin/AdminShell";
import { OrderDetailView } from "@/components/admin/OrderDetailView";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <AdminShell
      title="Dettaglio ordine"
      description="Cliente, articoli e aggiornamento status."
    >
      <OrderDetailView orderId={id} />
    </AdminShell>
  );
}
