import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Product, Section } from '@/lib/models';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const sectionName = searchParams.get('section');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const newProducts = searchParams.get('new');
    const limit = searchParams.get('limit');

    const query: any = { isActive: true };

    if (sectionName && sectionName !== 'all') {
      try {
        // Find the section by name (case-insensitive)
        const sectionDoc = await Section.findOne({ 
          name: { $regex: new RegExp(sectionName, 'i') },
          isActive: true
        });
        
        if (sectionDoc) {
          query.sectionIds = sectionDoc._id;
        }
      } catch (error : any) {
        console.error('Error finding section by name:', error);
      }
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    let productQuery = Product.find(query).populate('sectionIds', 'name slug');

    if (newProducts === 'true') {
      productQuery = productQuery.sort({ createdAt: -1 });
    } else {
      productQuery = productQuery.sort({ createdAt: -1 });
    }

    if (limit) {
      productQuery = productQuery.limit(parseInt(limit));
    }

    const products = await productQuery.exec();

    // Transform the data to match the expected format
    const transformedProducts = products.map(product => ({
      id: product._id.toString(),
      title: product.title,
      description: product.description,
      originalPrice: product.originalPrice,
      discountPrice: product.discountPrice,
      displayImage: product.displayImage,
      productFiles: product.productFiles,
      isFeatured: product.isFeatured,
      isActive: product.isActive,
      createdAt: product.createdAt,
      sections: product.sectionIds?.map((section: any) => ({
        id: section._id.toString(),
        name: section.name,
        slug: section.slug,
      })) || [],
    }));

    return NextResponse.json(transformedProducts);
  } catch (error : any) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const data = await request.json();
    
    // Validate that sectionIds is provided and is an array
    if (!data.sectionIds || !Array.isArray(data.sectionIds) || data.sectionIds.length === 0) {
      return NextResponse.json({ error: 'At least one section must be selected' }, { status: 400 });
    }

    // Validate that all section IDs exist
    const validSections = await Section.find({ 
      _id: { $in: data.sectionIds },
      isActive: true 
    });

    if (validSections.length !== data.sectionIds.length) {
      return NextResponse.json({ error: 'One or more selected sections are invalid' }, { status: 400 });
    }

    const product = new Product(data);
    await product.save();

    return NextResponse.json({ success: true, id: product._id });
  } catch (error : any) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
