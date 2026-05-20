import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { AboutUs } from "@/components/AboutUs";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "About us — IronGym",
  description:
    "Meet the IronGym co-founders and the discipline behind every piece we make.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="pt-20">
        <AboutUs />
      </main>
      <Footer />
    </>
  );
}
