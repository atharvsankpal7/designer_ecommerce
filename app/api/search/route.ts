import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Product, Bundle, Section } from '@/lib/models';
export const dynamic = 'force-dynamic'  

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query || query.trim().length < 2) {
      return NextResponse.json({ 
        products: [], 
        bundles: [], 
        categories: [],
        message: 'Search query must be at least 2 characters long'
      });
    }

    const searchRegex = new RegExp(query.trim(), 'i');

    // Search products
    const products = await Product.find({
      isActive: true,
      $or: [
        { title: { $regex: searchRegex } },
        { description: { $regex: searchRegex } }
      ]
    })
    .populate('sectionIds', 'name slug')
    .limit(10)
    .sort({ isFeatured: -1, createdAt: -1 });

    // Search bundles
    const bundles = await Bundle.find({
      isActive: true,
      $or: [
        { name: { $regex: searchRegex } },
        { description: { $regex: searchRegex } }
      ]
    })
    .populate('products', 'title')
    .limit(5)
    .sort({ isFeatured: -1, createdAt: -1 });

    // Search categories/sections
    const categories = await Section.find({
      isActive: true,
      name: { $regex: searchRegex }
    })
    .limit(5)
    .sort({ level: 1, displayOrder: 1 });

    // Transform data
    const transformedProducts = products.map(product => ({
      id: product._id.toString(),
      title: product.title,
      description: product.description,
      displayImage: product.displayImage,
      originalPrice: product.originalPrice,
      discountPrice: product.discountPrice,
      type: 'product',
      url: `/products/${product._id}`,
      sections: product.sectionIds?.map((section: any) => ({
        id: section._id.toString(),
        name: section.name,
        slug: section.slug,
      })) || [],
    }));

    const transformedBundles = bundles.map(bundle => ({
      id: bundle._id.toString(),
      name: bundle.name,
      description: bundle.description,
      displayImage: bundle.displayImage,
      originalPrice: bundle.originalPrice,
      discountPrice: bundle.discountPrice,
      type: 'bundle',
      url: `/bundles/${bundle._id}`,
      productCount: bundle.products.length,
    }));

    const transformedCategories = categories.map(category => ({
      id: category._id.toString(),
      name: category.name,
      slug: category.slug,
      level: category.level,
      type: 'category',
      url: `/products?section=${encodeURIComponent(category.name)}`,
    }));

    return NextResponse.json({
      products: transformedProducts,
      bundles: transformedBundles,
      categories: transformedCategories,
      totalResults: transformedProducts.length + transformedBundles.length + transformedCategories.length
    });
  } catch (error: any) {
    console.error('Error in search API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}