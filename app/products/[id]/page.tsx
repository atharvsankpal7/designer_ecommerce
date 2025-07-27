import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import Image from 'next/image';
import { ProductDetailClient } from '@/components/products/product-detail-client';
import { getProductById } from '@/lib/actions';

interface Product {
  id: string;
  title: string;
  description: string;
  displayImage: string;
  originalPrice: number;
  discountPrice?: number;
  isFeatured: boolean;
  createdAt: string;
}

interface ProductDetailProps {
  params: {
    id: string;
  };
}

// Server-side function to fetch product data
async function getProduct(id: string): Promise<Product | null> {
  try {
    return await getProductById(id);
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function ProductDetail({ params }: ProductDetailProps) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  const discountPercentage = product.discountPrice 
    ? Math.round(((product.originalPrice - product.discountPrice) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 border">
              <Image
                src={product.displayImage}
                alt={product.title}
                fill
                className="object-contain p-4"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              
              {product.isFeatured && (
                <Badge className="absolute top-4 left-4 bg-yellow-500">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}

              {product.discountPrice && (
                <Badge className="absolute top-4 right-4 bg-red-500">
                  {discountPercentage}% OFF
                </Badge>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Pricing */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                {product.discountPrice ? (
                  <>
                    <span className="text-3xl font-bold text-primary">
                      ₹{product.discountPrice}
                    </span>
                    <span className="text-xl text-gray-500 line-through">
                      ₹{product.originalPrice}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold">
                    ₹{product.originalPrice}
                  </span>
                )}
              </div>
              {product.discountPrice && (
                <p className="text-green-600 font-medium">
                  You save ₹{product.originalPrice - product.discountPrice} ({discountPercentage}% off)
                </p>
              )}
            </div>

            {/* Client-side interactive components */}
            <ProductDetailClient product={product} />

            {/* Additional Info */}
            <div className="border-t pt-6 space-y-4">
              <div className="text-sm text-gray-600">
                <h3 className="font-semibold text-gray-900 mb-2">Product Information</h3>
                <ul className="space-y-1">
                  <li>• Digital download available after purchase</li>
                  <li>• High-quality design files included</li>
                  <li>• Instant access to your purchase</li>
                  <li>• Customer support available</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductDetailProps) {
  const product = await getProduct(params.id);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: [product.displayImage],
    },
  };
}