import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Section from '@/models/Section';

export async function GET() {
  try {
    await connectDB();
    
    const sections = await Section.find({ isActive: true }).sort({ name: 1 });

    const transformedSections = sections.map(section => ({
      id: section._id.toString(),
      name: section.name,
      description: section.description,
      isActive: section.isActive,
    }));

    return NextResponse.json(transformedSections);
  } catch (error) {
    console.error('Error fetching sections:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const data = await request.json();
    const section = new Section(data);
    await section.save();

    return NextResponse.json({ success: true, id: section._id });
  } catch (error) {
    console.error('Error creating section:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}