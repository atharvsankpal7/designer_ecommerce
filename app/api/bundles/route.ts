import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Bundle } from '@/lib/models';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('isActive');
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');

    const query: any = {};

    if (isActive === 'true') {
      query.isActive = true;
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    let bundleQuery = Bundle.find(query)
      .populate('products', 'title displayImage originalPrice discountPrice')
      .sort({ createdAt: -1 });

    if (limit) {
      bundleQuery = bundleQuery.limit(parseInt(limit));
    }

    const bundles = await bundleQuery.exec();

    // Transform the data to match the expected format
    const transformedBundles = bundles.map(bundle => ({
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
    }));

    return NextResponse.json(transformedBundles);
  } catch (error) {
    console.error('Error fetching bundles:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    
    const data = await request.json();
    const bundle = new Bundle(data);
    await bundle.save();

    return NextResponse.json({ success: true, id: bundle._id });
  } catch (error) {
    console.error('Error creating bundle:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}