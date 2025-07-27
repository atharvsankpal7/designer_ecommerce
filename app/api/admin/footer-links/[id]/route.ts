import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import FooterLinks from '@/models/FooterLinks';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const data = await request.json();
    
    const footerLink = await FooterLinks.findByIdAndUpdate(
      params.id,
      data,
      { new: true, runValidators: true }
    );
    
    if (!footerLink) {
      return NextResponse.json(
        { error: 'Footer link not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(footerLink);
  } catch (error) {
    console.error('Error updating footer link:', error);
    return NextResponse.json(
      { error: 'Failed to update footer link' },
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
    
    const footerLink = await FooterLinks.findByIdAndDelete(params.id);
    
    if (!footerLink) {
      return NextResponse.json(
        { error: 'Footer link not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Footer link deleted successfully' });
  } catch (error) {
    console.error('Error deleting footer link:', error);
    return NextResponse.json(
      { error: 'Failed to delete footer link' },
      { status: 500 }
    );
  }
}