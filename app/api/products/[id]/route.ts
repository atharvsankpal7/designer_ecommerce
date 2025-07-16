import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Product } from '@/lib/models';
import { auth } from '@/lib/auth';

// GET single product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const product = await Product.findById(params.id)
      .populate('sectionId', 'name')
      .exec();

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Transform the data to match the expected format
    const transformedProduct = {
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
      section: {
        id: product.sectionId._id.toString(),
        name: product.sectionId.name,
      },
    };

    return NextResponse.json(transformedProduct);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT update product by ID (Admin only)
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
    
    // Remove empty sectionId to prevent casting errors
    if (data.sectionId === '') {
      delete data.sectionId;
    }
    const product = await Product.findByIdAndUpdate(
      params.id,
      data,
      { new: true, runValidators: true }
    ).populate('sectionId', 'name');

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Transform the data to match the expected format
    const transformedProduct = {
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
      section: product.sectionId ? {
        id: product.sectionId._id.toString(),
        name: product.sectionId.name,
      } : null,
    };

    return NextResponse.json({ 
      success: true, 
      product: transformedProduct 
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE product by ID (Admin only)
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
    
    const product = await Product.findByIdAndDelete(params.id);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Product deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}