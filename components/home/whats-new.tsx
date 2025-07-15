'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  displayImage: string;
  originalPrice: number;
  discountPrice?: number;
  createdAt: string;
}

export function WhatsNew() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchNewProducts();
  }, []);

  const fetchNewProducts = async () => {
    try {
      const response = await fetch('/api/products?new=true&limit=3');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching new products:', error);
    }
  };

  if (products.length === 0) return null;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What's New</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Check out our latest designs and creative solutions.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="relative h-48 bg-gray-100">
                  <Image
                    src={product.displayImage}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                  <Badge className="absolute top-2 left-2 bg-green-500">
                    <Clock className="h-3 w-3 mr-1" />
                    New
                  </Badge>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2">{product.title}</h3>
                  <div className="flex items-center space-x-2">
                    {product.discountPrice && (
                      <span className="text-lg font-bold text-primary">
                        ₹{product.discountPrice}
                      </span>
                    )}
                    <span className={`${product.discountPrice ? 'line-through text-gray-500' : 'text-lg font-bold'}`}>
                      ₹{product.originalPrice}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}