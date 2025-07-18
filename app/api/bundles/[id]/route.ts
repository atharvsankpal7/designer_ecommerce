import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Bundle } from '@/lib/models';
import { auth } from '@/lib/auth';

// GET single bundle by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const bundle = await Bundle.findById(params.id)
      .populate('products', 'title displayImage originalPrice discountPrice description')
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
    };

    return NextResponse.json(transformedBundle);
  } catch (error) {
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
    
    const data = await request.json();
    
    const bundle = await Bundle.findByIdAndUpdate(
      params.id,
      data,
      { new: true, runValidators: true }
    ).populate('products', 'title displayImage originalPrice discountPrice');

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
    };

    return NextResponse.json({ 
      success: true, 
      bundle: transformedBundle 
    });
  } catch (error) {
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
    
    const bundle = await Bundle.findByIdAndDelete(params.id);

    if (!bundle) {
      return NextResponse.json({ error: 'Bundle not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Bundle deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting bundle:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}