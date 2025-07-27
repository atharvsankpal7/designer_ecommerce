import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import SocialMedia from '@/models/SocialMedia';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const data = await request.json();
    
    const socialMedia = await SocialMedia.findByIdAndUpdate(
      params.id,
      data,
      { new: true, runValidators: true }
    );
    
    if (!socialMedia) {
      return NextResponse.json(
        { error: 'Social media not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(socialMedia);
  } catch (error) {
    console.error('Error updating social media:', error);
    return NextResponse.json(
      { error: 'Failed to update social media' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const socialMedia = await SocialMedia.findByIdAndDelete(params.id);
    
    if (!socialMedia) {
      return NextResponse.json(
        { error: 'Social media not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Social media deleted successfully' });
  } catch (error) {
    console.error('Error deleting social media:', error);
    return NextResponse.json(
      { error: 'Failed to delete social media' },
      { status: 500 }
    );
  }
}