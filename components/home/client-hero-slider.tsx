"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface HeroSlideType {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  altText: string;
  displayOrder: number;
  linkUrl?: string;
  linkText?: string;
  isActive: boolean;
}

interface ClientHeroSliderProps {
  slides: HeroSlideType[];
}

export function ClientHeroSlider({ slides }: ClientHeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length)
    }, 4000) // Change image every 4 seconds

    return () => clearInterval(interval)
  }, [slides.length])



  return (
    <>
      {/* Background Images */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
            index === currentIndex ? "opacity-100" : "opacity-0"
          )}
        >
          {slide.linkUrl ? (
            <Link href={slide.linkUrl} className="block w-full h-full">
              <Image
                src={slide.imageUrl}
                alt={slide.altText}
                fill
                className="object-contain"
                priority={index === 0}
                quality={90}
                sizes="100vw"
              />
            </Link>
          ) : (
            <Image
              src={slide.imageUrl}
              alt={slide.altText}
              fill
              className="object-contain"
              priority={index === 0}
              quality={90}
              sizes="100vw"
            />
          )}
          
          {/* Optional overlay for better text readability */}
          {/* <div className="absolute inset-0 bg-black/10" /> */}
        </div>
      ))}

    </>
  )
}