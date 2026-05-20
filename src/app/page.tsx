import { Header } from "@/components/Header";
import { LogoIntro } from "@/components/LogoIntro";
import { Hero } from "@/components/Hero";
import { ProductSection } from "@/components/ProductSection";
import { BrandStory } from "@/components/BrandStory";
import { Features } from "@/components/Features";
import { Newsletter } from "@/components/Newsletter";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <LogoIntro />
        <Hero />
        <ProductSection />
        <BrandStory />
        <Features />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
