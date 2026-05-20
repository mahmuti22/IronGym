import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { LoginForm } from "@/components/LoginForm";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Anmelden — IronGym",
  description: "Melde dich bei IronGym an — Bestellungen, Drops und dein Mitgliederkonto.",
};

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100dvh-5rem)] pt-20">
        <LoginForm />
      </main>
      <Footer />
    </>
  );
}
