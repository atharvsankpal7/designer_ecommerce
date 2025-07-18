"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, TrendingUp, Zap } from "lucide-react";
import Link from "next/link";

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
      const response = await fetch("/api/products?new=true&limit=3");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching new products:", error);
      // Mock data for demo
      setProducts([
        {
          id: "7",
          title: "Modern Instagram Story Templates",
          displayImage: "/placeholder.svg?height=300&width=400",
          originalPrice: 1999,
          discountPrice: 1299,
          createdAt: new Date().toISOString(),
        },
        {
          id: "8",
          title: "Corporate Presentation Bundle",
          displayImage: "/placeholder.svg?height=300&width=400",
          originalPrice: 3499,
          discountPrice: 2499,
          createdAt: new Date().toISOString(),
        },
        {
          id: "9",
          title: "Festival Greeting Cards",
          displayImage: "/placeholder.svg?height=300&width=400",
          originalPrice: 1499,
          discountPrice: 999,
          createdAt: new Date().toISOString(),
        },
      ]);
    }
  };

  if (products.length === 0) return null;

  return (
    <section className="py-20 bg-black relative overflow-hidden border-t border-red-900">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-full text-sm font-bold mb-4 tracking-wider">
            <TrendingUp className="w-4 h-4 mr-2" />
            FRESH RELEASES
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-white">
            <span className="text-red-500">NEW</span> ARRIVALS
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Level up your designs with our latest drops. Pure digital firepower.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {products.map((product) => (
            <div key={product.id}>
              <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-800 bg-gray-900 hover:bg-gray-800 hover:border-red-500">
                <CardContent className="p-0">
                  <div className="relative h-64 bg-gray-800 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Image
                        src={product.displayImage || "/placeholder.svg"}
                        alt={product.title}
                        width={400}
                        height={300}
                        className="object-contain max-h-full max-w-full group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <Badge className="absolute top-4 left-4 bg-red-600 text-white border-0 shadow-lg font-bold">
                      <Clock className="h-3 w-3 mr-1" />
                      NEW
                    </Badge>

                    <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 border border-red-500/50">
                      <Zap className="h-4 w-4 text-red-500" />
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-4 line-clamp-2 text-white group-hover:text-red-400 transition-colors">
                      {product.title}
                    </h3>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        {product.discountPrice && (
                          <span className="text-xl font-bold text-red-500">
                            ₹{product.discountPrice.toLocaleString()}
                          </span>
                        )}
                        <span
                          className={`${
                            product.discountPrice
                              ? "line-through text-gray-500 text-sm"
                              : "text-xl font-bold text-white"
                          }`}
                        >
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                      </div>

                      {product.discountPrice && (
                        <Badge className="bg-black text-red-400 border border-red-900 font-bold">
                          SAVE ₹
                          {(
                            product.originalPrice - product.discountPrice
                          ).toLocaleString()}
                        </Badge>
                      )}
                    </div>

                    <Button
                      asChild
                      className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white rounded-md font-bold py-6 transition-all duration-300 hover:shadow-red-500/20 hover:shadow-lg"
                    >
                      <Link href={`/products/${product.id}`}>VIEW DETAILS</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="bg-transparent border-red-600 hover:bg-red-600/10 text-red-400 hover:text-white px-8 py-6 rounded-md font-bold text-lg hover:border-red-500 hover:shadow-red-500/10 hover:shadow-lg transition-all duration-300"
          >
            <Link href="/products?filter=new">EXPLORE ALL NEW DESIGNS</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}