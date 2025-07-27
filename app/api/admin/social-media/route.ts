import { NextRequest, NextResponse } from 'next/server';
import  connectDB  from '@/lib/mongodb';
import SocialMedia from '@/models/SocialMedia';

export async function GET() {
  try {
    await connectDB();
    
    const socialMedia = await SocialMedia.find().sort({ order: 1 });
    
    return NextResponse.json(socialMedia);
  } catch (error) {
    console.error('Error fetching social media:', error);
    return NextResponse.json(
      { error: 'Failed to fetch social media' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const data = await request.json();
    
    // Get the highest order number and increment
    const lastItem = await SocialMedia.findOne().sort({ order: -1 });
    data.order = lastItem ? lastItem.order + 1 : 0;
    
    const socialMedia = await SocialMedia.create(data);
    
    return NextResponse.json(socialMedia, { status: 201 });
  } catch (error) {
    console.error('Error creating social media:', error);
    return NextResponse.json(
      { error: 'Failed to create social media' },
      { status: 500 }
    );
  }
}