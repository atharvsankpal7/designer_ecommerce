'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { SSRHeader } from '@/components/layout/ssr-header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BundlePurchaseModal } from '@/components/bundles/bundle-purchase-modal';
import { Package, ArrowLeft, ShoppingCart, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Bundle {
  id: string;
  name: string;
  description: string;
  displayImage: string;
  originalPrice: number;
  discountPrice?: number;
  products: {
    id: string;
    title: string;
    description: string;
    displayImage: string;
    originalPrice: number;
    discountPrice?: number;
  }[];
}

export default function BundleDetail() {
  const params = useParams();
  const [bundle, setBundle] = useState<Bundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchBundle(params.id as string);
    }
  }, [params.id]);

  const fetchBundle = async (id: string) => {
    try {
      const response = await fetch(`/api/bundles/${id}`);
      if (response.ok) {
        const data = await response.json();
        setBundle(data);
      }
    } catch (error : any) {
      console.error('Error fetching bundle:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <main>
          <section className="py-8 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="animate-pulse">
                <div className="h-10 bg-gray-200 rounded w-32 mb-6"></div>
                
                <div className="grid lg:grid-cols-2 gap-12 mb-16">
                  <div className="aspect-square bg-gray-200 rounded-2xl"></div>
                  <div className="flex flex-col justify-center space-y-6">
                    <div className="h-10 bg-gray-200 rounded w-3/4"></div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 bg-gray-200 rounded w-32"></div>
                        <div className="h-8 bg-gray-200 rounded w-24"></div>
                      </div>
                      <div className="h-6 bg-gray-200 rounded w-48"></div>
                      <div className="h-4 bg-gray-200 rounded w-64"></div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-56"></div>
                    <div className="h-14 bg-gray-200 rounded-xl"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="h-8 bg-gray-200 rounded w-80 mx-auto mb-12"></div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, index) => (
                  <Card key={index} className="overflow-hidden animate-pulse">
                    <CardContent className="p-0">
                      <div className="h-48 bg-gray-200"></div>
                      <div className="p-4 space-y-3">
                        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                        <div className="space-y-2">
                          <div className="h-3 bg-gray-200 rounded"></div>
                          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="h-6 bg-gray-200 rounded w-20"></div>
                          <div className="h-5 bg-gray-200 rounded w-16"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  if (!bundle) {
    return (
      <div className="min-h-screen">
        <main className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Bundle not found</h1>
            <Button asChild>
              <Link href="/bundles">Back to Bundles</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const totalOriginalPrice = bundle.products.reduce((sum, product) => sum + product.originalPrice, 0);
  const totalSavings = totalOriginalPrice - (bundle.discountPrice || bundle.originalPrice);

  return (
    <div className="min-h-screen">
      <main>
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <Button asChild variant="outline" className="mb-6">
              <Link href="/bundles">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Bundles
              </Link>
            </Button>

            <div className="grid lg:grid-cols-2 gap-12 mb-16">
              <div className="relative">
                <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src={bundle.displayImage}
                    alt={bundle.name}
                    fill
                    className="object-contain p-8"
                  />
                </div>
                <Badge className="absolute top-4 left-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 shadow-lg">
                  <Package className="h-3 w-3 mr-1" />
                  Bundle
                </Badge>
              </div>

              <div className="flex flex-col justify-center">
                <h1 className="text-4xl font-bold mb-6 text-gray-900">{bundle.name}</h1>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">{bundle.description}</p>

                <div className="mb-8">
                  <div className="flex items-center space-x-4 mb-4">
                    {bundle.discountPrice && (
                      <span className="text-4xl font-bold text-emerald-600">
                        ₹{bundle.discountPrice.toLocaleString()}
                      </span>
                    )}
                    <span
                      className={`${
                        bundle.discountPrice
                          ? "line-through text-gray-400 text-2xl"
                          : "text-4xl font-bold text-gray-900"
                      }`}
                    >
                      ₹{bundle.originalPrice.toLocaleString()}
                    </span>
                  </div>

                  {bundle.discountPrice && (
                    <div className="space-y-2">
                      <Badge className="bg-red-100 text-red-700 border-0 text-lg px-4 py-2">
                        Save ₹{(bundle.originalPrice - bundle.discountPrice).toLocaleString()}
                      </Badge>
                      <p className="text-sm text-gray-600">
                        Individual price: ₹{totalOriginalPrice.toLocaleString()} • 
                        Bundle savings: ₹{totalSavings.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <Package className="h-5 w-5 text-emerald-600 mr-2" />
                    <span className="font-semibold text-gray-800">
                      {bundle.products.length} Premium Designs Included
                    </span>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => setShowPurchaseModal(true)}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Purchase Bundle
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              What's Included in This Bundle
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {bundle.products.map((product, index) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="relative h-48 bg-gray-100">
                      <Image
                        src={product.displayImage}
                        alt={product.title}
                        fill
                        className="object-contain p-4"
                      />
                      <Badge className="absolute top-2 left-2 bg-emerald-500 text-white">
                        #{index + 1}
                      </Badge>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-2">{product.title}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {product.discountPrice && (
                            <span className="text-lg font-bold text-emerald-600">
                              ₹{product.discountPrice}
                            </span>
                          )}
                          <span
                            className={`${
                              product.discountPrice
                                ? "line-through text-gray-400 text-sm"
                                : "text-lg font-bold"
                            }`}
                          >
                            ₹{product.originalPrice}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Individual
                        </Badge>
                      </div>
                    <Button asChild>
                      <Link href={`/products/${product.id}`}>
                      Check Item
                      </Link>
                    </Button>
                    </div>
                      
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <BundlePurchaseModal
        bundle={bundle}
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
      />
      
    </div>
  );
}