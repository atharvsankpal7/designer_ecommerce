import { getHeroSlides } from '@/lib/actions';
import { ClientHeroSlider } from './client-hero-slider';
export const dynamic = 'force-dyamic'
export async function HeroSlider() {
  const heroSlides = await getHeroSlides();

  // If no slides are found, return null or a fallback
  if (heroSlides.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full h-[12vh] sm:h-[20vh] lg:h-[40vh] overflow-hidden">
      <ClientHeroSlider slides={heroSlides} />
      
      {/* SEO Content - Hidden but accessible to search engines */}
      <div className="sr-only">
        <h1>SSCreation - Premium Graphic Design Templates</h1>
        <p>
          Discover premium graphic design templates in Marathi, Hindi, and English. 
          SSCreation offers the best collection of festival designs, business templates, 
          and celebration graphics for instant download.
        </p>
        <ul>
          {heroSlides.map((slide) => (
            <li key={slide.id}>{slide.description || slide.title}</li>
          ))}
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
            "image": heroSlides.map(slide => ({
              "@type": "ImageObject",
              "url": slide.imageUrl.startsWith('http') ? slide.imageUrl : `https://sscreation.com${slide.imageUrl}`,
              "name": slide.title,
              "description": slide.altText
            }))
          })
        }}
      />
    </section>
  );
}