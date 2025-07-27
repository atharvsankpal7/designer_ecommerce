import connectDB from '@/lib/mongodb';
import { HeroSlide } from '@/lib/models';

export interface CreateHeroSlideData {
  title: string;
  description?: string;
  imageUrl: string;
  altText: string;
  displayOrder: number;
  linkUrl?: string;
  linkText?: string;
  isActive?: boolean;
}

export interface UpdateHeroSlideData extends Partial<CreateHeroSlideData> {
  id: string;
}

// Get all hero slides for admin (including inactive ones)
export async function getAllHeroSlidesAdmin() {
  try {
    await connectDB();
    
    const slides = await HeroSlide.find({})
      .sort({ displayOrder: 1, createdAt: -1 })

    return slides.map(slide => ({
      id: slide._id.toString(),
      title: slide.title,
      description: slide.description,
      imageUrl: slide.imageUrl,
      altText: slide.altText,
      displayOrder: slide.displayOrder,
      linkUrl: slide.linkUrl,
      linkText: slide.linkText,
      isActive: slide.isActive,
      createdAt: slide.createdAt,
      updatedAt: slide.updatedAt,
    }));
  } catch (error) {
    console.error('Error fetching hero slides for admin:', error);
    throw new Error('Failed to fetch hero slides');
  }
}

// Create new hero slide
export async function createHeroSlide(data: CreateHeroSlideData) {
  try {
    await connectDB();
    
    const heroSlide = new HeroSlide({
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl,
      altText: data.altText,
      displayOrder: data.displayOrder,
      linkUrl: data.linkUrl,
      linkText: data.linkText,
      isActive: data.isActive ?? true,
    });

    const savedSlide = await heroSlide.save();
    
   
    
    return {
      id: savedSlide._id.toString(),
      title: savedSlide.title,
      description: savedSlide.description,
      imageUrl: savedSlide.imageUrl,
      altText: savedSlide.altText,
      displayOrder: savedSlide.displayOrder,
      linkUrl: savedSlide.linkUrl,
      linkText: savedSlide.linkText,
      isActive: savedSlide.isActive,
      createdAt: savedSlide.createdAt,
      updatedAt: savedSlide.updatedAt,
    };
  } catch (error) {
    console.error('Error creating hero slide:', error);
    throw new Error('Failed to create hero slide');
  }
}

// Update hero slide
export async function updateHeroSlide(data: UpdateHeroSlideData) {
  try {
    await connectDB();
    
    const { id, ...updateData } = data;
    
    const updatedSlide = await HeroSlide.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    // ).lean();
    )

    if (!updatedSlide) {
      throw new Error('Hero slide not found');
    }
    
    
    
    return {
      id: updatedSlide._id.toString(),
      title: updatedSlide.title,
      description: updatedSlide.description,
      imageUrl: updatedSlide.imageUrl,
      altText: updatedSlide.altText,
      displayOrder: updatedSlide.displayOrder,
      linkUrl: updatedSlide.linkUrl,
      linkText: updatedSlide.linkText,
      isActive: updatedSlide.isActive,
      createdAt: updatedSlide.createdAt,
      updatedAt: updatedSlide.updatedAt,
    };
  } catch (error) {
    console.error('Error updating hero slide:', error);
    throw new Error('Failed to update hero slide');
  }
}

// Delete hero slide
export async function deleteHeroSlide(id: string) {
  try {
    await connectDB();
    
    const deletedSlide = await HeroSlide.findByIdAndDelete(id);
    
    if (!deletedSlide) {
      throw new Error('Hero slide not found');
    }
    
    
    return { success: true, message: 'Hero slide deleted successfully' };
  } catch (error) {
    console.error('Error deleting hero slide:', error);
    throw new Error('Failed to delete hero slide');
  }
}

// Toggle hero slide active status
export async function toggleHeroSlideStatus(id: string) {
  try {
    await connectDB();
    
    const slide = await HeroSlide.findById(id);
    if (!slide) {
      throw new Error('Hero slide not found');
    }
    
    slide.isActive = !slide.isActive;
    await slide.save();
    
 
    
    return {
      id: slide._id.toString(),
      isActive: slide.isActive,
    };
  } catch (error) {
    console.error('Error toggling hero slide status:', error);
    throw new Error('Failed to toggle hero slide status');
  }
}

// Reorder hero slides
export async function reorderHeroSlides(slideIds: string[]) {
  try {
    await connectDB();
    
    // Update display order for each slide
    const updatePromises = slideIds.map((slideId, index) =>
      HeroSlide.findByIdAndUpdate(slideId, { displayOrder: index })
    );
    
    await Promise.all(updatePromises);
    
 
    
    return { success: true, message: 'Hero slides reordered successfully' };
  } catch (error) {
    console.error('Error reordering hero slides:', error);
    throw new Error('Failed to reorder hero slides');
  }
}