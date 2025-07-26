'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { SectionHierarchy } from '@/types/section';

interface SSRMobileNavigationProps {
  sections: SectionHierarchy[];
  onLinkClick: () => void;
}

export function SSRMobileNavigation({ sections, onLinkClick }: SSRMobileNavigationProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const buildSectionUrl = (section: SectionHierarchy): string => {
    return `/products?section=${encodeURIComponent(section.name)}`;
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

  const renderMobileSection = (section: SectionHierarchy, level = 0) => {
    const hasChildren = section.children && section.children.length > 0;
    const isExpanded = expandedSections.has(section.id);
    const paddingLeft = level * 16;

    return (
      <div key={section.id}>
        <div className="flex items-center">
          <Link
            href={buildSectionUrl(section)}
            className="flex-1 text-gray-700 hover:text-purple-600 transition-colors 
                       duration-300 font-medium py-3 px-4 rounded-lg hover:bg-purple-50"
            style={{ paddingLeft: `${paddingLeft + 16}px` }}
            onClick={onLinkClick}
          >
            {section.name}
          </Link>
          
          {hasChildren && (
            <button
              onClick={() => toggleExpanded(section.id)}
              className="p-2 text-gray-400 hover:text-purple-600 transition-colors 
                         rounded-lg hover:bg-purple-50"
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
          <div className="ml-4 border-l-2 border-purple-100">
            {section.children!.map((child) =>
              renderMobileSection(child, level + 1)
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
    <div className="border-t border-gray-200 pt-4 mt-4">
      <div className="text-sm font-semibold text-gray-500 px-4 mb-3 uppercase tracking-wide">
        Categories
      </div>
      <div className="space-y-1">
        {sections.map((section) => renderMobileSection(section))}
      </div>
    </div>
  );
}