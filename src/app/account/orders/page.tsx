import { CustomerOrdersList } from "@/components/customer/CustomerOrdersList";

export default function AccountOrdersPage() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-silver-100">I miei ordini</h2>
      <p className="mt-1 text-sm text-silver-500">
        Ordini collegati al tuo account o alla tua email.
      </p>
      <div className="mt-6">
        <CustomerOrdersList />
      </div>
    </div>
  );
}
