import { AdminProvider } from "@/components/admin/AdminProvider";
import { requireAdminSession } from "@/lib/admin/auth";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminSession();
  return <AdminProvider>{children}</AdminProvider>;
}
