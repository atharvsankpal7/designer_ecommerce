import { NextRequest, NextResponse } from 'next/server';
import { updateHeroSlide, deleteHeroSlide, toggleHeroSlideStatus } from '@/lib/admin/hero-slide-actions';

// PUT - Update hero slide
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const slide = await updateHeroSlide({ id: params.id, ...body });
    return NextResponse.json({ slide });
  } catch (error) {
    console.error('Error updating hero slide:', error);
    return NextResponse.json(
      { error: 'Failed to update hero slide' },
      { status: 500 }
    );
  }
}

// DELETE - Delete hero slide
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await deleteHeroSlide(params.id);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error deleting hero slide:', error);
    return NextResponse.json(
      { error: 'Failed to delete hero slide' },
      { status: 500 }
    );
  }
}

// PATCH - Toggle hero slide status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await toggleHeroSlideStatus(params.id);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error toggling hero slide status:', error);
    return NextResponse.json(
      { error: 'Failed to toggle hero slide status' },
      { status: 500 }
    );
  }
}