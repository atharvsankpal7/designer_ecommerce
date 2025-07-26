'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { SectionHierarchy } from '@/lib/section-utils';

export function NavigationMenu() {
  const [sections, setSections] = useState<SectionHierarchy[]>([]);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

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

  const renderSubMenu = (children: SectionHierarchy[], parentSlugs: string[] = [], level = 1) => {
    if (!children || children.length === 0) return null;

    return (
      <div className={`absolute ${level === 1 ? 'top-full left-0' : 'top-0 left-full'} 
                      min-w-[200px] bg-white/95 backdrop-blur-md shadow-xl border border-purple-100 
                      rounded-lg py-2 z-50 opacity-0 invisible group-hover:opacity-100 
                      group-hover:visible transition-all duration-300 transform 
                      ${level === 1 ? 'translate-y-2 group-hover:translate-y-0' : 'translate-x-2 group-hover:translate-x-0'}`}>
        {children.map((child) => (
          <div key={child.id} className="relative group/sub">
            <Link
              href={buildSectionUrl(child, parentSlugs)}
              className="flex items-center justify-between px-4 py-2 text-gray-700 hover:text-purple-600 
                         hover:bg-purple-50 transition-all duration-200 group/item"
            >
              <span className="font-medium">{child.name}</span>
              {child.children && child.children.length > 0 && (
                <ChevronDown className="h-4 w-4 -rotate-90 text-gray-400 group-hover/item:text-purple-600 transition-colors" />
              )}
            </Link>
            
            {child.children && child.children.length > 0 && (
              renderSubMenu(child.children, [...parentSlugs, child.slug], level + 1)
            )}
          </div>
        ))}
      </div>
    );
  };

  if (sections.length === 0) {
    return (
      <Link 
        href="/products" 
        className="relative text-gray-700 hover:text-purple-600 transition-colors duration-300 font-medium group py-2"
      >
        Products
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></span>
      </Link>
    );
  }

  return (
    <div className="flex items-center space-x-8">
      <Link 
        href="/products" 
        className="relative text-gray-700 hover:text-purple-600 transition-colors duration-300 font-medium group py-2"
      >
        Products
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></span>
      </Link>
      
      {sections.map((section) => (
        <div key={section.id} className="relative group">
          <Link
            href={buildSectionUrl(section)}
            className="flex items-center space-x-1 text-gray-700 hover:text-purple-600 
                       transition-colors duration-300 font-medium group py-2"
            onMouseEnter={() => setHoveredSection(section.id)}
            onMouseLeave={() => setHoveredSection(null)}
          >
            <span>{section.name}</span>
            {section.children && section.children.length > 0 && (
              <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-purple-600 transition-all duration-300 group-hover:rotate-180" />
            )}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
          
          {section.children && section.children.length > 0 && (
            renderSubMenu(section.children, [section.slug])
          )}
        </div>
      ))}
    </div>
  );
}