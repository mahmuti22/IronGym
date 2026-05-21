import { CustomerProfileForm } from "@/components/customer/CustomerProfileForm";
import { requireCustomerSession } from "@/lib/customer/auth";

export default async function AccountProfilePage() {
  const { user, profile } = await requireCustomerSession();

  if (!profile) {
    return null;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-silver-100">Profilo</h2>
      <p className="mt-1 text-sm text-silver-500">
        Dati usati per precompilare il checkout.
      </p>
      <div className="mt-6">
        <CustomerProfileForm
          userId={user.id}
          profile={profile}
          email={user.email ?? profile.email}
        />
      </div>
    </div>
  );
}
