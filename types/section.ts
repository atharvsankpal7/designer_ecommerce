// Client-safe section types (no mongoose dependencies)

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

export interface SectionWithChildren {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  level: number;
  displayOrder: number;
  showInNavbar: boolean;
  showInHomepage: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  children?: SectionWithChildren[];
}