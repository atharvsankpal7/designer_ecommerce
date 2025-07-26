import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Section from '@/models/Section';
import Product from '@/models/Product';
import Bundle from '@/models/Bundle';
import { generateSlug, validateSectionHierarchy } from '@/lib/section-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const section = await Section.findById(params.id).populate('parentId', 'name slug');
    
    if (!section) {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 });
    }

    const transformedSection = {
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
    };

    return NextResponse.json(transformedSection);
  } catch (error : any) {
    console.error('Error fetching section:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const data = await request.json();
    const sectionId = params.id;
    
    // Generate slug if name changed and slug not provided
    if (data.name && !data.slug) {
      data.slug = generateSlug(data.name);
    }
    
    // Validate hierarchy if parent changed
    if (data.parentId !== undefined) {
      const isValid = await validateSectionHierarchy(sectionId, data.parentId);
      if (!isValid) {
        return NextResponse.json({ error: 'Invalid section hierarchy' }, { status: 400 });
      }
      
      // Set level based on parent
      if (data.parentId) {
        const parent = await Section.findById(data.parentId);
        if (parent) {
          data.level = parent.level + 1;
        }
      } else {
        data.level = 0;
      }
    }
    
    // Check for duplicate slug (excluding current section)
    if (data.slug) {
      const existingSection = await Section.findOne({ 
        slug: data.slug, 
        _id: { $ne: sectionId } 
      });
      if (existingSection) {
        data.slug = `${data.slug}-${Date.now()}`;
      }
    }
    
    const section = await Section.findByIdAndUpdate(
      sectionId,
      data,
      { new: true, runValidators: true }
    ).populate('parentId', 'name slug');
    
    if (!section) {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 });
    }

    const transformedSection = {
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
    };

    return NextResponse.json({ 
      success: true, 
      section: transformedSection 
    });
  } catch (error:any) {
    console.error('Error updating section:', error);
    if (error?.code === 11000) {
      return NextResponse.json({ error: 'Section name already exists in this category' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const sectionId = params.id;
    
    // Check if section has children
    const childSections = await Section.find({ parentId: sectionId });
    if (childSections.length > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete section with child sections. Please delete or move child sections first.' 
      }, { status: 400 });
    }
    
    // Check if section is used by products
    const productsCount = await Product.countDocuments({ sectionIds: sectionId });
    if (productsCount > 0) {
      return NextResponse.json({ 
        error: `Cannot delete section. It is used by ${productsCount} product(s).` 
      }, { status: 400 });
    }
    
    // Check if section is used by bundles
    const bundlesCount = await Bundle.countDocuments({ sectionIds: sectionId });
    if (bundlesCount > 0) {
      return NextResponse.json({ 
        error: `Cannot delete section. It is used by ${bundlesCount} bundle(s).` 
      }, { status: 400 });
    }
    
    const section = await Section.findByIdAndDelete(sectionId);
    
    if (!section) {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error : any) {
    console.error('Error deleting section:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}