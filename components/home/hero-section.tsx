"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Star, Award, Download } from "lucide-react";
import Link from "next/link";
import HeroButton from "../ui/hero-button";
import { Pacifico } from "next/font/google";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pacifico",
});

function StaticShape({
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.15]",
  className = "",
}: {
  className?: string;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
}) {
  return (
    <div
      style={{
        width,
        height,
        transform: `rotate(${rotate}deg)`,
      }}
      className={cn(
        "absolute",
        className,
        "rounded-full bg-gradient-to-r to-transparent",
        gradient,
        "backdrop-blur-[2px] border-2 border-white/[0.25]",
        "shadow-[0_8px_32px_0_rgba(255,255,255,0.2)]",
        "after:absolute after:inset-0 after:rounded-full",
        "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.3),transparent_70%)]"
      )}
    />
  );
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50">
      {/* Static blurred gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-200/[0.3] via-amber-200/[0.2] to-rose-200/[0.3] blur-3xl" />
      

      <div className="relative z-10 container mx-auto px-4 py-20 md-py-2">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h1
            className="text-4xl sm:text-6xl lg:text-8xl font-black mb-10 leading-[0.9] tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-gray-800 block mb-2 drop-shadow-2xl">SS Creation</span>
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
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Ready-made designs for 
            {" "}
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">
              banners, 3D arches, festivals & wedding
            </span>{" "} 
            events
          </motion.p>

<div 
            className="flex flex-wrap justify-center gap-4 mb-8" 
          >
            <div className="flex items-center bg-white/40 backdrop-blur-sm px-4 py-2 rounded-full border border-orange-200/50">
              <Sparkles className="w-4 h-4 text-orange-500 mr-2" />
              <span className="text-gray-800 font-medium">100% photoshop compatible</span>
            </div>
            <div className="flex items-center bg-gradient-to-r from-rose-500/40 to-orange-500/50 backdrop-blur-sm px-5 py-3 rounded-full border-2 border-rose-300/70 shadow-lg transform scale-105 transition-all ">
              <Download className="w-5 h-5  mr-2" />
              <span className="font-bold text-white">PSD and CDR files</span>
            </div>
            <div className="flex items-center bg-white/40 backdrop-blur-sm px-4 py-2 rounded-full border border-orange-200/50">
              <Zap className="w-4 h-4 text-rose-500 mr-2" />
              <span className="text-gray-800 font-medium">Download instantly</span>
            </div>
          </div>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
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

<Link href="/contact" className="hidden lg:flex items-center">
              <HeroButton />
            </Link>
            <Link href="/contact" className="flex items-center lg:hidden">
              <Button>
                Get Custom Design
              </Button>
            </Link>
          </motion.div>

          {/* File format logos */}
          <motion.div 
            className="flex justify-center items-center gap-6 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-white/70 backdrop-blur-md p-3 sm:p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex flex-col items-center">
              <Image 
                src="/psd.png" 
                alt="Photoshop PSD Format" 
                width={60} 
                height={60} 
                className="w-10 h-10 sm:w-14 sm:h-14 object-contain" 
              />
              <span className="text-xs sm:text-sm font-medium text-gray-700 mt-1">PSD Format</span>
                </div>
            <div className="bg-white/70 backdrop-blur-md p-3 sm:p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex flex-col items-center">
              <Image 
                src="/cdr.png" 
                alt="CorelDRAW CDR Format" 
                width={60} 
                height={60}
                className="w-10 h-10 sm:w-14 sm:h-14 object-contain" 
              />
              <span className="text-xs sm:text-sm font-medium text-gray-700 mt-1">CDR Format</span>
                </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center group">
              <div className="bg-white/50 backdrop-blur-md rounded-2xl p-6 border border-orange-200/50 hover:bg-white/60 transition-all duration-300 hover:scale-105">
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500 mb-2">
                  1000+
                </div>
                <div className="text-gray-700 font-medium">Premium Templates</div>
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
          </div>
        </div>
      </div>

      {/* Light gradient overlay for subtle depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-orange-100/50 via-transparent to-orange-100/30 pointer-events-none" />
    </section>
  );
}