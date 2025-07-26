// lib/actions/product.actions.ts

import connectDB from '@/lib/mongodb';
import { Product } from '@/lib/models'; // Assuming your Product model is exported from here
import { unstable_cache as unstableCache } from 'next/cache';

// Define the ProductType interface if it's not already global or in a shared types file
interface ProductType {
  id: string;
  title: string;
  displayImage: string;
  originalPrice: number;
  discountPrice?: number;
  createdAt: string;
}

export const getNewProducts = unstableCache(
  async (): Promise<ProductType[]> => {
    try {
      await connectDB();

      const products = await Product.find({
        isActive: true,
      })
        .sort({ createdAt: -1 })
        .limit(3)
       

      const transformedProducts = products.map((product) => ({
        id: product._id.toString(),
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
  },
  ['new-products'], // Unique tag for this cache entry
  {
    tags: ['products', 'new-products'], // Specific tags for revalidation
    revalidate: 3600, // Revalidate every hour (or choose appropriate time)
  },
);

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