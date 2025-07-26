import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Section from '@/models/Section';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { sectionId, showInNavbar } = await request.json();
    
    if (!sectionId) {
      return NextResponse.json({ error: 'Section ID is required' }, { status: 400 });
    }

    // Get the section and all its descendants
    const getAllDescendants = async (parentId: string): Promise<string[]> => {
      const children = await Section.find({ parentId, isActive: true });
      const descendants = [parentId];
      
      for (const child of children) {
        const childDescendants = await getAllDescendants(child._id.toString());
        descendants.push(...childDescendants);
      }
      
      return descendants;
    };

    // Get all sections that need to be updated
    const sectionsToUpdate = await getAllDescendants(sectionId);
    
    // Update all sections in the branch
    await Section.updateMany(
      { _id: { $in: sectionsToUpdate } },
      { showInNavbar }
    );

    // If we're enabling navbar display, we also need to ensure parent sections are enabled
    if (showInNavbar) {
      const section = await Section.findById(sectionId);
      if (section && section.parentId) {
        // Recursively enable parent sections
        const enableParents = async (childSectionId: string) => {
          const childSection = await Section.findById(childSectionId);
          if (childSection && childSection.parentId) {
            await Section.findByIdAndUpdate(childSection.parentId, { showInNavbar: true });
            await enableParents(childSection.parentId.toString());
          }
        };
        
        await enableParents(sectionId);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Updated ${sectionsToUpdate.length} sections`,
      updatedSections: sectionsToUpdate.length
    });
  } catch (error : any) {
    console.error('Error updating navbar sections:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}