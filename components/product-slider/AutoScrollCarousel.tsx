"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import useEmblaCarousel from "embla-carousel-react"
import AutoPlay from "embla-carousel-autoplay"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ChevronRight, ChevronLeft, Sparkles, Heart, ShoppingCart } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProductType {
  id: string
  title: string
  displayImage: string
  originalPrice: number
  discountPrice?: number
}

export function ModernAutoScrollCarousel({ products }: { products: ProductType[] }) {
  // Create circular list by duplicating products multiple times for seamless infinite scroll
  const createCircularList = (items: ProductType[], multiplier: number = 3) => {
    const circularList = []
    for (let i = 0; i < multiplier; i++) {
      circularList.push(...items.map((item, index) => ({
        ...item,
        id: `${item.id}-${i}-${index}`, // Unique ID for each duplicate
        originalId: item.id // Keep reference to original ID
      })))
    }
    return circularList
  }

  const circularProducts = createCircularList(products)

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      align: "start",
      skipSnaps: false,
      dragFree: true,
      containScroll: false,
      slidesToScroll: 1,
    },
    [AutoPlay({ 
      delay: 2000, 
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      playOnInit: true
    })]
  )

  const [isHovered, setIsHovered] = useState(false)

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    
    // Start autoplay immediately
    const autoplay = emblaApi.plugins().autoPlay as any
    if (autoplay && typeof autoplay.play === 'function') {
      autoplay.play()
    }

    // Handle infinite scroll reset
    const onSelect = () => {
      const slideCount = emblaApi.slideNodes().length
      const selectedIndex = emblaApi.selectedScrollSnap()
      
      // Reset position when reaching the end of first set
      if (selectedIndex >= products.length * 2) {
        emblaApi.scrollTo(products.length, false)
      } else if (selectedIndex < products.length) {
        emblaApi.scrollTo(selectedIndex + products.length, false)
      }
    }
    emblaApi.on("select", onSelect)
    
    // Start from middle section for seamless infinite effect
    emblaApi.scrollTo(products.length, false)

    return () => {
      emblaApi.off("select", onSelect)
    }
  }, [emblaApi, products.length])

  return (
    <div className="relative group">
      {/* Navigation buttons */}
      <button
        onClick={scrollPrev}
        className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2 z-20",
          "w-14 h-14 rounded-full shadow-xl border border-white/30",
          "flex items-center justify-center text-slate-600 hover:text-white",
          "transform hover:scale-110 transition-all duration-300 ease-out",
          "opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0",
          "hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600",
          "hover:shadow-2xl ring-1 ring-slate-200/50 hover:ring-white/50",
        )}
        aria-label="Previous products"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={scrollNext}
        className={cn(
          "absolute right-4 top-1/2 -translate-y-1/2 z-20",
          "w-14 h-14 rounded-full bg-white/95 backdrop-blur-md shadow-xl border border-white/30",
          "flex items-center justify-center text-slate-600 hover:text-white",
          "transform hover:scale-110 transition-all duration-300 ease-out",
          "opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0",
          "hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600",
          "hover:shadow-2xl ring-1 ring-slate-200/50 hover:ring-white/50",
        )}
        aria-label="Next products"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Embla Carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div 
          className="flex gap-6 py-8 px-4"
          style={{ 
            transform: 'translate3d(0, 0, 0)', // Force hardware acceleration
            willChange: 'transform' // Optimize for animations
          }}
        >
          {circularProducts.map((product, index) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              originalId={product.originalId}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
function ProductCard({ product, originalId }: { product: ProductType & { originalId?: string }; originalId?: string }) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isCardHovered, setIsCardHovered] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const discountPercentage = product.discountPrice
    ? Math.round(((product.originalPrice - product.discountPrice) / product.originalPrice) * 100)
    : 0

  return (
    <div 
      className="flex-shrink-0 w-80 group/card"
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
    >
      <Card
        className={cn(
          "overflow-hidden border-0 bg-white/80 backdrop-blur-lg relative",
          "shadow-lg hover:shadow-2xl transition-all duration-500 ease-out",
          "transform hover:scale-[1.03] hover:-translate-y-3",
          "ring-1 ring-slate-200/60 hover:ring-indigo-300/60",
          "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent before:pointer-events-none",
          "hover:before:from-indigo-50/30 hover:before:to-purple-50/20",
        )}
      >
        <CardContent className="p-0 relative">
          

          {/* Image container */}
          <div className="relative w-full h-80 bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
            {/* Loading shimmer */}
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 transition-opacity duration-700",
                imageLoaded ? "opacity-0" : "opacity-100",
              )}
            />

            <Image
              src={product.displayImage || "/placeholder.svg?height=320&width=320&query=premium design"}
              alt={product.title}
              width={320}
              height={320}
              className={cn(
                "object-contain w-full h-full transition-all duration-700 ease-out p-6",
                "group-hover/card:scale-110 group-hover/card:rotate-1",
                imageLoaded ? "opacity-100" : "opacity-0",
              )}
              onLoad={() => setImageLoaded(true)}
            />

            {/* Dynamic hover overlay */}
            <div
              className={cn(
                "absolute inset-0 transition-all duration-500",
                isCardHovered 
                  ? "bg-gradient-to-t from-black/30 via-black/5 to-transparent opacity-100" 
                  : "opacity-0",
              )}
            />
          </div>
          {/* Enhanced content */}
          <div className="p-6 space-y-4 bg-gradient-to-b from-white/90 to-white/70 backdrop-blur-sm">
            {/* Badges moved to card body */}
            <div className="flex gap-2 mb-3">
              <Badge
                className={cn(
                  "bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 text-amber-900 border-0",
                  "shadow-lg font-bold text-xs px-3 py-1.5 rounded-full",
                  "transform group-hover/card:scale-110 transition-all duration-300",
                  "ring-2 ring-white/50 backdrop-blur-sm",
                )}
              >
                <Star className="h-3 w-3 mr-1 fill-current" />
                FEATURED
              </Badge>

              {product.discountPrice && (
                <Badge
                  className={cn(
                    "bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 text-white border-0",
                    "shadow-lg font-bold text-xs px-3 py-1.5 rounded-full",
                    "transform group-hover/card:scale-110 transition-all duration-300",
                    "ring-2 ring-white/50 backdrop-blur-sm",
                  )}
                >
                  -{discountPercentage}% OFF
                </Badge>
              )}
    </div>

            <h3 className="font-bold text-xl leading-tight text-slate-900 line-clamp-2 group-hover/card:text-indigo-900 transition-colors duration-300">
              {product.title}
            </h3>

            {/* Enhanced pricing section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-3">
                  {product.discountPrice ? (
                    <>
                      <span className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        ₹{product.discountPrice.toLocaleString()}
                      </span>
                      <span className="text-lg text-slate-400 line-through font-medium">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    </>
                  ) : (
                    <span className="text-3xl font-black text-slate-900">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {product.discountPrice && (
                  <div className="text-right bg-green-50 px-3 py-1 rounded-full border border-green-200">
                    <div className="text-xs text-green-600 font-medium">You save</div>
                    <div className="text-sm font-bold text-green-700">
                      ₹{(product.originalPrice - product.discountPrice).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced CTA Button */}
              <Button
                asChild
                className={cn(
                  "w-full h-12 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600",
                  "hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700",
                  "text-white font-semibold rounded-xl shadow-lg hover:shadow-xl",
                  "transform hover:scale-[1.02] transition-all duration-300 ease-out",
                  "border border-white/20 backdrop-blur-sm group/button relative overflow-hidden",
                  "before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent",
                  "before:transform before:-skew-x-12 before:-translate-x-full hover:before:translate-x-full",
                  "before:transition-transform before:duration-700 before:ease-out",
                )}
              >
                <Link href={`/products/${originalId || product.id}`} className="flex items-center justify-center gap-2 relative z-10">
                  <span>View Design</span>
                  <Sparkles className="w-4 h-4 group-hover/button:rotate-12 transition-transform duration-300" />
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
