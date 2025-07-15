"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, TrendingUp, Zap } from "lucide-react";
import { motion } from "framer-motion";
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
    <section className="py-20 bg-gradient-to-br from-slate-50 to-gray-100 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full text-sm font-semibold mb-4">
            <TrendingUp className="w-4 h-4 mr-2" />
            Fresh Releases
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            What's New
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Stay ahead with our latest design innovations and trending
            templates.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 bg-white/90 backdrop-blur-sm hover:scale-105">
                <CardContent className="p-0">
                  <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    <Image
                      src={product.displayImage || "/placeholder.svg"}
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <Badge className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg">
                      <Clock className="h-3 w-3 mr-1" />
                      New
                    </Badge>

                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <Zap className="h-4 w-4 text-yellow-500" />
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-4 line-clamp-2 text-gray-900 group-hover:text-purple-600 transition-colors">
                      {product.title}
                    </h3>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        {product.discountPrice && (
                          <span className="text-xl font-bold text-purple-600">
                            ₹{product.discountPrice.toLocaleString()}
                          </span>
                        )}
                        <span
                          className={`${
                            product.discountPrice
                              ? "line-through text-gray-400 text-sm"
                              : "text-xl font-bold text-gray-900"
                          }`}
                        >
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                      </div>

                      {product.discountPrice && (
                        <Badge
                          variant="secondary"
                          className="bg-red-100 text-red-700 border-0"
                        >
                          Save ₹
                          {(
                            product.originalPrice - product.discountPrice
                          ).toLocaleString()}
                        </Badge>
                      )}
                    </div>

                    <Button
                      asChild
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold py-6 transition-all duration-300 hover:shadow-lg"
                    >
                      <Link href={`/products/${product.id}`}>View Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Button
            asChild
            variant="outline"
            size="lg"
            className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white px-8 py-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Link href="/products?filter=new">Explore All New Designs</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
