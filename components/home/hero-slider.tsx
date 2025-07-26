"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

const heroImages = [
  {
    src: "/hero-marathi.png",
    alt: "SSCreation Marathi Graphic Design Templates - Premium Festival and Business Designs",
    title: "Marathi Templates"
  },
  {
    src: "/hero-english.png", 
    alt: "SSCreation English Graphic Design Templates - Professional Business and Celebration Designs",
    title: "English Templates"
  },
  {
    src: "/hero-hindi.png",
    alt: "SSCreation Hindi Graphic Design Templates - Festival and Cultural Design Collection",
    title: "Hindi Templates"
  }
]

export function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length)
    }, 4000) // Change image every 4 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative w-full h-[12vh] sm:h-[20vh] lg:h-[35vh] overflow-hidden ">
      {/* Background Images */}
      {heroImages.map((image, index) => (
        <div
          key={index}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out ",
            index === currentIndex ? "opacity-100" : "opacity-0"
          )}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-fix"
            priority={index === 0}
            quality={90}
            sizes="90vw"
          />
          
          {/* Overlay for better text readability */}
        </div>
      ))}

      {/* SEO Content - Hidden but accessible to search engines */}
      <div className="sr-only">
        <h1>SSCreation - Premium Graphic Design Templates</h1>
        <p>
          Discover premium graphic design templates in Marathi, Hindi, and English. 
          SSCreation offers the best collection of festival designs, business templates, 
          and celebration graphics for instant download.
        </p>
        <ul>
          <li>Premium Marathi graphic design templates for festivals and celebrations</li>
          <li>Professional English business templates and corporate designs</li>
          <li>Traditional Hindi festival graphics and cultural templates</li>
          <li>Instant download with commercial license</li>
          <li>High-quality designs by SSCreation team</li>
        </ul>
      </div>

     

      {/* Schema.org structured data for images */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ImageGallery",
            "name": "SSCreation Hero Gallery",
            "description": "Premium graphic design templates showcase by SSCreation",
            "image": heroImages.map(img => ({
              "@type": "ImageObject",
              "url": `https://sscreation.com${img.src}`,
              "name": img.title,
              "description": img.alt
            }))
          })
        }}
      />
    </section>
  )
}