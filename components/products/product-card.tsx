'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, MessageCircle } from 'lucide-react';

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    description: string;
    displayImage: string;
    originalPrice: number;
    discountPrice?: number;
    section: {
      name: string;
    };
  };
  onPurchase: (productId: string) => void;
}

export function ProductCard({ product, onPurchase }: ProductCardProps) {
  const handleWhatsApp = () => {
    const message = `Hi, I'm interested in the product: ${product.title}`;
    const phoneNumber = '919876543210'; // Replace with actual WhatsApp number
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <CardContent className="p-0">
        <div className="relative h-48 bg-gray-100 overflow-hidden">
          <Image
            src={product.displayImage}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Badge className="absolute top-2 left-2 bg-primary">
            {product?.section?.name}
          </Badge>
          {product.discountPrice && (
            <Badge className="absolute top-2 right-2 bg-red-500">
              {Math.round(((product.originalPrice - product.discountPrice) / product.originalPrice) * 100)}% OFF
            </Badge>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold mb-2 line-clamp-2">{product.title}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              {product.discountPrice && (
                <span className="text-lg font-bold text-primary">
                  ₹{product.discountPrice}
                </span>
              )}
              <span className={`${product.discountPrice ? 'line-through text-gray-500 text-sm' : 'text-lg font-bold'}`}>
                ₹{product.originalPrice}
              </span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={() => onPurchase(product.id)}
              className="flex-1"
              size="sm"
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Buy Now
            </Button>
            <Button 
              onClick={handleWhatsApp}
              variant="outline"
              size="sm"
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}