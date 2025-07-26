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
      .populate('sectionIds', 'name slug')
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
      sections: bundle.sectionIds?.map((section: any) => ({
        id: section._id.toString(),
        name: section.name,
        slug: section.slug,
      })) || [],
    }));

    return NextResponse.json(transformedBundles);
  } catch (error : any) {
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
    
    // Validate that products array is provided and not empty
    if (!data.products || !Array.isArray(data.products) || data.products.length === 0) {
      return NextResponse.json({ error: 'At least one product must be selected' }, { status: 400 });
    }

    // Validate that sectionIds is provided and is an array (can be empty for bundles)
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

    const bundle = new Bundle(data);
    await bundle.save();

    return NextResponse.json({ success: true, id: bundle._id });
  } catch (error : any) {
    console.error('Error creating bundle:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}