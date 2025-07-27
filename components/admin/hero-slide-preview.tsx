"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, SkipForward, SkipBack } from "lucide-react"
import { cn } from "@/lib/utils"

interface HeroSlide {
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

interface HeroSlidePreviewProps {
  slides: HeroSlide[];
}

export function HeroSlidePreview({ slides }: HeroSlidePreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  const activeSlides = slides.filter(slide => slide.isActive).sort((a, b) => a.displayOrder - b.displayOrder)

  useEffect(() => {
    if (!isPlaying || activeSlides.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % activeSlides.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [isPlaying, activeSlides.length])

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % activeSlides.length)
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + activeSlides.length) % activeSlides.length)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  if (activeSlides.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Hero Slider Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-[16/6] bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">No active slides to preview</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const currentSlide = activeSlides[currentIndex]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Hero Slider Preview</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">
              {currentIndex + 1} of {activeSlides.length}
            </Badge>
            <div className="flex items-center space-x-1">
              <Button
                size="sm"
                variant="outline"
                onClick={goToPrevious}
                disabled={activeSlides.length <= 1}
                className="h-8 w-8 p-0"
              >
                <SkipBack className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={togglePlayPause}
                disabled={activeSlides.length <= 1}
                className="h-8 w-8 p-0"
              >
                {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={goToNext}
                disabled={activeSlides.length <= 1}
                className="h-8 w-8 p-0"
              >
                <SkipForward className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-[16/6] bg-gray-100 rounded-lg overflow-hidden">
          {/* Background Images */}
          {activeSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={cn(
                "absolute inset-0 transition-opacity duration-1000 ease-in-out",
                index === currentIndex ? "opacity-100" : "opacity-0"
              )}
            >
              <Image
                src={slide.imageUrl}
                alt={slide.altText}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
              />
              
              {/* Overlay for better text readability */}
              <div className="absolute inset-0 bg-black/20" />
            </div>
          ))}

          {/* Navigation dots */}
          {activeSlides.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
              {activeSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    index === currentIndex
                      ? "bg-white shadow-lg"
                      : "bg-white/50 hover:bg-white/75"
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Slide content overlay */}
          {currentSlide?.description && (
            <div className="absolute bottom-6 left-6 right-6 z-10">
              <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 text-white max-w-md">
                <h3 className="text-lg font-bold mb-2">
                  {currentSlide.title}
                </h3>
                <p className="text-sm opacity-90 mb-3">
                  {currentSlide.description}
                </p>
                {currentSlide.linkUrl && currentSlide.linkText && (
                  <div className="inline-block bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300">
                    {currentSlide.linkText}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Slide Info */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-900">{currentSlide.title}</h4>
            <Badge variant="outline">Order: {currentSlide.displayOrder}</Badge>
          </div>
          {currentSlide.description && (
            <p className="text-sm text-gray-600 mb-2">{currentSlide.description}</p>
          )}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Alt Text: {currentSlide.altText}</span>
            {currentSlide.linkUrl && (
              <span>Links to: {currentSlide.linkUrl}</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}