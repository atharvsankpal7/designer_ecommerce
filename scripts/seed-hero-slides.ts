import connectDB from '../lib/mongodb';
import { HeroSlide } from '../lib/models';

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

async function seedHeroSlides() {
  try {
    await connectDB();
    
    // Clear existing hero slides
    await HeroSlide.deleteMany({});
    console.log('Cleared existing hero slides');
    
    // Insert sample hero slides
    const createdSlides = await HeroSlide.insertMany(sampleHeroSlides);
    console.log(`Created ${createdSlides.length} hero slides:`);
    
    createdSlides.forEach((slide, index) => {
      console.log(`${index + 1}. ${slide.title} (Order: ${slide.displayOrder})`);
    });
    
    console.log('\nHero slides seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding hero slides:', error);
    process.exit(1);
  }
}

seedHeroSlides();