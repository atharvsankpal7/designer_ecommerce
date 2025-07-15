import { HeroSection } from '@/components/home/hero-section';
import { ProductSlider } from '@/components/home/product-slider';
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
        <WhatsNew />
      </main>
      <Footer />
    </div>
  );
}