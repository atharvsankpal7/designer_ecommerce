import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Section from '@/models/Section';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { sections } = await request.json();
    
    if (!Array.isArray(sections)) {
      return NextResponse.json({ error: 'Invalid sections data' }, { status: 400 });
    }
    
    // Update display order for each section
    const updatePromises = sections.map((section: { id: string; displayOrder: number }) =>
      Section.findByIdAndUpdate(section.id, { displayOrder: section.displayOrder })
    );
    
    await Promise.all(updatePromises);
    
    return NextResponse.json({ success: true });
  } catch (error : any) {
    console.error('Error reordering sections:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}