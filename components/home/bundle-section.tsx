import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Gift, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getFeaturedBundles } from "@/lib/actions";

export async function BundleSection() {
  const bundles = await getFeaturedBundles();
  if (bundles.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 lg:py-24 relative overflow-hidden">
      {/* Background with warm orange tones - lighter version */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-100/40 via-amber-100/30 to-rose-100/20 z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-200/15 via-transparent to-transparent mix-blend-overlay z-0" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-14 sm:mb-16 lg:mb-20 max-w-4xl mx-auto">
          <Badge 
            variant="outline" 
            className="mb-4 bg-white/80 backdrop-blur-sm border-orange-200 text-orange-600 hover:bg-white/90 px-4 py-1.5 text-sm font-medium shadow-sm hover:shadow-md transition-all"
          >
            <Gift className="w-4 h-4 mr-2" />
            Premium Collections
          </Badge>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 sm:mb-6">
            <span className="bg-gradient-to-r from-orange-600 to-rose-500 bg-clip-text text-transparent">
              Curated Design Bundles
            </span>
          </h2>
          
          <p className="text-lg text-gray-700 leading-relaxed mx-auto max-w-2xl">
            Handpicked collections of our best designs, offering exceptional value and creative possibilities.
          </p>
        </div>

        {/* Bundle Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {bundles.map((bundle, index) => (
            <div
              key={bundle.id}
              className="group relative hover:-translate-y-1 transition-transform duration-300"
            >
              <Card className="h-full overflow-hidden border border-orange-100 bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-lg transition-all duration-300">
                <CardContent className="p-0 h-full flex flex-col">
                  {/* Image Container */}
                  <div className="relative aspect-square bg-gradient-to-br from-orange-50 to-amber-50 overflow-hidden">
                    <Image
                      src={bundle.displayImage || "/placeholder.svg"}
                      alt={bundle.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      priority={index < 2}
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent" />

                    {/* Bundle Badge */}
                    <Badge className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-orange-600 border-0 shadow-sm text-xs font-medium">
                      <Package className="h-3 w-3 mr-1" />
                      Collection
                    </Badge>

                    {/* Discount Badge */}
                    {bundle.discountPrice && (
                      <Badge className="absolute top-3 right-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white border-0 shadow-sm text-xs font-medium">
                        Save ₹{(bundle.originalPrice - bundle.discountPrice).toLocaleString()}
                      </Badge>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-orange-600 transition-colors">
                        {bundle.name}
                      </h3>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {bundle.description}
                      </p>
                    </div>

                    {/* Price Section */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-baseline space-x-2">
                        {bundle.discountPrice ? (
                          <>
                            <span className="text-xl font-bold text-orange-600">
                              ₹{bundle.discountPrice.toLocaleString()}
                            </span>
                            <span className="line-through text-gray-400 text-sm">
                              ₹{bundle.originalPrice.toLocaleString()}
                            </span>
                          </>
                        ) : (
                          <span className="text-xl font-bold text-gray-900">
                            ₹{bundle.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <Badge variant="outline" className="border-orange-200 text-xs">
                        {bundle.products.length} designs
                      </Badge>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <Button
                        asChild
                        size="sm"
                        className="w-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white rounded-lg font-medium transition-all duration-300"
                      >
                        <Link href={`/bundles/${bundle.id}`}>
                          View Collection
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-14 sm:mt-16">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="bg-white/90 backdrop-blur-sm border-orange-200 hover:bg-white hover:border-orange-300 px-8 py-5 rounded-xl font-medium text-base shadow-sm hover:shadow-md transition-all duration-300"
          >
            <Link href="/bundles" className="flex items-center">
              Explore All Collections
              <Sparkles className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}