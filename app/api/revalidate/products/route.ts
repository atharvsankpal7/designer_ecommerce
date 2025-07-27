import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    // Optional: Add authentication/authorization here
    // const authHeader = request.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.REVALIDATION_TOKEN}`) {
    //   return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    // }

    // Revalidate product-related caches
    revalidateTag('products');
    revalidateTag('new-products');
    revalidateTag('featured-products');
    revalidateTag('bundles');

    return NextResponse.json({ 
      message: 'Product caches revalidated successfully',
      revalidated: true,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error revalidating product caches:', error);
    return NextResponse.json(
      { message: 'Error revalidating caches', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}