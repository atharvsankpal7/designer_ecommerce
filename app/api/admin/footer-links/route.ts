import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import FooterLinks from '@/models/FooterLinks';

export async function GET() {
  try {
    await connectDB();
    
    const footerLinks = await FooterLinks.find().sort({ category: 1, order: 1 });
    
    return NextResponse.json(footerLinks);
  } catch (error) {
    console.error('Error fetching footer links:', error);
    return NextResponse.json(
      { error: 'Failed to fetch footer links' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const data = await request.json();
    
    // Get the highest order number within the category and increment
    const lastItem = await FooterLinks.findOne({ category: data.category }).sort({ order: -1 });
    data.order = lastItem ? lastItem.order + 1 : 0;
    
    const footerLink = await FooterLinks.create(data);
    
    return NextResponse.json(footerLink, { status: 201 });
  } catch (error) {
    console.error('Error creating footer link:', error);
    return NextResponse.json(
      { error: 'Failed to create footer link' },
      { status: 500 }
    );
  }
}