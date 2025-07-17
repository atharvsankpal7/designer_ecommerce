"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Star, Award, Users } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import HeroButton from "../ui/hero-button";
import { Pacifico } from "next/font/google";
import { cn } from "@/lib/utils";

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pacifico",
});

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.15]",
}: {
  className?: string
  delay?: number
  width?: number
  height?: number
  rotate?: number
  gradient?: string
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          width,
          height,
        }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border-2 border-white/[0.25]",
            "shadow-[0_8px_32px_0_rgba(255,255,255,0.2)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.3),transparent_70%)]",
          )}
        />
      </motion.div>
    </motion.div>
  )
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50">
      {/* New animated background with warm colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-200/[0.3] via-amber-200/[0.2] to-rose-200/[0.3] blur-3xl" />

      {/* Animated geometric shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-orange-400/[0.25]"
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
        />

        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-rose-400/[0.25]"
          className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
        />

        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-amber-400/[0.25]"
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
        />

        <ElegantShape
          delay={0.6}
          width={200}
          height={60}
          rotate={20}
          gradient="from-yellow-400/[0.25]"
          className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
        />

        <ElegantShape
          delay={0.7}
          width={150}
          height={40}
          rotate={-25}
          gradient="from-orange-300/[0.25]"
          className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
        />
      </div>

      {/* Enhanced floating elements */}
      <motion.div
        className="absolute top-20 left-10 text-orange-500/60 hidden lg:block"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <div className="relative">
          <Sparkles className="w-8 h-8 drop-shadow-lg" />
          <div className="absolute inset-0 bg-orange-400/30 rounded-full blur-md scale-150" />
        </div>
      </motion.div>

      <motion.div
        className="absolute top-40 right-20 text-rose-500/60 hidden lg:block"
        animate={{
          y: [0, 20, 0],
          rotate: [0, -10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        <div className="relative">
          <Zap className="w-6 h-6 drop-shadow-lg" />
          <div className="absolute inset-0 bg-rose-400/30 rounded-full blur-md scale-150" />
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-32 left-16 text-amber-500/50 hidden md:block"
        animate={{
          y: [0, -15, 0],
          rotate: [0, 15, 0],
        }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 2,
        }}
      >
        <div className="relative">
          <Star className="w-5 h-5 drop-shadow-lg" />
          <div className="absolute inset-0 bg-amber-400/30 rounded-full blur-md scale-150" />
        </div>
      </motion.div>

      <motion.div
        className="absolute top-32 right-32 text-yellow-500/50 hidden xl:block"
        animate={{
          y: [0, 25, 0],
          rotate: [0, -20, 0],
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 0.5,
        }}
      >
        <div className="relative">
          <Award className="w-6 h-6 drop-shadow-lg" />
          <div className="absolute inset-0 bg-yellow-400/30 rounded-full blur-md scale-150" />
        </div>
      </motion.div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <span className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-white/60 to-white/40 backdrop-blur-md border border-orange-200/50 text-orange-800 text-sm font-semibold shadow-2xl">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-3 animate-pulse" />
              Premium Design Templates
              <Award className="w-4 h-4 ml-2 text-orange-500" />
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-6xl lg:text-8xl font-black mb-8 leading-[0.9] tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <span className="text-gray-800 block mb-4 drop-shadow-2xl">
              SS Creation
            </span>
            <span className="block">
              <span className={cn(
                "text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 drop-shadow-2xl",
                pacifico.className
              )}>
                Digital Vision
              </span>
            </span>
          </motion.h1>

          <motion.p
            className="text-xl sm:text-2xl lg:text-3xl mb-12 text-gray-700 max-w-4xl mx-auto leading-relaxed font-light"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Crafting exceptional digital experiences through{" "}
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">
              innovative design
            </span>{" "}
            and cutting-edge technology.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Button
              asChild
              size="lg"
              className="group relative bg-gradient-to-r from-orange-500 via-rose-500 to-amber-500 hover:from-orange-600 hover:via-rose-600 hover:to-amber-600 text-white border-0 px-6 sm:px-8 md:px-10 py-5 sm:py-6 md:py-7 text-lg sm:text-xl font-bold rounded-3xl shadow-2xl hover:shadow-orange-500/30 transition-all duration-500 hover:scale-110 overflow-hidden w-full sm:w-auto"
            >
              <Link href="/products" className="flex items-center justify-center relative z-10">
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="whitespace-nowrap">Explore Premium Designs</span>
                <ArrowRight className="ml-2 sm:ml-3 h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
            </Button>

            <Link href="/contact" className="flex items-center">
              <HeroButton/>
            </Link>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <div className="text-center group">
              <div className="bg-white/50 backdrop-blur-md rounded-2xl p-6 border border-orange-200/50 hover:bg-white/60 transition-all duration-300 hover:scale-105">
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500 mb-2">
                  1000+
                </div>
                <div className="text-gray-700 font-medium">
                  Premium Templates
                </div>
              </div>
            </div>

            <div className="text-center group">
              <div className="bg-white/50 backdrop-blur-md rounded-2xl p-6 border border-orange-200/50 hover:bg-white/60 transition-all duration-300 hover:scale-105">
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500 mb-2">
                  50k+
                </div>
                <div className="text-gray-700 font-medium">Happy Clients</div>
              </div>
            </div>

            <div className="text-center group">
              <div className="bg-white/50 backdrop-blur-md rounded-2xl p-6 border border-orange-200/50 hover:bg-white/60 transition-all duration-300 hover:scale-105">
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-500 mb-2">
                  24/7
                </div>
                <div className="text-gray-700 font-medium">Expert Support</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Light gradient overlay for subtle depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-orange-100/50 via-transparent to-orange-100/30 pointer-events-none" />
    </section>
  );
}