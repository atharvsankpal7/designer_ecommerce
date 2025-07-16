'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Star, Crown, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Product {
  id: string;
  title: string;
  displayImage: string;
  originalPrice: number;
  discountPrice?: number;
}

export function ProductSlider() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);

  useEffect(() => {
    fetchFeaturedProducts();
   
  }, []);


  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch('/api/products?featured=true&limit=6');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      (prev + 1) % Math.max(1, products.length - visibleCards + 1)
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      (prev - 1 + Math.max(1, products.length - visibleCards + 1)) %
      Math.max(1, products.length - visibleCards + 1)
    );
  };

  if (products.length === 0) return null;

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-purple-50 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-16 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-6">
            <Crown className="w-5 h-5 text-purple-600 mr-2" />
            <span className="text-purple-800 font-semibold">Featured Collection</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 bg-clip-text text-transparent">
            Premium Designs
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Handpicked masterpieces that define excellence. Each design tells a story,
            crafted with precision and passion for the discerning creator.
          </p>
        </div>

        <div className="relative">
          <div className="flex items-center justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl mx-auto">
              {products.slice(currentIndex, currentIndex + visibleCards).map((product) => (
                <div key={product.id}>
                  <Card className="overflow-hidden border-0 bg-white/80 backdrop-blur-sm relative shadow-md">
                    <CardContent className="p-0">
                      <div className="relative w-full h-64 bg-white flex items-center justify-center">
                        <Image
                          src={product.displayImage || "/placeholder.svg"}
                          alt={product.title}
                          width={300}
                          height={300}
                          className="object-contain max-h-full max-w-full"
                        />
                        <Badge className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-black border-0 shadow-lg font-bold">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          Featured
                        </Badge>
                      </div>

                      <div className="p-6">
                        <h3 className="font-bold text-xl mb-4 line-clamp-2 text-gray-900 leading-tight">
                          {product.title}
                        </h3>

                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center space-x-3">
                            {product.discountPrice && (
                              <span className="text-2xl font-black text-purple-600">
                                ₹{product.discountPrice.toLocaleString()}
                              </span>
                            )}
                            <span
                              className={cn(
                                product.discountPrice
                                  ? "line-through text-gray-400 text-lg"
                                  : "text-2xl font-black text-gray-900"
                              )}
                            >
                              ₹{product.originalPrice.toLocaleString()}
                            </span>
                          </div>

                          {product.discountPrice && (
                            <Badge variant="secondary" className="bg-red-100 text-red-700 border-0 font-semibold">
                              Save ₹{(product.originalPrice - product.discountPrice).toLocaleString()}
                            </Badge>
                          )}
                        </div>

                        <Button
                          asChild
                          className={cn(
                            "w-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-600 text-white rounded-xl font-bold py-6 text-lg",
                            "shadow-lg hover:shadow-purple-300/30 dark:hover:shadow-purple-900/30",
                            "transform hover:scale-105 transition-all duration-300 ease-out",
                            "border border-purple-400/20 backdrop-blur-sm",
                            "relative overflow-hidden group",
                            "before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/10 before:via-transparent before:to-transparent before:opacity-0 before:hover:opacity-100 before:transition-opacity before:duration-500"
                          )}
                        >
                          <Link href={`/products/${product.id}`}>
                            View Premium Design
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Optional slider arrows (enable if needed) */}
          {/* 
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20">
            <button onClick={prevSlide}>
              <ChevronLeft className="h-8 w-8 text-purple-600 hover:text-purple-800" />
            </button>
          </div>
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20">
            <button onClick={nextSlide}>
              <ChevronRight className="h-8 w-8 text-purple-600 hover:text-purple-800" />
            </button>
          </div>
          */}

          <div className="flex justify-center mt-16">
            <Button
              asChild
              size="lg"
              className={cn(
                "group relative inline-flex h-11 animate-rainbow cursor-pointer items-center justify-center rounded-xl border-0 bg-[length:200%] px-8 py-2 font-medium text-primary-foreground transition-colors [background-clip:padding-box,border-box,border-box] [background-origin:border-box] [border:calc(0.08*1rem)_solid_transparent] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                "before:absolute before:bottom-[-20%] before:left-1/2 before:z-0 before:h-1/5 before:w-3/5 before:-translate-x-1/2 before:animate-rainbow before:bg-[linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))] before:bg-[length:200%] before:[filter:blur(calc(0.8*1rem))]",
                "bg-[linear-gradient(#121213,#121213),linear-gradient(#121213_50%,rgba(18,18,19,0.6)_80%,rgba(18,18,19,0)),linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))]",
                "dark:bg-[linear-gradient(#fff,#fff),linear-gradient(#fff_50%,rgba(255,255,255,0.6)_80%,rgba(0,0,0,0)),linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))]"
              )}
            >
              <Link href="/products">
                Explore All Premium Designs
                <Sparkles className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
