import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import SocialMedia from '@/models/SocialMedia';

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    const { items } = await request.json();
    
    // Update order for each item
    const updatePromises = items.map((item: { id: string; order: number }) =>
      SocialMedia.findByIdAndUpdate(item.id, { order: item.order })
    );
    
    await Promise.all(updatePromises);
    
    // Return updated list
    const socialMedia = await SocialMedia.find().sort({ order: 1 });
    
    return NextResponse.json(socialMedia);
  } catch (error) {
    console.error('Error reordering social media:', error);
    return NextResponse.json(
      { error: 'Failed to reorder social media' },
      { status: 500 }
    );
  }
}