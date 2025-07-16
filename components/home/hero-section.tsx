"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Star, Award, Users } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import HeroButton from "../ui/hero-button";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-rose-900">
        {/* Animated mesh gradient overlay */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>

        {/* Premium dot pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220%200%2060%2060%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fillRule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fillOpacity=%220.05%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221.5%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />

        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />
      </div>
      {/* Enhanced floating elements */}
      <motion.div
        className="absolute top-20 left-10 text-yellow-400/40 hidden lg:block"
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
          <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-md scale-150" />
        </div>
      </motion.div>

      <motion.div
        className="absolute top-40 right-20 text-pink-400/40 hidden lg:block"
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
          <div className="absolute inset-0 bg-pink-400/20 rounded-full blur-md scale-150" />
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-32 left-16 text-purple-400/30 hidden md:block"
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
          <div className="absolute inset-0 bg-purple-400/20 rounded-full blur-md scale-150" />
        </div>
      </motion.div>

      <motion.div
        className="absolute top-32 right-32 text-emerald-400/30 hidden xl:block"
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
          <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-md scale-150" />
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
            <span className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-white/15 to-white/5 backdrop-blur-md border border-white/20 text-white text-sm font-semibold shadow-2xl">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3 animate-pulse" />
              Premium Design Templates
              <Award className="w-4 h-4 ml-2 text-yellow-400" />
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-6xl lg:text-8xl font-black mb-8 leading-[0.9] tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <span className="text-white block mb-4 drop-shadow-2xl">
              Craft Premium
            </span>
            <span className="block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 drop-shadow-2xl">
                Designs
              </span>
            </span>
          </motion.h1>

          <motion.p
            className="text-xl sm:text-2xl lg:text-3xl mb-12 text-white/90 max-w-4xl mx-auto leading-relaxed font-light"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Elevate your brand with our{" "}
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
              meticulously crafted
            </span>{" "}
            design templates. Professional quality, instant download, lifetime
            access.
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
              className="group relative bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white border-0 px-6 sm:px-8 md:px-10 py-5 sm:py-6 md:py-7 text-lg sm:text-xl font-bold rounded-3xl shadow-2xl hover:shadow-purple-500/30 transition-all duration-500 hover:scale-110 overflow-hidden w-full sm:w-auto"
            >
              <Link href="/products" className="flex items-center justify-center relative z-10">
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="whitespace-nowrap">Explore Premium Designs</span>
                <ArrowRight className="ml-2 sm:ml-3 h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
            </Button>


            

            <HeroButton/>
            


            {/* <Button
              asChild
              variant="outline"
              size="lg"
              className="group bg-white/5 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white/15 hover:border-white/50 px-10 py-7 text-xl font-bold rounded-3xl transition-all duration-500 hover:scale-110 shadow-xl"
            >
                Custom Design
                <Sparkles className="ml-3 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
            </Button> */}
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <div className="text-center group">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300 mb-2">
                  1000+
                </div>
                <div className="text-white/80 font-medium">
                  Premium Templates
                </div>
              </div>
            </div>

            <div className="text-center group">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300 mb-2">
                  50k+
                </div>
                <div className="text-white/80 font-medium">Happy Clients</div>
              </div>
            </div>

            <div className="text-center group">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-300 mb-2">
                  24/7
                </div>
                <div className="text-white/80 font-medium">Expert Support</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
