// lib/actions/product.actions.ts

import connectDB from '@/lib/mongodb';
import { Bundle, Product, Section, HeroSlide } from '@/lib/models'; 
import ContactSettings from '@/models/ContactSettings';
import SocialMedia from '@/models/SocialMedia';
import FooterLinks from '@/models/FooterLinks';
export const dynamic = 'force-dynamic';


// Define the ProductType interface if it's not already global or in a shared types file
interface ProductType {
  id: string;
  title: string;
  description: string;
  displayImage: string;
  originalPrice: number;
  discountPrice?: number;
  isFeatured: boolean;
  createdAt: string;
}

export const getNewProducts = 
  async (): Promise<ProductType[]> => {
    try {
      await connectDB();

      const products = await Product.find({
        isActive: true,
      })
        .sort({ createdAt: -1 })
        .limit(4)
       

      const transformedProducts = products.map((product) => ({
        id: product._id.toString(),
        title: product.title,
        description: product.description,
        displayImage: product.displayImage,
        originalPrice: product.originalPrice,
        discountPrice: product.discountPrice,
        isFeatured: product.isFeatured,
        createdAt: product.createdAt.toISOString(),
      }));

      return transformedProducts;
    } catch (error: any) {
      console.error('Error fetching new products:', error);
      // Depending on your error handling strategy, you might re-throw or return an empty array
      throw new Error('Failed to fetch new products.');
    }
  }


// You can add other product-related actions here, e.g.:
export const getProductById = async (
  productId: string,
): Promise<ProductType | null> => {
  try {
    await connectDB();
    const product = await Product.findById(productId);
    if (!product || Array.isArray(product)) return null;
    
    return {
      id: product._id.toString(),
      title: product.title,
      description: product.description,
      displayImage: product.displayImage,
      originalPrice: product.originalPrice,
      discountPrice: product.discountPrice,
      isFeatured: product.isFeatured,
      createdAt: product.createdAt.toISOString(),
    };
  } catch (error: any) {
    console.error(`Error fetching product ${productId}:`, error);
    throw new Error('Failed to fetch product.');
  }
};
export async function getFeaturedProducts(): Promise<ProductType[]> {
    try {
      await connectDB()
  
      const products = await Product.find({
        isActive: true,
        isFeatured: true,
      })
        .sort({ createdAt: -1 })
        .limit(8)
  
      const transformedProducts = products.map((product) => ({
        id: product._id.toString(),
        title: product.title,
        description: product.description,
        displayImage: product.displayImage,
        originalPrice: product.originalPrice,
        discountPrice: product.discountPrice,
        isFeatured: product.isFeatured,
        createdAt: product.createdAt.toISOString(),
      }))
  
      return transformedProducts
    } catch (error : any) {
      console.error("Error fetching featured products:", error)
      return []
    }
  }

  interface Bundle {
    id: string;
    name: string;
    description: string;
    displayImage: string;
    originalPrice: number;
    discountPrice?: number;
    products: {
      id: string;
      title: string;
      displayImage?: string;
      originalPrice?: number;
      discountPrice?: number;
    }[];
  }
  
  
  export async function getFeaturedBundles(): Promise<Bundle[]> {
    try {
      await connectDB();
      
      const bundles = await Bundle.find({
        isActive: true,
        isFeatured: true
      })
        .populate('products', 'title displayImage originalPrice discountPrice ')
        .sort({ createdAt: -1 })
        .limit(4)
        // .lean();
  
      const transformedBundles = bundles.map(bundle => ({
        id: bundle._id.toString(),
        name: bundle.name,
        description: bundle.description,
        originalPrice: bundle.originalPrice,
        discountPrice: bundle.discountPrice,
        displayImage: bundle.displayImage,
        products: bundle.products.map((product: any) => ({
          id: product._id.toString(),
          title: product.title,
          displayImage: product.displayImage,
          originalPrice: product.originalPrice,
          discountPrice: product.discountPrice,
        })),
      }));
  
      return transformedBundles;
    } catch (error : any) {
      console.error("Error fetching featured bundles:", error);
      return [];
    }
  }
  
 export async function getAllProducts(page = 1, sort = 'newest', priceRange?: string, sectionName?: string) {
    await connectDB();
    
    const limit = 12;
    const skip = (page - 1) * limit;
    
    let query: any = {
      isActive: true,
    };
    
    // Apply section filter
    if (sectionName) {
      const section = await Section.findOne({ 
        name: { $regex: new RegExp(sectionName, 'i') },
        isActive: true 
      });
      if (section) {
        query.sectionIds = section._id;
      }
    }
    
    // Apply price range filter
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      if (max) {
        query.originalPrice = { $gte: min, $lte: max };
      } else {
        query.originalPrice = { $gte: min };
      }
    }
    
    // Apply sorting
    let sortQuery: any = {};
    switch (sort) {
      case 'price-low':
        sortQuery = { originalPrice: 1 };
        break;
      case 'price-high':
        sortQuery = { originalPrice: -1 };
        break;
      case 'name':
        sortQuery = { title: 1 };
        break;
      case 'featured':
        sortQuery = { isFeatured: -1, createdAt: -1 };
        break;
      default:
        sortQuery = { createdAt: -1 };
    }
    
    const [products, totalCount] = await Promise.all([
      Product.find(query)
        .sort(sortQuery)
        .skip(skip)
        .limit(limit)
        .populate('sectionIds', 'name slug'),
      Product.countDocuments(query)
    ]);
    
    const transformedProducts = products.map((product: any) => ({
      id: product._id.toString(),
      title: product.title,
      description: product.description,
      displayImage: product.displayImage,
      originalPrice: product.originalPrice,
      discountPrice: product.discountPrice,
      isFeatured: product.isFeatured,
      sections: product.sectionIds.map((section: any) => ({
        id: section._id.toString(),
        name: section.name,
        slug: section.slug,
      })),
    }));
    
    return {
      products: transformedProducts,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  }

  
export async function getSectionProducts(sectionId: string): Promise<ProductType[]> {
  try {
    await connectDB()

    const products = await Product.find({
      isActive: true,
      sectionIds: sectionId,
    })
      .sort({ createdAt: -1 })
      .limit(8)
    const transformedProducts = products.map((product: any) => ({
      id: product._id.toString(),
      title: product.title,
      description: product.description,
      displayImage: product.displayImage,
      originalPrice: product.originalPrice,
      discountPrice: product.discountPrice,
      isFeatured: product.isFeatured,
      createdAt: product.createdAt.toISOString(),
    }))

    return transformedProducts
  } catch (error : any) {
    console.error("Error fetching section products:", error)
    return []
  }
}

// Hero Slide Types and Actions
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

// Get active hero slides for display
export const getHeroSlides = 
  async (): Promise<HeroSlideType[]> => {
    try {
      await connectDB();

      const slides = await HeroSlide.find({
        isActive: true,
      })
        .sort({ displayOrder: 1, createdAt: -1 })
        .lean();
        
      const transformedSlides = slides.map((slide: any) => ({
        id: slide._id.toString(),
        title: slide.title,
        description: slide.description,
        imageUrl: slide.imageUrl,
        altText: slide.altText,
        displayOrder: slide.displayOrder,
        linkUrl: slide.linkUrl,
        linkText: slide.linkText,
        isActive: slide.isActive,
      }));
      return transformedSlides;
    } catch (error: any) {
      console.error('Error fetching hero slides:', error);
      return [];
    }
  }

// Get single hero slide by ID
export async function getHeroSlideById(slideId: string): Promise<HeroSlideType | null> {
  try {
    await connectDB();
    const slide = await HeroSlide.findById(slideId).lean();
    if (!slide || Array.isArray(slide)) return null;
    
    const typedSlide = slide as any;
    return {
      id: typedSlide._id.toString(),
      title: typedSlide.title,
      description: typedSlide.description,
      imageUrl: typedSlide.imageUrl,
      altText: typedSlide.altText,
      displayOrder: typedSlide.displayOrder,
      linkUrl: typedSlide.linkUrl,
      linkText: typedSlide.linkText,
      isActive: typedSlide.isActive,
    };
  } catch (error: any) {
    console.error(`Error fetching hero slide ${slideId}:`, error);
    return null;
  }
}

// Get header data (phone number for header display)
export async function getHeaderData() {
  try {
    await connectDB();
    
    const contactSettings = await ContactSettings.findOne().lean();
    if (!contactSettings || Array.isArray(contactSettings)) {
      return {
        phone: '+91 85303 28357',
        whatsappNumber: '+918530328357'
      };
    }
    
    return {
      phone: (contactSettings as any).phone || '+91 85303 28357',
      whatsappNumber: (contactSettings as any).whatsappNumber || '+918530328357'
    };
  } catch (error) {
    console.error('Error fetching header data:', error);
    return {
      phone: '+91 85303 28357',
      whatsappNumber: '+918530328357'
    };
  }
}

export async function getContactData() {
  try {
    await connectDB();
    
    let contactSettings = await ContactSettings.findOne().lean();
    if (!contactSettings) {
      contactSettings = await ContactSettings.create({});
    }
    
    const socialMedia = await SocialMedia.find({ 
      isActive: true, 
      showInContact: true 
    }).sort({ order: 1 }).lean();
    
    return {
      contactSettings: JSON.parse(JSON.stringify(contactSettings)),
      socialMedia: JSON.parse(JSON.stringify(socialMedia))
    };
  } catch (error) {
    console.error('Error fetching contact data:', error);
    return {
      contactSettings: {
        phone: '+91 98765 43210',
        email: 'hello@sscreation.com',
        address: '123 Design Street, Mumbai',
        workingHours: {
          monday: '9:00 AM - 6:00 PM',
          tuesday: '9:00 AM - 6:00 PM',
          wednesday: '9:00 AM - 6:00 PM',
          thursday: '9:00 AM - 6:00 PM',
          friday: '9:00 AM - 6:00 PM',
          saturday: '10:00 AM - 4:00 PM',
          sunday: 'Closed'
        },
        mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.715872126558!2d72.8245093153778!3d19.04346925793646!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c96a34dc4401%3A0x3ffc07e83942b13f!2s123%20Design%20Street%2C%20Mumbai%2C%20Maharashtra%20400001!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin',
        whatsappNumber: '+919876543210'
      },
      socialMedia: []
    };
  }
}

export async function getFooterData() {
  try {
    await connectDB();
    
    let contactSettings = await ContactSettings.findOne().lean();
    if (!contactSettings) {
      contactSettings = await ContactSettings.create({});
    }
    
    const socialMedia = await SocialMedia.find({ 
      isActive: true, 
      showInFooter: true 
    }).sort({ order: 1 }).lean();
    
    const footerLinks = await FooterLinks.find({ 
      isActive: true 
    }).sort({ category: 1, order: 1 }).lean();
    
    return {
      contactSettings: JSON.parse(JSON.stringify(contactSettings)),
      socialMedia: JSON.parse(JSON.stringify(socialMedia)),
      footerLinks: JSON.parse(JSON.stringify(footerLinks))
    };
  } catch (error) {
    console.error('Error fetching footer data:', error);
    return {
      contactSettings: {
        phone: '+91 98765 43210',
        email: 'hello@sscreation.com',
        address: 'Mumbai, Maharashtra'
      },
      socialMedia: [],
      footerLinks: []
    };
  }
}

export async function getSectionProducts2(sectionId: string, page = 1, sort = 'newest', priceRange?: string) {
  await connectDB();
  
  const limit = 12;
  const skip = (page - 1) * limit;
  
  let query: any = {
    isActive: true,
    sectionIds: sectionId,
  };
  
  // Apply price range filter
  if (priceRange) {
    const [min, max] = priceRange.split('-').map(Number);
    if (max) {
      query.originalPrice = { $gte: min, $lte: max };
    } else {
      query.originalPrice = { $gte: min };
    }
  }
  
  // Apply sorting
  let sortQuery: any = {};
  switch (sort) {
    case 'price-low':
      sortQuery = { originalPrice: 1 };
      break;
    case 'price-high':
      sortQuery = { originalPrice: -1 };
      break;
    case 'name':
      sortQuery = { title: 1 };
      break;
    case 'featured':
      sortQuery = { isFeatured: -1, createdAt: -1 };
      break;
    default:
      sortQuery = { createdAt: -1 };
  }
  
  const [products, totalCount] = await Promise.all([
    Product.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .populate('sectionIds', 'name slug'),
    Product.countDocuments(query)
  ]);
  
  const transformedProducts = products.map((product) => ({
    id: product.id.toString(),
    title: product.title,
    description: product.description,
    displayImage: product.displayImage,
    originalPrice: product.originalPrice,
    discountPrice: product.discountPrice,
    isFeatured: product.isFeatured,
    sections: product.sectionIds.map((section: any) => ({
      id: section.id.toString(),
      name: section.name,
      slug: section.slug,
    })),
  }));
  
  return {
    products: transformedProducts,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
  };
}

export async function getContactSettings() {
  try {
    await connectDB();
    let settings = await ContactSettings.findOne()
    
    if (!settings) {
      settings = await ContactSettings.create({});
    }
    
    return {
      email: settings.email || 'ssbusiness7733@gmail.com',
      phone: settings.phone || '+91 85303 28357',
      address: settings.address || 'Peth, Sangli Road, SS CREATION Islampur, Opposite Rajarambapu Patil Bank',
      whatsappNumber: settings.whatsappNumber || '91 85303 28357'
    };
  } catch (error) {
    console.error('Error fetching contact settings:', error);
    // Return fallback values
    return {
      email: 'ssbusiness7733@gmail.com',
      phone: '++91 85303 28357',
      address: 'Peth, Sangli Road, SS CREATION Islampur, Opposite Rajarambapu Patil Bank',
      whatsappNumber: '+91 85303 28357'
    };
  }
}