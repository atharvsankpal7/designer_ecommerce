import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Section from '@/models/Section';
import { buildSectionHierarchy, generateSlug, validateSectionHierarchy } from '@/lib/section-utils';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const activeOnly = searchParams.get('activeOnly') === 'true';
    
    if (type === 'hierarchy') {
      const hierarchy = await buildSectionHierarchy(activeOnly);
      return NextResponse.json(hierarchy);
    }
    
    if (type === 'flat') {
      const query = activeOnly ? { isActive: true } : {};
      const sections = await Section.find(query)
        .populate('parentId', 'name slug')
        .sort({ level: 1, displayOrder: 1 });

      const transformedSections = sections.map(section => ({
        id: section._id.toString(),
        name: section.name,
        slug: section.slug,
        description: section.description,
        parentId: section.parentId?.toString() || null,
        parentName: section.parentId?.name || null,
        level: section.level,
        displayOrder: section.displayOrder,
        showInNavbar: section.showInNavbar,
        showInHomepage: section.showInHomepage,
        isActive: section.isActive,
        createdAt: section.createdAt,
        updatedAt: section.updatedAt,
      }));

      return NextResponse.json(transformedSections);
    }
    
    // Default: return hierarchy
    const hierarchy = await buildSectionHierarchy(activeOnly);
    return NextResponse.json(hierarchy);
  } catch (error : any) {
    console.error('Error fetching sections:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const data = await request.json();
    
    // Generate slug if not provided
    if (!data.slug) {
      data.slug = generateSlug(data.name);
    }
    
    // Validate hierarchy
    if (data.parentId) {
      const isValid = await validateSectionHierarchy('', data.parentId);
      if (!isValid) {
        return NextResponse.json({ error: 'Invalid section hierarchy' }, { status: 400 });
      }
      
      // Set level based on parent
      const parent = await Section.findById(data.parentId);
      if (parent) {
        data.level = parent.level + 1;
      }
    } else {
      data.level = 0;
    }
    
    // Check for duplicate slug
    const existingSection = await Section.findOne({ slug: data.slug });
    if (existingSection) {
      data.slug = `${data.slug}-${Date.now()}`;
    }
    
    const section = new Section(data);
    await section.save();

    return NextResponse.json({ 
      success: true, 
      id: section._id,
      section: {
        id: section._id.toString(),
        name: section.name,
        slug: section.slug,
        level: section.level,
        parentId: section.parentId?.toString() || null,
        displayOrder: section.displayOrder,
        showInNavbar: section.showInNavbar,
        showInHomepage: section.showInHomepage,
        isActive: section.isActive,
      }
    });
  } catch (error : any) {
    console.error('Error creating section:', error);
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Section name already exists in this category' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}