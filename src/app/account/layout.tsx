import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AccountNav } from "@/components/customer/AccountNav";
import { requireCustomerSession } from "@/lib/customer/auth";

export const metadata: Metadata = {
  title: "Il mio account | IronGym",
  robots: { index: false },
};

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile } = await requireCustomerSession();
  const name =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
    user.email?.split("@")[0] ||
    "Cliente";

  return (
    <>
      <Header />
      <main className="border-b border-white/[0.06] pt-20 pb-20 sm:pb-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-silver-600">
            Il mio account
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-silver-100 sm:text-4xl">
            Ciao, {name}
          </h1>
          <AccountNav />
          <div className="mt-10">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}
