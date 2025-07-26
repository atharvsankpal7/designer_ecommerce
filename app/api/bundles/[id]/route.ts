import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Bundle } from '@/lib/models';
import { auth } from '@/lib/auth';
import mongoose from 'mongoose';

// GET single bundle by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid bundle ID format' },
        { status: 400 }
      );
    }
    
    const bundle = await Bundle.findById(params.id)
      .populate('products', 'title displayImage originalPrice discountPrice description')
      .populate('sectionIds', 'name slug')
      .exec();

    if (!bundle) {
      return NextResponse.json({ error: 'Bundle not found' }, { status: 404 });
    }
    if(!bundle.isActive){
      return NextResponse.json({ error: 'Bundle is currently not available for purchase' }, { status: 404 });
    }
    // Transform the data to match the expected format
    const transformedBundle = {
      id: bundle._id.toString(),
      name: bundle.name,
      description: bundle.description,
      originalPrice: bundle.originalPrice,
      discountPrice: bundle.discountPrice,
      displayImage: bundle.displayImage,
      isActive: bundle.isActive,
      isFeatured: bundle.isFeatured,
      createdAt: bundle.createdAt,
      products: bundle.products.map((product: any) => ({
        id: product._id.toString(),
        title: product.title,
        description: product.description,
        displayImage: product.displayImage,
        originalPrice: product.originalPrice,
        discountPrice: product.discountPrice,
      })),
      sections: bundle.sectionIds?.map((section: any) => ({
        id: section._id.toString(),
        name: section.name,
        slug: section.slug,
      })) || [],
    };

    return NextResponse.json(transformedBundle);
  } catch (error : any) {
    console.error('Error fetching bundle:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT update bundle by ID (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin authentication
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid bundle ID format' },
        { status: 400 }
      );
    }
    
    const data = await request.json();
    
    // Validate that products array is provided and not empty
    if (data.products && (!Array.isArray(data.products) || data.products.length === 0)) {
      return NextResponse.json({ error: 'At least one product must be selected' }, { status: 400 });
    }

    // Validate that sectionIds is an array if provided
    if (data.sectionIds && !Array.isArray(data.sectionIds)) {
      return NextResponse.json({ error: 'Section IDs must be an array' }, { status: 400 });
    }

    // Validate that all section IDs exist if sectionIds is provided and not empty
    if (data.sectionIds && data.sectionIds.length > 0) {
      const { Section } = await import('@/lib/models');
      const validSections = await Section.find({ 
        _id: { $in: data.sectionIds },
        isActive: true 
      });

      if (validSections.length !== data.sectionIds.length) {
        return NextResponse.json({ error: 'One or more selected sections are invalid' }, { status: 400 });
      }
    }
    
    const bundle = await Bundle.findByIdAndUpdate(
      params.id,
      data,
      { new: true, runValidators: true }
    ).populate('products', 'title displayImage originalPrice discountPrice')
     .populate('sectionIds', 'name slug');

    if (!bundle) {
      return NextResponse.json({ error: 'Bundle not found' }, { status: 404 });
    }

    // Transform the data to match the expected format
    const transformedBundle = {
      id: bundle._id.toString(),
      name: bundle.name,
      description: bundle.description,
      originalPrice: bundle.originalPrice,
      discountPrice: bundle.discountPrice,
      displayImage: bundle.displayImage,
      isActive: bundle.isActive,
      isFeatured: bundle.isFeatured,
      createdAt: bundle.createdAt,
      products: bundle.products.map((product: any) => ({
        id: product._id.toString(),
        title: product.title,
        displayImage: product.displayImage,
        originalPrice: product.originalPrice,
        discountPrice: product.discountPrice,
      })),
      sections: bundle.sectionIds?.map((section: any) => ({
        id: section._id.toString(),
        name: section.name,
        slug: section.slug,
      })) || [],
    };

    return NextResponse.json({ 
      success: true, 
      bundle: transformedBundle 
    });
  } catch (error : any) {
    console.error('Error updating bundle:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE bundle by ID (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin authentication
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid bundle ID format' },
        { status: 400 }
      );
    }
    
    const bundle = await Bundle.findByIdAndDelete(params.id);

    if (!bundle) {
      return NextResponse.json({ error: 'Bundle not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Bundle deleted successfully' 
    });
  } catch (error : any) {
    console.error('Error deleting bundle:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}