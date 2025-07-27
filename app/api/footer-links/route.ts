import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import FooterLinks from '@/models/FooterLinks';

export async function GET() {
  try {
    await connectDB();
    
    const footerLinks = await FooterLinks.find({ isActive: true }).sort({ category: 1, order: 1 });
    
    return NextResponse.json(footerLinks);
  } catch (error) {
    console.error('Error fetching footer links:', error);
    return NextResponse.json(
      { error: 'Failed to fetch footer links' },
      { status: 500 }
    );
  }
}