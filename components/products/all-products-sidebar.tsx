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
import { SectionHierarchy, buildSectionHierarchy } from '@/lib/section-utils';

export function AllProductsSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sections, setSections] = useState<SectionHierarchy[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [selectedSection, setSelectedSection] = useState<string>('');

  useEffect(() => {
    fetchSections();
    
    // Initialize filters from URL
    const urlPriceRange = searchParams.get('priceRange');
    if (urlPriceRange) {
      const [min, max] = urlPriceRange.split('-').map(Number);
      setPriceRange([min, max || 10000]);
    }
    
    const urlSection = searchParams.get('section');
    if (urlSection) {
      setSelectedSection(urlSection);
    }
  }, [searchParams]);

  const fetchSections = async () => {
    try {
      const response = await fetch('/api/sections?type=hierarchy&activeOnly=true');
      const data = await response.json();
      setSections(data);
    } catch (error) {
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
    
    if (selectedSection === sectionId) {
      // Remove filter if already selected
      params.delete('section');
      setSelectedSection('');
    } else {
      // Apply new filter
      params.set('section', sectionId);
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

  const renderSectionTree = (sections: SectionHierarchy[], level = 0) => {
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
              {renderSectionTree(section.children, level + 1)}
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
      {/* Active Filters */}
      {hasActiveFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              Active Filters
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-6 text-xs"
              >
                Clear All
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {selectedSection && (
              <Badge variant="secondary" className="mr-2">
                Section Filter
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSectionFilter(selectedSection)}
                  className="h-4 w-4 p-0 ml-1"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {currentPriceRange && (
              <Badge variant="secondary">
                Price: ₹{currentPriceRange.replace('-', ' - ₹')}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearPriceFilter}
                  className="h-4 w-4 p-0 ml-1"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
          </CardContent>
        </Card>
      )}

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
              onValueChange={setPriceRange}
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