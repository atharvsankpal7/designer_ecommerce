'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Folder, FolderOpen, Filter, X } from 'lucide-react';
import { SectionHierarchy } from '@/types/section';

export function AllProductsSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sections, setSections] = useState<SectionHierarchy[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [selectedSection, setSelectedSection] = useState<string>('');

  const expandAllSections = (sections: SectionHierarchy[]): Set<string> => {
    const expanded = new Set<string>();
    
    const addToExpanded = (sectionList: SectionHierarchy[]) => {
      sectionList.forEach(section => {
        if (section.children && section.children.length > 0) {
          expanded.add(section.id);
          addToExpanded(section.children);
        }
      });
    };
      
    addToExpanded(sections);
    return expanded;
  };

  useEffect(() => {
    fetchSections();
    
    // Initialize filters from URL
    const urlPriceRange = searchParams.get('priceRange');
    if (urlPriceRange) {
      const [min, max] = urlPriceRange.split('-').map(Number);
      setPriceRange([min, max || 10000]);
    }
    
    const urlSectionName = searchParams.get('section');
    if (urlSectionName) {
      // Find section ID by name for internal state
      const findSectionIdByName = (sections: SectionHierarchy[], targetName: string): string | null => {
      for (const section of sections) {
          if (section.name.toLowerCase() === targetName.toLowerCase()) {
            return section.id;
        }
        if (section.children) {
            const found = findSectionIdByName(section.children, targetName);
          if (found) return found;
        }
      }
      return null;
    };
    
      // We'll set this after sections are loaded
      setTimeout(() => {
        const sectionId = findSectionIdByName(sections, urlSectionName);
        if (sectionId) {
          setSelectedSection(sectionId);
        }
      }, 100);
    }
  }, [searchParams]);

  const fetchSections = async () => {
    try {
      const response = await fetch('/api/sections?type=hierarchy&activeOnly=true');
      const data = await response.json();
      setSections(data);
      // Expand all sections by default
      setExpandedSections(expandAllSections(data));
    } catch (error : any) {
      console.error('Error fetching sections:', error);
    }
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

  const handleSectionFilter = (sectionId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Find section name by ID
    const findSectionName = (sections: SectionHierarchy[], targetId: string): string | null => {
      for (const section of sections) {
        if (section.id === targetId) {
          return section.name;
        }
        if (section.children) {
          const found = findSectionName(section.children, targetId);
          if (found) return found;
        }
      }
      return null;
  };

    const sectionName = findSectionName(sections, sectionId);
    
    if (selectedSection === sectionId) {
      // Remove filter if already selected
      params.delete('section');
    setSelectedSection('');
    } else {
      // Apply new filter
      if (sectionName) {
        params.set('section', sectionName);
      }
      setSelectedSection(sectionId);
    }
    
    params.delete('page'); // Reset to first page
    router.push(`?${params.toString()}`);
  };

  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    const priceRangeString = priceRange[1] >= 10000 
      ? `${priceRange[0]}-` 
      : `${priceRange[0]}-${priceRange[1]}`;
    
    params.set('priceRange', priceRangeString);
    params.delete('page'); // Reset to first page
    
    router.push(`?${params.toString()}`);
  };

  const clearPriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('priceRange');
    params.delete('page');
    
    router.push(`?${params.toString()}`);
    setPriceRange([0, 10000]);
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams();
    router.push(`?${params.toString()}`);
    setPriceRange([0, 10000]);
    setSelectedSection('');
  };

  const renderSectionTree = (sections: SectionHierarchy[] | undefined, level = 0) => {
    if(!sections){
      return
    }
    return sections.map((section) => {
      const isSelected = selectedSection === section.id;
      const hasChildren = section.children && section.children.length > 0;
      const isExpanded = expandedSections.has(section.id);
  return (
        <div key={section.id} className={`ml-${level * 3}`}>
          <div className="flex items-center space-x-2 py-1">
            {hasChildren && (
              <button
                onClick={() => toggleExpanded(section.id)}
                className="p-1 hover:bg-gray-100 rounded"
          >
                {isExpanded ? (
                  <FolderOpen className="h-4 w-4 text-blue-600" />
                ) : (
                  <Folder className="h-4 w-4 text-gray-600" />
                )}
              </button>
            )}
            
            <div className="flex items-center space-x-2 flex-1">
              <Checkbox
                id={section.id}
                checked={isSelected}
                onCheckedChange={() => handleSectionFilter(section.id)}
              />
              <label
                htmlFor={section.id}
                className={`text-sm cursor-pointer flex-1 ${
                  isSelected ? 'font-medium text-purple-600' : 'text-gray-700'
                }`}
              >
                {section.name}
              </label>
            </div>
          </div>
          
          {hasChildren && isExpanded && (
            <div className="ml-4 border-l border-gray-200 pl-2">
              {renderSectionTree(section?.children, level + 1)}
            </div>
          )}
        </div>
  );
    });
  };

  const currentPriceRange = searchParams.get('priceRange');
  const hasActiveFilters = selectedSection || currentPriceRange;

  return (
    <div className="space-y-6">
      

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {renderSectionTree(sections)}
          </div>
        </CardContent>
      </Card>

      

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Browse</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Link
            href="/products?sort=featured"
            className="block text-sm text-gray-700 hover:text-purple-600 transition-colors py-1"
          >
            Featured Products
          </Link>
          <Link
            href="/products?sort=newest"
            className="block text-sm text-gray-700 hover:text-purple-600 transition-colors py-1"
          >
            Latest Additions
          </Link>
          <Link
            href="/products?sort=price-low"
            className="block text-sm text-gray-700 hover:text-purple-600 transition-colors py-1"
          >
            Budget Friendly
          </Link>
          <Link
            href="/bundles"
            className="block text-sm text-gray-700 hover:text-purple-600 transition-colors py-1"
          >
            Design Bundles
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}