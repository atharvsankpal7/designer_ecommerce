import { NextRequest, NextResponse } from 'next/server';
import { getAllHeroSlidesAdmin, createHeroSlide } from '@/lib/admin/hero-slide-actions';

// GET - Fetch all hero slides for admin
export async function GET() {
  try {
    const slides = await getAllHeroSlidesAdmin();
    return NextResponse.json({ slides });
  } catch (error) {
    console.error('Error fetching hero slides:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hero slides' },
      { status: 500 }
    );
  }
}

// POST - Create new hero slide
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { title, imageUrl, altText, displayOrder } = body;
    if (!title || !imageUrl || !altText || displayOrder === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: title, imageUrl, altText, displayOrder' },
        { status: 400 }
      );
    }

    const slide = await createHeroSlide(body);
    return NextResponse.json({ slide }, { status: 201 });
  } catch (error) {
    console.error('Error creating hero slide:', error);
    return NextResponse.json(
      { error: 'Failed to create hero slide' },
      { status: 500 }
    );
  }
}