'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BundlePurchaseModal } from '@/components/bundles/bundle-purchase-modal';
import { Package, Gift, Star } from 'lucide-react';
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
    displayImage: string;
  }[];
}

export default function Bundles() {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  useEffect(() => {
    fetchBundles();
  }, []);

  const fetchBundles = async () => {
    try {
      const response = await fetch('/api/bundles?isActive=true');
      const data = await response.json();
      setBundles(data);
    } catch (error) {
      console.error('Error fetching bundles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = (bundle: Bundle) => {
    setSelectedBundle(bundle);
    setShowPurchaseModal(true);
  };
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <section className="py-16 bg-gradient-to-br from-emerald-50 to-teal-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full mb-6">
                <Gift className="w-5 h-5 text-emerald-600 mr-2" />
                <span className="text-emerald-800 font-semibold">Premium Bundle Collections</span>
              </div>
              <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-emerald-600 bg-clip-text text-transparent">
                Design Bundle Collections
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Discover our curated bundles featuring multiple premium designs at incredible value. 
                Perfect for businesses, events, and creative projects.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, index) => (
                  <Card key={index} className="overflow-hidden animate-pulse">
                    <CardContent className="p-0">
                      <div className="h-64 bg-gray-200"></div>
                      <div className="p-6 space-y-4">
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded"></div>
                          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          <div className="flex gap-1">
                            <div className="h-6 bg-gray-200 rounded w-16"></div>
                            <div className="h-6 bg-gray-200 rounded w-20"></div>
                            <div className="h-6 bg-gray-200 rounded w-12"></div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-12 bg-gray-200 rounded-xl"></div>
                          <div className="h-12 bg-gray-200 rounded-xl"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {bundles.map((bundle) => (
                    <Card key={bundle.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white shadow-md hover:scale-105">
                      <CardContent className="p-0">
                        <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                          <Image
                            src={bundle.displayImage || "/placeholder.svg"}
                            alt={bundle.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                          <Badge className="absolute top-4 left-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 shadow-lg">
                            <Package className="h-3 w-3 mr-1" />
                            Bundle
                          </Badge>

                          {bundle.discountPrice && (
                            <Badge className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-lg">
                              {Math.round(((bundle.originalPrice - bundle.discountPrice) / bundle.originalPrice) * 100)}% OFF
                            </Badge>
                          )}

                          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                            <span className="text-xs font-medium text-gray-700">
                              {bundle.products.length} designs included
                            </span>
                          </div>
                        </div>

                        <div className="p-6">
                          <h3 className="font-bold text-xl mb-3 line-clamp-2 text-gray-900 group-hover:text-emerald-600 transition-colors">
                            {bundle.name}
                          </h3>

                          <p className="text-gray-600 mb-4 line-clamp-3">
                            {bundle.description}
                          </p>

                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-2">
                              {bundle.discountPrice && (
                                <span className="text-2xl font-bold text-emerald-600">
                                  ₹{bundle.discountPrice.toLocaleString()}
                                </span>
                              )}
                              <span
                                className={`${
                                  bundle.discountPrice
                                    ? "line-through text-gray-400 text-lg"
                                    : "text-2xl font-bold text-gray-900"
                                }`}
                              >
                                ₹{bundle.originalPrice.toLocaleString()}
                              </span>
                            </div>

                            {bundle.discountPrice && (
                              <Badge
                                variant="secondary"
                                className="bg-emerald-100 text-emerald-700 border-0 font-semibold"
                              >
                                Save ₹{(bundle.originalPrice - bundle.discountPrice).toLocaleString()}
                              </Badge>
                            )}
                          </div>

                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Included designs:</p>
                            <div className="flex flex-wrap gap-1">
                              {bundle.products.slice(0, 3).map((product, index) => (
                                <span key={product.id} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                  {product.title.length > 20 ? `${product.title.substring(0, 20)}...` : product.title}
                                </span>
                              ))}
                              {bundle.products.length > 3 && (
                                <span className="text-xs bg-emerald-100 text-emerald-600 px-2 py-1 rounded font-medium">
                                  +{bundle.products.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>

                          <Button
                            asChild
                            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-semibold py-3 text-base transition-all duration-300 hover:shadow-lg mb-2"
                          >
                            <Link href={`/bundles/${bundle.id}`}>
                              View Bundle Details
                            </Link>
                          </Button>
                          
                          <Button
                            onClick={() => handlePurchase(bundle)}
                            variant="outline"
                            className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50 rounded-xl font-semibold py-3 text-base transition-all duration-300"
                          >
                            Purchase Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {bundles.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No bundles available</h3>
                    <p className="text-gray-500">Check back soon for exciting bundle collections!</p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      
      <BundlePurchaseModal
        bundle={selectedBundle}
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
      />
      
      <Footer />
    </div>
  );
}