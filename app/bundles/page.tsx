"use client"

import { useState, useEffect } from "react"
import { Metadata } from 'next'
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BundlePurchaseModal } from "@/components/bundles/bundle-purchase-modal"
import { Package, Gift, Sparkles, Zap, ArrowRight, RefreshCw, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import { SSRHeader } from "@/components/layout/ssr-header"

interface Bundle {
  id: string
  name: string
  description: string
  displayImage: string
  originalPrice: number
  discountPrice?: number
  products: {
    id: string
    title: string
    displayImage: string
  }[]
}

export default function Bundles() {
  const [bundles, setBundles] = useState<Bundle[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null)
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [hoveredBundle, setHoveredBundle] = useState<string | null>(null)

  useEffect(() => {
    fetchBundles()
  }, [])

  const fetchBundles = async () => {
    try {
      // Simulate network delay for demo purposes
      await new Promise(resolve => setTimeout(resolve, 800))
      const response = await fetch("/api/bundles?isActive=true")
      const data = await response.json()
      setBundles(data)
    } catch (error : any) {
      console.error("Error fetching bundles:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = (bundle: Bundle) => {
    setSelectedBundle(bundle)
    setShowPurchaseModal(true)
  }

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  const hoverEffect = {
    scale: 1.03,
    y: -5,
    transition: { duration: 0.3, ease: "easeOut" }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/20 via-white to-purple-50/20">
      {/* <SSRHeader /> */}

      <main className="overflow-hidden">
        {/* Hero Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-100/20 via-purple-50/10 to-blue-50/20"></div>
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-pink-200/20"
                style={{
                  width: Math.random() * 300 + 100,
                  height: Math.random() * 300 + 100,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  x: [0, (Math.random() - 0.5) * 100],
                  y: [0, (Math.random() - 0.5) * 100],
                  transition: {
                    duration: Math.random() * 20 + 10,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }
                }}
              />
            ))}
          </div>
          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center px-6 py-2 bg-white/60 backdrop-blur-md rounded-full mb-8 border border-white/20 shadow-lg"
              >
                <Gift className="w-5 h-5 text-pink-500 mr-2" />
                <Sparkles className="w-4 h-4 text-yellow-500 mr-2" />
                <span className="text-gray-700 font-semibold">Premium Bundle Collections</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent py-3"
              >
                Exclusive Design Bundles
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto"
              >
                Discover our curated bundles featuring multiple premium designs at incredible value. Perfect for
                businesses, events, and creative projects.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex justify-center gap-4"
              >
                <Button
                  asChild
                  className="rounded-full px-6 py-3 font-semibold shadow-lg bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                >
                  <Link href="#bundles">
                    <Zap className="w-8 h-6 mr-2" />
                    Explore Bundles
                  </Link>
                </Button>
                
              </motion.div>
            </div>
          </div>
        </section>

        {/* Bundles Grid */}
        <section id="bundles" className="py-16 relative">
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-pink-50/50 to-transparent -z-10"></div>
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
                Curated <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">Design Collections</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Handpicked bundles to give you everything you need for your next project
              </p>
            </motion.div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(3)].map((_, index) => (
                  <Card key={index} className="overflow-hidden bg-white/60 backdrop-blur-sm border border-white/30">
                    <CardContent className="p-0">
                      <Skeleton className="h-64 w-full" />
                      <div className="p-6 space-y-4">
                        <Skeleton className="h-6 w-3/4" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-5/6" />
                          <Skeleton className="h-4 w-4/6" />
                        </div>
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-8 w-1/3" />
                          <Skeleton className="h-6 w-1/4 rounded-full" />
                        </div>
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-1/2" />
                          <div className="flex gap-1">
                            <Skeleton className="h-6 w-16 rounded-full" />
                            <Skeleton className="h-6 w-20 rounded-full" />
                            <Skeleton className="h-6 w-12 rounded-full" />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <Skeleton className="h-12 w-full" />
                          <Skeleton className="h-12 w-full" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <>
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  <AnimatePresence>
                    {bundles.map((bundle) => (
                      <motion.div
                        key={bundle.id}
                        variants={item}
                        layout
                        whileHover={hoverEffect}
                        onHoverStart={() => setHoveredBundle(bundle.id)}
                        onHoverEnd={() => setHoveredBundle(null)}
                        className="relative"
                      >
                        <Card className="overflow-hidden bg-white/80 backdrop-blur-md border border-white/30 shadow-xl h-full flex flex-col">
                          <CardContent className="p-0 flex flex-col h-full">
                            <div className="relative h-64 bg-gradient-to-br from-pink-50/50 via-purple-50/30 to-blue-50/50 overflow-hidden">
                              <Image
                                src={bundle.displayImage || "/placeholder.svg"}
                                alt={bundle.name}
                                fill
                                className="object-cover transition-transform duration-500"
                                style={{
                                  transform: hoveredBundle === bundle.id ? "scale(1.05)" : "scale(1)"
                                }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>

                              <Badge className="absolute top-4 left-4 bg-gradient-to-r from-pink-400/90 to-purple-400/90 backdrop-blur-sm text-white border-0 shadow-lg">
                                <Package className="h-3 w-3 mr-1" />
                                Bundle
                              </Badge>

                              {bundle.discountPrice && (
                                <Badge className="absolute top-4 right-4 bg-gradient-to-r from-orange-400/90 to-pink-400/90 backdrop-blur-sm text-white border-0 shadow-lg">
                                  {Math.round(((bundle.originalPrice - bundle.discountPrice) / bundle.originalPrice * 100))}% OFF
                                </Badge>
                              )}

                              <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-md rounded-full px-4 py-2 border border-white/30">
                                <span className="text-xs font-medium text-gray-700">
                                  {bundle.products.length} premium designs
                                </span>
                              </div>
                            </div>

                            <div className="p-6 flex-grow flex flex-col">
                              <div>
                                <h3 className="font-bold text-xl mb-3 line-clamp-2 text-gray-800">{bundle.name}</h3>

                                <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">{bundle.description}</p>

                                <div className="flex items-center justify-between mb-6">
                                  <div className="flex items-center space-x-2">
                                    {bundle.discountPrice && (
                                      <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                                        ₹{bundle.discountPrice.toLocaleString()}
                                      </span>
                                    )}
                                    <span
                                      className={`${
                                        bundle.discountPrice
                                          ? "line-through text-gray-400 text-lg"
                                          : "text-2xl font-bold text-gray-800"
                                      }`}
                                    >
                                      ₹{bundle.originalPrice.toLocaleString()}
                                    </span>
                                  </div>
                                  {bundle.discountPrice && (
                                    <Badge className="bg-gradient-to-r from-green-100/80 to-emerald-100/80 text-green-700 border-0 font-semibold backdrop-blur-sm">
                                      Save ₹{(bundle.originalPrice - bundle.discountPrice).toLocaleString()}
                                    </Badge>
                                  )}
                                </div>

                                <div className="mb-6">
                                  <p className="text-sm font-medium text-gray-700 mb-3">Includes:</p>
                                  <div className="flex flex-wrap gap-2">
                                    {bundle.products.slice(0, 3).map((product) => (
                                      <motion.span
                                        key={product.id}
                                        whileHover={{ scale: 1.05 }}
                                        className="text-xs bg-white/60 backdrop-blur-sm text-gray-600 px-3 py-1.5 rounded-full border border-white/30 shadow-sm"
                                      >
                                        {product.title.length > 20 ? `${product.title.substring(0, 20)}...` : product.title}
                                      </motion.span>
                                    ))}
                                    {bundle.products.length > 3 && (
                                      <span className="text-xs bg-gradient-to-r from-purple-100/80 to-pink-100/80 text-purple-700 px-3 py-1.5 rounded-full font-medium backdrop-blur-sm border border-white/30">
                                        +{bundle.products.length - 3} more
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="mt-auto space-y-3">
                                <Button
                                  asChild
                                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-xl font-semibold py-3 text-base shadow-lg border-0 group"
                                >
                                  <Link href={`/bundles/${bundle.id}`}>
                                    <span className="group-hover:translate-x-1 transition-transform inline-block">
                                      View Details
                                    </span>
                                    <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-all inline-block" />
                                  </Link>
                                </Button>

                                <Button
                                  onClick={() => handlePurchase(bundle)}
                                  className="w-full bg-white/60 backdrop-blur-md text-gray-700 hover:bg-white/80 rounded-xl font-semibold py-3 text-base border border-white/30 shadow-lg hover:shadow-pink-100/40 transition-all"
                                >
                                  Get This Bundle
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {hoveredBundle === bundle.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="absolute -bottom-2 left-0 right-0 h-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-b-full mx-auto w-11/12 blur-md"
                          />
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {bundles.length === 0 && !loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-16"
                  >
                    <div className="bg-white/60 backdrop-blur-md rounded-3xl p-12 border border-white/30 shadow-xl max-w-md mx-auto">
                      <Package className="h-16 w-16 mx-auto text-gray-400 mb-6" />
                      <h3 className="text-xl font-semibold text-gray-600 mb-3">No bundles available</h3>
                      <p className="text-gray-500 mb-4">Check back soon for exciting bundle collections!</p>
                      <Button
                        onClick={fetchBundles}
                        variant="ghost"
                        className="text-pink-500 hover:bg-pink-50"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                      </Button>
                    </div>
                  </motion.div>
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

      {/* <Footer /> */}
    </div>
  )
}