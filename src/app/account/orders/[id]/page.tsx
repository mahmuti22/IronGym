import { CustomerOrderDetail } from "@/components/customer/CustomerOrderDetail";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AccountOrderDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div>
      <h2 className="sr-only">Dettaglio ordine</h2>
      <CustomerOrderDetail orderId={id} />
    </div>
  );
}
