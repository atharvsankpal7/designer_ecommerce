import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { HeroSlide } from '@/lib/models';
import { revalidateHeroSlideCaches } from '@/lib/cache-utils';

const sampleHeroSlides = [
  {
    title: "Marathi Templates",
    description: "Premium Marathi graphic design templates for festivals and celebrations",
    imageUrl: "/hero-marathi.png",
    altText: "SSCreation Marathi Graphic Design Templates - Premium Festival and Business Designs",
    displayOrder: 0,
    linkUrl: "/products?section=marathi",
    linkText: "Explore Marathi Designs",
    isActive: true,
  },
  {
    title: "English Templates", 
    description: "Professional English business templates and corporate designs",
    imageUrl: "/hero-english.png",
    altText: "SSCreation English Graphic Design Templates - Professional Business and Celebration Designs",
    displayOrder: 1,
    linkUrl: "/products?section=english",
    linkText: "Explore English Designs",
    isActive: true,
  },
  {
    title: "Hindi Templates",
    description: "Traditional Hindi festival graphics and cultural templates",
    imageUrl: "/hero-hindi.png", 
    altText: "SSCreation Hindi Graphic Design Templates - Festival and Cultural Design Collection",
    displayOrder: 2,
    linkUrl: "/products?section=hindi",
    linkText: "Explore Hindi Designs",
    isActive: true,
  },
];

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    // Get current max display order
    const maxOrderSlide = await HeroSlide.findOne().sort({ displayOrder: -1 });
    const startOrder = maxOrderSlide ? maxOrderSlide.displayOrder + 1 : 0;
    
    // Adjust display orders for new slides
    const slidesToInsert = sampleHeroSlides.map((slide, index) => ({
      ...slide,
      displayOrder: startOrder + index,
    }));
    
    // Insert sample hero slides
    const createdSlides = await HeroSlide.insertMany(slidesToInsert);
    
    // Revalidate cache
    await revalidateHeroSlideCaches();
    
    return NextResponse.json({
      success: true,
      message: 'Sample hero slides added successfully',
      count: createdSlides.length,
      slides: createdSlides.map(slide => ({
        id: slide._id.toString(),
        title: slide.title,
        displayOrder: slide.displayOrder,
      })),
    });
    
  } catch (error) {
    console.error('Error seeding hero slides:', error);
    return NextResponse.json(
      { error: 'Failed to seed hero slides' },
      { status: 500 }
    );
  }
}