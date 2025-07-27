import { NextRequest, NextResponse } from 'next/server';
import { reorderHeroSlides } from '@/lib/admin/hero-slide-actions';

// POST - Reorder hero slides
export async function POST(request: NextRequest) {
  try {
    const { slideIds } = await request.json();
    
    if (!Array.isArray(slideIds)) {
      return NextResponse.json(
        { error: 'slideIds must be an array' },
        { status: 400 }
      );
    }

    const result = await reorderHeroSlides(slideIds);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error reordering hero slides:', error);
    return NextResponse.json(
      { error: 'Failed to reorder hero slides' },
      { status: 500 }
    );
  }
}