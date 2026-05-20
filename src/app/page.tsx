import { Header } from "@/components/Header";
import { HomeIntroAnimation } from "@/components/HomeIntroAnimation";
import { LogoIntro } from "@/components/LogoIntro";
import { Hero } from "@/components/Hero";
import { ProductSection } from "@/components/ProductSection";
import { ShopPreview } from "@/components/ShopPreview";
import { BrandStory } from "@/components/BrandStory";
import { Features } from "@/components/Features";
import { Newsletter } from "@/components/Newsletter";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <HomeIntroAnimation />
      <Header />
      <main>
        <LogoIntro />
        <div
          id="home-content-start"
          className="scroll-mt-[5.75rem] sm:scroll-mt-24"
          aria-hidden
        />
        <Hero />
        <ProductSection />
        <ShopPreview />
        <BrandStory />
        <Features />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
