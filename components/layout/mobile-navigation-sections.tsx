'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { SectionHierarchy } from '@/lib/section-utils';

interface MobileNavigationSectionsProps {
  onLinkClick: () => void;
}

export function MobileNavigationSections({ onLinkClick }: MobileNavigationSectionsProps) {
  const [sections, setSections] = useState<SectionHierarchy[]>([]);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchNavigationSections();
  }, []);

  const fetchNavigationSections = async () => {
    try {
      const response = await fetch('/api/sections/navigation');
      const data = await response.json();
      setSections(data);
    } catch (error) {
      console.error('Error fetching navigation sections:', error);
    }
  };

  const buildSectionUrl = (section: SectionHierarchy, parentSlugs: string[] = []): string => {
    const allSlugs = [...parentSlugs, section.slug];
    return `/products/${allSlugs.join('/')}`;
  };

  const toggleExpanded = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const renderMobileSection = (section: SectionHierarchy, parentSlugs: string[] = [], level = 0) => {
    const hasChildren = section.children && section.children.length > 0;
    const isExpanded = expandedSections.has(section.id);
    const paddingLeft = level * 16;

    return (
      <div key={section.id}>
        <div className="flex items-center">
          <Link
            href={buildSectionUrl(section, parentSlugs)}
            className="flex-1 text-gray-700 hover:text-purple-600 transition-colors duration-300 font-medium py-2 px-4 rounded-lg hover:bg-purple-50"
            style={{ paddingLeft: `${paddingLeft + 16}px` }}
            onClick={onLinkClick}
          >
            {section.name}
          </Link>
          
          {hasChildren && (
            <button
              onClick={() => toggleExpanded(section.id)}
              className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
        
        {hasChildren && isExpanded && (
          <div className="ml-4 border-l-2 border-gray-200">
            {section.children!.map((child) =>
              renderMobileSection(child, [...parentSlugs, section.slug], level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  if (sections.length === 0) {
    return null;
  }

  return (
    <div className="border-t border-gray-200 pt-4">
      <div className="text-sm font-semibold text-gray-500 px-4 mb-2">Categories</div>
      {sections.map((section) => renderMobileSection(section))}
    </div>
  );
}