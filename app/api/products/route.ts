import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Product, Section } from '@/lib/models';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section')?.toLowerCase();
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const newProducts = searchParams.get('new');
    const limit = searchParams.get('limit');

    const query: any = { isActive: true };

    if (section && section !== 'all') {
  try {
        // First try to find the section by name
        const sectionDoc = await Section.findOne({ 
          name: { $regex: new RegExp(section, 'i') } 
        });
        
        if (sectionDoc) {
          query.sectionId = sectionDoc._id;
        } else if (mongoose.Types.ObjectId.isValid(section)) {
          // If not found by name but is a valid ObjectId, use it directly
          query.sectionId = section;
        }
  } catch (error) {
        console.error('Error finding section:', error);
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

    let productQuery = Product.find(query).populate('sectionId', 'name');

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
      createdAt: product.createdAt,
      section: {
        name: product.sectionId?.name || 'Unknown',
      },
    }));

    return NextResponse.json(transformedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const data = await request.json();
    const product = new Product(data);
    await product.save();

    return NextResponse.json({ success: true, id: product._id });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
