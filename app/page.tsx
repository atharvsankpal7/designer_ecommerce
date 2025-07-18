import { HeroSection } from '@/components/home/hero-section';
import { ProductSlider } from '@/components/home/product-slider';
import { BundleSection } from '@/components/home/bundle-section';
import { WhatsNew } from '@/components/home/whats-new';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <ProductSlider />
        <BundleSection />
        <WhatsNew />
      </main>
      <Footer />
    </div>
  );
}