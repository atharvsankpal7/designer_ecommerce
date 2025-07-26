import { Footer } from '@/components/layout/footer';
import { SSRHeader } from '@/components/layout/ssr-header';
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Design Bundles - SSCreation | Premium Graphic Design Template Collections',
  description: 'Explore SSCreation\'s exclusive design bundles featuring multiple premium graphic design templates at incredible value. Perfect for businesses, events, and creative projects. Save up to 70% on bundle collections.',
  keywords: 'SSCreation bundles, design bundles, graphic design collections, premium template bundles, festival design bundles, business template collections, bulk design templates, discounted design packages',
  openGraph: {
    title: 'Design Bundles - SSCreation | Premium Template Collections',
    description: 'Explore SSCreation\'s exclusive design bundles featuring multiple premium templates at incredible value. Save up to 70% on bundle collections.',
    url: 'https://sscreation.com/bundles',
  },
  alternates: {
    canonical: 'https://sscreation.com/bundles',
  },
};

export default function BundlesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}