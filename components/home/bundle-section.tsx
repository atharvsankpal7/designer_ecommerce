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
        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl">
            {bundles.map((bundle, index) => (
              <div key={bundle.id} className="w-64">
                <Card className="group h-full overflow-hidden border border-orange-100 bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-xl transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-2">
                  <CardContent className="p-0 h-full flex flex-col">
                    {/* Image Container */}
                    <div className="relative h-48 bg-gradient-to-br from-orange-50 to-amber-50 overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center p-4">
                        <Image
                          src={bundle.displayImage || "/placeholder.svg"}
                          alt={bundle.name}
                          width={320}
                          height={320}
                          className="object-contain w-full h-full group-hover:scale-110 transition-transform duration-500"
                          priority={index < 2}
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex-1 flex flex-col space-y-3">
                      {/* Badges moved to card body */}
                      <div className="flex gap-2 flex-shrink-0">
                        <Badge className="bg-orange-500 text-white border-0 shadow-sm text-xs px-2 py-1">
                          <Package className="h-3 w-3 mr-1" />
                          Collection
                        </Badge>

                        {bundle.discountPrice && (
                          <Badge className="bg-gradient-to-r from-rose-500 to-orange-500 text-white border-0 shadow-sm text-xs px-2 py-1">
                            Save ₹{(bundle.originalPrice - bundle.discountPrice).toLocaleString()}
                          </Badge>
                        )}
                      </div>

                      <h3 className="font-semibold text-base leading-tight text-gray-900 group-hover:text-orange-600 transition-colors min-h-[2.5rem]">
                        {bundle.name}
                      </h3>

                      <p className="text-sm text-gray-600 line-clamp-2 flex-shrink-0">
                        {bundle.description}
                      </p>

                      <div className="flex-1 flex flex-col justify-end space-y-3">
                        {/* Price Section */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-baseline space-x-2">
                            {bundle.discountPrice ? (
                              <>
                                <span className="text-lg font-bold text-orange-600">
                                  ₹{bundle.discountPrice.toLocaleString()}
                                </span>
                                <span className="line-through text-gray-400 text-sm">
                                  ₹{bundle.originalPrice.toLocaleString()}
                                </span>
                              </>
                            ) : (
                              <span className="text-lg font-bold text-gray-900">
                                ₹{bundle.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>

                          <Badge variant="outline" className="border-orange-200 text-xs">
                            {bundle.products.length} designs
                          </Badge>
                        </div>

                        {/* Action Button */}
                        <Button
                          asChild
                          className="w-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white rounded-lg font-medium transition-all duration-300 hover:shadow-md transform hover:scale-[1.02]"
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