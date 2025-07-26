import connectDB from './mongodb';
import Section from '@/models/Section';
import { ISection } from '@/models/Section';

export interface SectionWithChildren extends ISection {
  children?: SectionWithChildren[];
}

export interface SectionHierarchy {
  id: string;
  name: string;
  slug: string;
  level: number;
  displayOrder: number;
  showInNavbar: boolean;
  showInHomepage: boolean;
  isActive: boolean;
  children?: SectionHierarchy[];
}

// Generate slug from name
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Build hierarchical section tree
export async function buildSectionHierarchy(activeOnly = false): Promise<SectionHierarchy[]> {
  await connectDB();
  
  const query = activeOnly ? { isActive: true } : {};
  const sections = await Section.find(query).sort({ level: 1, displayOrder: 1 });
  
  const sectionMap = new Map<string, SectionHierarchy>();
  const rootSections: SectionHierarchy[] = [];
  
  // Convert to hierarchy format and create map
  sections.forEach(section => {
    const hierarchySection: SectionHierarchy = {
      id: section._id.toString(),
      name: section.name,
      slug: section.slug,
      level: section.level,
      displayOrder: section.displayOrder,
      showInNavbar: section.showInNavbar,
      showInHomepage: section.showInHomepage,
      isActive: section.isActive,
      children: []
    };
    
    sectionMap.set(section._id.toString(), hierarchySection);
    
    if (section.level === 0) {
      rootSections.push(hierarchySection);
    }
  });
  
  // Build parent-child relationships
  sections.forEach(section => {
    if (section.parentId) {
      const parent = sectionMap.get(section.parentId.toString());
      const child = sectionMap.get(section._id.toString());
      
      if (parent && child) {
        parent.children!.push(child);
      }
    }
  });
  
  return rootSections;
}

// Get navigation sections (only those marked for navbar)
export async function getNavigationSections(): Promise<SectionHierarchy[]> {
  await connectDB();
  
  const sections = await Section.find({ 
    isActive: true, 
    showInNavbar: true 
  }).sort({ level: 1, displayOrder: 1 });
  
  const sectionMap = new Map<string, SectionHierarchy>();
  const rootSections: SectionHierarchy[] = [];
  
  sections.forEach(section => {
    const hierarchySection: SectionHierarchy = {
      id: section._id.toString(),
      name: section.name,
      slug: section.slug,
      level: section.level,
      displayOrder: section.displayOrder,
      showInNavbar: section.showInNavbar,
      showInHomepage: section.showInHomepage,
      isActive: section.isActive,
      children: []
    };
    
    sectionMap.set(section._id.toString(), hierarchySection);
    
    if (section.level === 0) {
      rootSections.push(hierarchySection);
    }
  });
  
  // Build parent-child relationships for navbar sections
  sections.forEach(section => {
    if (section.parentId) {
      const parent = sectionMap.get(section.parentId.toString());
      const child = sectionMap.get(section._id.toString());
      
      if (parent && child) {
        parent.children!.push(child);
      }
    }
  });
  
  return rootSections;
}

// Get homepage sections (only those marked for homepage)
export async function getHomepageSections(): Promise<SectionHierarchy[]> {
  await connectDB();
  
  const sections = await Section.find({ 
    isActive: true, 
    showInHomepage: true 
  }).sort({ displayOrder: 1 });
  
  return sections.map(section => ({
    id: section._id.toString(),
    name: section.name,
    slug: section.slug,
    level: section.level,
    displayOrder: section.displayOrder,
    showInNavbar: section.showInNavbar,
    showInHomepage: section.showInHomepage,
    isActive: section.isActive
  }));
}

// Get section breadcrumb path
export async function getSectionBreadcrumb(sectionId: string): Promise<SectionHierarchy[]> {
  await connectDB();
  
  const breadcrumb: SectionHierarchy[] = [];
  let currentSectionId = sectionId;
  
  while (currentSectionId) {
    const section = await Section.findById(currentSectionId);
    if (!section) break;
    
    breadcrumb.unshift({
      id: section._id.toString(),
      name: section.name,
      slug: section.slug,
      level: section.level,
      displayOrder: section.displayOrder,
      showInNavbar: section.showInNavbar,
      showInHomepage: section.showInHomepage,
      isActive: section.isActive
    });
    
    currentSectionId = section.parentId?.toString() || '';
  }
  
  return breadcrumb;
}

// Get section by slug path (e.g., "main-category/subcategory/sub-subcategory")
export async function getSectionBySlugPath(slugPath: string): Promise<SectionHierarchy | null> {
  await connectDB();
  
  const slugs = slugPath.split('/').filter(Boolean);
  if (slugs.length === 0) return null;
  
  let currentParentId = null;
  let section = null;
  
  for (let i = 0; i < slugs.length; i++) {
    const query: any = { slug: slugs[i], isActive: true };
    if (currentParentId) {
      query.parentId = currentParentId;
    } else {
      query.level = 0;
    }
    
    section = await Section.findOne(query);
    if (!section) return null;
    
    currentParentId = section._id;
  }
  
  if (!section) return null;
  
  return {
    id: section._id.toString(),
    name: section.name,
    slug: section.slug,
    level: section.level,
    displayOrder: section.displayOrder,
    showInNavbar: section.showInNavbar,
    showInHomepage: section.showInHomepage,
    isActive: section.isActive
  };
}

// Build URL path from section hierarchy
export function buildSectionPath(breadcrumb: SectionHierarchy[]): string {
  return breadcrumb.map(section => section.slug).join('/');
}

// Validate section hierarchy (prevent circular references, max depth)
export async function validateSectionHierarchy(sectionId: string, parentId?: string): Promise<boolean> {
  if (!parentId) return true;
  
  await connectDB();
  
  // Check if parent exists and get its level
  const parent = await Section.findById(parentId);
  if (!parent || parent.level >= 2) return false; // Max 3 levels (0, 1, 2)
  
  // Check for circular reference
  let currentParentId = parentId;
  while (currentParentId) {
    if (currentParentId === sectionId) return false;
    
    const currentParent = await Section.findById(currentParentId);
    if (!currentParent) break;
    
    currentParentId = currentParent.parentId?.toString();
  }
  
  return true;
}