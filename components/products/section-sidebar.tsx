'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Folder, FolderOpen, Filter, X } from 'lucide-react';
import { SectionHierarchy } from '@/types/section';

interface SectionSidebarProps {
  currentSection: SectionHierarchy;
}

export function SectionSidebar({ currentSection }: SectionSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sections, setSections] = useState<SectionHierarchy[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchSections();
    
    // Initialize price range from URL
    const urlPriceRange = searchParams.get('priceRange');
    if (urlPriceRange) {
      const [min, max] = urlPriceRange.split('-').map(Number);
      setPriceRange([min, max || 10000]);
    }
  }, [searchParams]);

  const fetchSections = async () => {
    try {
      const response = await fetch('/api/sections?type=hierarchy&activeOnly=true');
      const data = await response.json();
      setSections(data);
      
      // Auto-expand current section's parent hierarchy
      expandCurrentSectionHierarchy(data, currentSection.id);
    } catch (error : any) {
      console.error('Error fetching sections:', error);
    }
  };

  const expandCurrentSectionHierarchy = (sectionTree: SectionHierarchy[], targetId: string) => {
    const newExpanded = new Set<string>();
    
    const findAndExpand = (sections: SectionHierarchy[], parentId?: string): boolean => {
      for (const section of sections) {
        if (section.id === targetId) {
          if (parentId) newExpanded.add(parentId);
          return true;
        }
        
        if (section.children && findAndExpand(section.children, section.id)) {
          newExpanded.add(section.id);
          if (parentId) newExpanded.add(parentId);
          return true;
        }
      }
      return false;
    };
    
    findAndExpand(sectionTree);
    setExpandedSections(newExpanded);
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

  const buildSectionUrl = (section: SectionHierarchy, parentSlugs: string[] = []): string => {
    const allSlugs = [...parentSlugs, section.slug];
    return `/products/${allSlugs.join('/')}`;
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

  const renderSectionTree = (sections: SectionHierarchy[] | undefined, parentSlugs: string[] = [], level = 0) => {
    if(!sections){
      return null
    }
    return sections.map((section) => {
      const isCurrentSection = section.id === currentSection.id;
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
            
            <Link
              href={buildSectionUrl(section, parentSlugs)}
              className={`flex-1 text-sm py-1 px-2 rounded transition-colors ${
                isCurrentSection
                  ? 'bg-purple-100 text-purple-800 font-medium'
                  : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
              }`}
            >
              {section.name}
            </Link>
          </div>
          
          {hasChildren && isExpanded && (
            <div className="ml-4 border-l border-gray-200 pl-2">
              {renderSectionTree(section.children, [...parentSlugs, section.slug], level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  const currentPriceRange = searchParams.get('priceRange');

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

      {/* Price Range Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            Price Range
            {currentPriceRange && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearPriceFilter}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="px-2">
            <Slider
              value={priceRange}
              // onValueChange={setPriceRange}
              max={10000}
              min={0}
              step={100}
              className="w-full"
            />
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>₹{priceRange[0]}</span>
            <span>{priceRange[1] >= 10000 ? '₹10000+' : `₹${priceRange[1]}`}</span>
          </div>
          
          <Button 
            onClick={applyPriceFilter}
            className="w-full"
            size="sm"
          >
            Apply Filter
          </Button>
          
          {currentPriceRange && (
            <Badge variant="secondary" className="w-full justify-center">
              Active: ₹{currentPriceRange.replace('-', ' - ₹')}
            </Badge>
          )}
        </CardContent>
      </Card>
    </div>
  );
}