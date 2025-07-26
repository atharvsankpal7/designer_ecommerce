import { HeroSlider } from '@/components/home/hero-slider';
import { HeroSection } from '@/components/home/hero-section';
import { ProductSlider } from '@/components/home/product-slider';
import { BundleSection } from '@/components/home/bundle-section';
import { WhatsNew } from '@/components/home/whats-new';
import { HomepageSections } from '@/components/home/homepage-sections';
import { SSRHeader } from '@/components/layout/ssr-header';
import { Footer } from '@/components/layout/footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SSCreation - Premium Graphic Design Templates | Festival Designs & Business Templates',
  description: 'Discover SSCreation\'s premium graphic design templates. Download festival designs, business cards, social media templates, and celebration graphics instantly. Commercial license included.',
  keywords: 'SSCreation, sscreation, graphic design templates, festival designs, premium templates, business templates, social media templates, poster designs, banner templates, celebration graphics',
  openGraph: {
    title: 'SSCreation - Premium Graphic Design Templates',
    description: 'Discover SSCreation\'s premium graphic design templates. Download festival designs, business cards, and social media templates instantly.',
    url: 'https://sscreation.com',
  },
  alternates: {
    canonical: 'https://sscreation.com',
  },
};

export default function Home() {
  return (
    <div className="min-h-screen">
      <SSRHeader />
      <main>
        <HeroSlider />
        <ProductSlider />
        <HomepageSections />
        <BundleSection />
        <WhatsNew />
      </main>
      <Footer />
    </div>
  );
}