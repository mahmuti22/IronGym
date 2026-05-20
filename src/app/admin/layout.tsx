import type { Metadata } from "next";
import { AdminProvider } from "@/components/admin/AdminProvider";

export const metadata: Metadata = {
  title: "Admin — IronGym",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminProvider>{children}</AdminProvider>;
}
