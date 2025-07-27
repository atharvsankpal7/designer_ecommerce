import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import SocialMedia from '@/models/SocialMedia';

export async function GET() {
  try {
    await connectDB();
    
    const socialMedia = await SocialMedia.find({ isActive: true }).sort({ order: 1 });
    
    return NextResponse.json(socialMedia);
  } catch (error) {
    console.error('Error fetching social media:', error);
    return NextResponse.json(
      { error: 'Failed to fetch social media' },
      { status: 500 }
    );
  }
}