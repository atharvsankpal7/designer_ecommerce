'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { SSRHeader } from '@/components/layout/ssr-header';
import { Footer } from '@/components/layout/footer';
import { PurchaseModal } from '@/components/products/purchase-modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ShoppingCart, Star, Share2 } from 'lucide-react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';

interface Product {
  id: string;
  title: string;
  description: string;
  displayImage: string;
  originalPrice: number;
  discountPrice?: number;
 
  isFeatured: boolean;
}

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) {
        throw new Error('Product not found');
      }
      const data = await response.json();
      setProduct(data);
    } catch (error : any) {
      console.error('Error fetching product:', error);
      router.push('/products');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = () => {
    if (product) {
      setShowPurchaseModal(true);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.title,
          text: product?.description,
          url: window.location.href,
        });
      } catch (error : any) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <SSRHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <SSRHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <Button onClick={() => router.push('/products')}>
              Back to Products
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const discountPercentage = product.discountPrice 
    ? Math.round(((product.originalPrice - product.discountPrice) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen">
      <SSRHeader />
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 border">
              <Image
                src={product.displayImage}
                alt={product.title}
                fill
                className="object-contain p-4 cursor-pointer hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                onClick={() => setExpandedImage(product.displayImage)}
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
              <Badge variant="secondary" className="mb-3">
                {/* {product?.section?.name} */}
              </Badge>
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

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button
                size="lg"
                onClick={handlePurchase}
                className="w-full text-lg py-6"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Buy Now
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={handleShare}
                className="w-full"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Product
              </Button>
            </div>

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
      <Footer />

      {/* Purchase Modal */}
      <PurchaseModal
        product={product}
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
      />

      {/* Image Expansion Modal */}
      <Dialog
        open={!!expandedImage}
        onOpenChange={(open) => !open && setExpandedImage(null)}
      >
        <DialogContent className="p-0 bg-transparent border-none max-w-[95vw] max-h-[90vh] w-auto h-auto flex items-center justify-center">
          {expandedImage && (
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={expandedImage}
                alt="Expanded product view"
                width={1200}
                height={1200}
                className="object-contain max-w-full max-h-[85vh]"
                priority
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}