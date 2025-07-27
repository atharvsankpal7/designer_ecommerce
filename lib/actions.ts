// lib/actions/product.actions.ts

import connectDB from '@/lib/mongodb';
import { Bundle, Product, Section, HeroSlide } from '@/lib/models'; 
export const dynamic = 'force-dynamic';


// Define the ProductType interface if it's not already global or in a shared types file
interface ProductType {
  id: string;
  title: string;
  displayImage: string;
  originalPrice: number;
  discountPrice?: number;
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
        .limit(3)
       

      const transformedProducts = products.map((product) => ({
        id: product.id.toString(),
        title: product.title,
        displayImage: product.displayImage,
        originalPrice: product.originalPrice,
        discountPrice: product.discountPrice,
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
    const product = await Product.findById(productId).lean();
    if (!product || Array.isArray(product)) return null;
    
    return {
      id: product.id.toString(),
      title: product.title,
      displayImage: product.displayImage,
      originalPrice: product.originalPrice,
      discountPrice: product.discountPrice,
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
        id: product.id.toString(),
        title: product.title,
        displayImage: product.displayImage,
        originalPrice: product.originalPrice,
        discountPrice: product.discountPrice,
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
        id: bundle.id.toString(),
        name: bundle.name,
        description: bundle.description,
        originalPrice: bundle.originalPrice,
        discountPrice: bundle.discountPrice,
        displayImage: bundle.displayImage,
        products: bundle.products.map((product: any) => ({
          id: product.id.toString(),
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

  
export async function getSectionProducts(sectionId: string): Promise<ProductType[]> {
  try {
    await connectDB()

    const products = await Product.find({
      isActive: true,
      sectionIds: sectionId,
    })
      .sort({ createdAt: -1 })
      .limit(8)
    const transformedProducts = products.map((product) => ({
      id: product.id.toString(),
      title: product.title,
      displayImage: product.displayImage,
      originalPrice: product.originalPrice,
      discountPrice: product.discountPrice,
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
        
      const transformedSlides = slides.map((slide) => ({
        id: slide.id.toString(),
        title: slide.title,
        description: slide.description,
        imageUrl: slide.imageUrl,
        altText: slide.altText,
        displayOrder: slide.displayOrder,
        linkUrl: slide.linkUrl,
        linkText: slide.linkText,
        isActive: slide.isActive,
      }));
      console.log(transformedSlides)
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
    return {
      id: slide.id.toString(),
      title: slide.title,
      description: slide.description,
      imageUrl: slide.imageUrl,
      altText: slide.altText,
      displayOrder: slide.displayOrder,
      linkUrl: slide.linkUrl,
      linkText: slide.linkText,
      isActive: slide.isActive,
    };
  } catch (error: any) {
    console.error(`Error fetching hero slide ${slideId}:`, error);
    return null;
  }
}