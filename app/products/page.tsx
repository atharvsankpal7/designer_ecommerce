import { Suspense } from 'react';
import ProductClientPage from "@/components/client-product";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Products - SSCreation | Premium Graphic Design Templates Collection',
  description: 'Browse SSCreation\'s complete collection of premium graphic design templates. Find festival designs, business templates, social media graphics, and celebration designs. Instant download with commercial license.',
  keywords: 'SSCreation products, graphic design templates, premium templates collection, festival designs, business templates, social media templates, poster templates, banner designs, celebration graphics, design marketplace',
  openGraph: {
    title: 'All Products - SSCreation | Premium Graphic Design Templates',
    description: 'Browse SSCreation\'s complete collection of premium graphic design templates. Instant download with commercial license.',
    url: 'https://sscreation.com/products',
  },
  alternates: {
    canonical: 'https://sscreation.com/products',
  },
};

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
      <ProductClientPage />
    </Suspense>
  );
}
