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
                       duration-300 font-medium py-2 px-3 rounded-lg hover:bg-purple-50 text-sm"
            style={{ paddingLeft: `${paddingLeft + 16}px` }}
            onClick={onLinkClick}
          >
            {section.name}
          </Link>
          
          {hasChildren && (
            <button
              onClick={() => toggleExpanded(section.id)}
              className="p-1.5 text-gray-400 hover:text-purple-600 transition-colors 
                         rounded-lg hover:bg-purple-50"
            >
              {isExpanded ? (
                <ChevronDown className="h-3.5 w-3.5" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5" />
              )}
            </button>
          )}
        </div>
        
        {hasChildren && isExpanded && (
          <div className="ml-3 border-l-2 border-purple-100">
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
      <div className="space-y-0.5">
        {sections.map((section) => renderMobileSection(section))}
      </div>
    </div>
  );
}