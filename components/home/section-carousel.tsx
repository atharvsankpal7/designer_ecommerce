import { Button } from "@/components/ui/button"
import { Crown, Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import connectDB from "@/lib/mongodb"
import { Product } from "@/lib/models"
import { ModernAutoScrollCarousel } from "@/components/product-slider/AutoScrollCarousel"
import { SectionHierarchy } from "@/types/section"
import { getSectionProducts } from "@/lib/actions"
export const dynamic = 'force-dynamic';

interface ProductType {
  id: string
  title: string
  displayImage: string
  originalPrice: number
  discountPrice?: number
}

interface SectionCarouselProps {
  section: SectionHierarchy;
}


export async function SectionCarousel({ section }: SectionCarouselProps) {
  const products = await getSectionProducts(section.id)

  if (products.length === 0) return null

  const sectionUrl = `/products/${section.slug}`;

  return (
    <section className="py-6 relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black  text-center tracking-tight bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 bg-clip-text text-transparent">{section.name} Collection</h2>

        {/* Carousel section */}
        <div className="relative">
          <ModernAutoScrollCarousel products={products} />
        </div>

        {/* CTA button */}
        <div className="flex justify-center mt-1">
          <Button
            asChild
            size="lg"
            className={cn(
              "group relative inline-flex h-11 animate-rainbow cursor-pointer items-center justify-center rounded-xl border-0 bg-[length:200%] px-8 py-2 font-medium text-primary-foreground transition-all duration-300 ease-in-out [background-clip:padding-box,border-box,border-box] [background-origin:border-box] [border:calc(0.08*1rem)_solid_transparent] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
              "before:absolute before:bottom-[-20%] before:left-1/2 before:z-0 before:h-1/5 before:w-3/5 before:-translate-x-1/2 before:animate-rainbow before:bg-[linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))] before:bg-[length:200%] before:[filter:blur(calc(0.8*1rem))]",
              "bg-[linear-gradient(#121213,#121213),linear-gradient(#121213_50%,rgba(18,18,19,0.6)_80%,rgba(18,18,19,0)),linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))]",
              "dark:bg-[linear-gradient(#fff,#fff),linear-gradient(#fff_50%,rgba(255,255,255,0.6)_80%,rgba(0,0,0,0)),linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))] text-yellow-100 hover:text-white hover:scale-105 transition-all duration-300 ease-in-out"
            )}
          >
            <Link href={sectionUrl} className="flex items-center">
              Explore {section.name}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}