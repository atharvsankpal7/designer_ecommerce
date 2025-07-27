import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    // Optional: Add authentication/authorization here
    // const authHeader = request.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.REVALIDATION_TOKEN}`) {
    //   return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    // }

    // Revalidate hero slide caches
    revalidateTag('hero-slides');
    revalidateTag('slides');

    return NextResponse.json({ 
      message: 'Hero slide caches revalidated successfully',
      revalidated: true,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error revalidating hero slide caches:', error);
    return NextResponse.json(
      { message: 'Error revalidating caches', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}