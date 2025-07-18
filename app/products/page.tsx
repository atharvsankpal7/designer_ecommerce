import { Suspense } from 'react';
import ProductClientPage from "@/components/client-product";

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
      <ProductClientPage />
    </Suspense>
  );
}
