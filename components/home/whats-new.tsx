import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, TrendingUp } from "lucide-react";
import Link from "next/link";
import connectDB from '@/lib/mongodb';
import { Product } from '@/lib/models';
import { getNewProducts } from "@/lib/actions";

interface ProductType {
  id: string;
  title: string;
  displayImage: string;
  originalPrice: number;
  discountPrice?: number;
  createdAt: string;
}



export async function WhatsNew() {
  const products = await getNewProducts();

  if (products.length === 0) return null;

  return (
    <section className="py-16 bg-gradient-to-br from-pink-50 to-indigo-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-flex items-center px-4 py-2 bg-pink-200 text-pink-800 rounded-full text-sm font-medium mb-4">
            <TrendingUp className="w-4 h-4 mr-2" />
            Fresh Releases
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-indigo-900">
            What's New
          </h2>
          <p className="text-indigo-700/80 text-lg max-w-2xl mx-auto">
            Stay ahead with our latest design innovations and trending templates.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {products.map((product) => (
            <div key={product.id}>
              <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-indigo-100 bg-white/50 backdrop-blur-sm h-full flex flex-col">
                <CardContent className="p-0 flex flex-col h-full">
                  <div className="relative h-64 bg-gradient-to-br from-indigo-50 to-pink-50 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <Image
                        src={product.displayImage || "/placeholder.svg"}
                        alt={product.title}
                        width={400}
                        height={300}
                        className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <Badge className="absolute top-4 left-4 bg-pink-500 text-white border-0 shadow-sm">
                      <Clock className="h-3 w-3 mr-1" />
                      New
                    </Badge>

                    {product.discountPrice && (
                      <Badge className="absolute top-4 right-4 bg-indigo-500 text-white border-0 shadow-sm">
                        {Math.round(
                          ((product.originalPrice - product.discountPrice) /
                            product.originalPrice) *
                            100
                        )}
                        % OFF
                      </Badge>
                    )}
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="font-bold text-lg mb-4 text-indigo-900 group-hover:text-pink-600 transition-colors">
                      {product.title}
                    </h3>

                    <div className="mt-auto">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          {product.discountPrice ? (
                            <>
                              <span className="text-xl font-bold text-pink-600">
                                ₹{product.discountPrice.toLocaleString()}
                              </span>
                              <span className="line-through text-gray-400 text-sm">
                                ₹{product.originalPrice.toLocaleString()}
                              </span>
                            </>
                          ) : (
                            <span className="text-xl font-bold text-indigo-900">
                              ₹{product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <Button
                        asChild
                        className="w-full bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white rounded-lg font-medium py-5 transition-all duration-300 hover:shadow-md"
                      >
                        <Link href={`/products/${product.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="bg-white/80 backdrop-blur-sm border-indigo-200 hover:bg-white px-8 py-5 rounded-xl font-medium text-indigo-700 shadow-sm hover:shadow-md transition-all duration-300 hover:border-indigo-300"
          >
            <Link href="/products?filter=new">Explore All New Designs</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}