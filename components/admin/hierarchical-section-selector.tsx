'use client';

import { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronDown, 
  ChevronRight, 
  Folder, 
  FolderOpen, 
  Info,
  X
} from 'lucide-react';
import { SectionHierarchy } from '@/types/section';
import { toast } from 'sonner';

interface HierarchicalSectionSelectorProps {
  selectedSectionIds: string[];
  onSelectionChange: (sectionIds: string[]) => void;
  className?: string;
}

export function HierarchicalSectionSelector({
  selectedSectionIds,
  onSelectionChange,
  className = ''
}: HierarchicalSectionSelectorProps) {
  const [sections, setSections] = useState<SectionHierarchy[]>([]);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/sections?type=hierarchy&activeOnly=true');
      const data = await response.json();
      setSections(data);
      
      // Auto-expand sections that have selected children
      autoExpandSelectedSections(data, selectedSectionIds);
    } catch (error : any) {
      console.error('Error fetching sections:', error);
      toast.error('Failed to load sections');
    } finally {
      setLoading(false);
    }
  };

  const autoExpandSelectedSections = (sectionTree: SectionHierarchy[], selectedIds: string[]) => {
    const newExpanded = new Set<string>();
    
    const findAndExpand = (sections: SectionHierarchy[]): boolean => {
      let hasSelectedChild = false;
      
      for (const section of sections) {
        if (selectedIds.includes(section.id)) {
          hasSelectedChild = true;
        }
        
        if (section.children && findAndExpand(section.children)) {
          newExpanded.add(section.id);
          hasSelectedChild = true;
        }
      }
      
      return hasSelectedChild;
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

  // Get all parent sections for a given section
  const getParentSections = (sectionId: string, allSections: SectionHierarchy[]): string[] => {
    const parents: string[] = [];
    
    const findParents = (sections: SectionHierarchy[], targetId: string, currentParents: string[] = []): boolean => {
      for (const section of sections) {
        if (section.id === targetId) {
          parents.push(...currentParents);
          return true;
        }
        
        if (section.children && findParents(section.children, targetId, [...currentParents, section.id])) {
          return true;
        }
      }
      return false;
    };
    
    findParents(allSections, sectionId);
    return parents;
  };

  // Get all child sections for a given section
  const getChildSections = (section: SectionHierarchy): string[] => {
    const children: string[] = [];
    
    const collectChildren = (currentSection: SectionHierarchy) => {
      if (currentSection.children) {
        for (const child of currentSection.children) {
          children.push(child.id);
          collectChildren(child);
        }
      }
    };
    
    collectChildren(section);
    return children;
  };

  const handleSectionToggle = (section: SectionHierarchy, isChecked: boolean) => {
    let newSelectedIds = [...selectedSectionIds];
    
    if (isChecked) {
      // Add the section
      if (!newSelectedIds.includes(section.id)) {
        newSelectedIds.push(section.id);
      }
      
      // Auto-add all parent sections
      const parents = getParentSections(section.id, sections);
      for (const parentId of parents) {
        if (!newSelectedIds.includes(parentId)) {
          newSelectedIds.push(parentId);
        }
      }
      
      // Auto-add all child sections
      const children = getChildSections(section);
      for (const childId of children) {
        if (!newSelectedIds.includes(childId)) {
          newSelectedIds.push(childId);
        }
      }
    } else {
      // Remove the section
      newSelectedIds = newSelectedIds.filter(id => id !== section.id);
      
      // Remove all child sections
      const children = getChildSections(section);
      newSelectedIds = newSelectedIds.filter(id => !children.includes(id));
    }
    
    onSelectionChange(newSelectedIds);
  };

  const getSectionByIdFromTree = (sections: SectionHierarchy[], targetId: string): SectionHierarchy | null => {
    for (const section of sections) {
      if (section.id === targetId) {
        return section;
      }
      if (section.children) {
        const found = getSectionByIdFromTree(section.children, targetId);
        if (found) return found;
      }
    }
    return null;
  };

  const getSelectedSectionNames = (): { id: string; name: string; level: number }[] => {
    return selectedSectionIds
      .map(id => {
        const section = getSectionByIdFromTree(sections, id);
        return section ? { id, name: section.name, level: section.level } : null;
      })
      .filter(Boolean)
      .sort((a, b) => a!.level - b!.level) as { id: string; name: string; level: number }[];
  };

  const removeSection = (sectionId: string) => {
    const section = getSectionByIdFromTree(sections, sectionId);
    if (section) {
      handleSectionToggle(section, false);
    }
  };

  const clearAllSelections = () => {
    onSelectionChange([]);
  };

  const renderSectionTree = (sections: SectionHierarchy[] | undefined, level = 0) => {
    if(!sections){
      return null
    }
    return sections.map((section) => {
      const isSelected = selectedSectionIds.includes(section.id);
      const hasChildren = section.children && section.children.length > 0;
      const isExpanded = expandedSections.has(section.id);
      const indentLevel = level * 16;
      
      return (
        <div key={section.id}>
          <div 
            className={`flex items-center space-x-2 py-2 px-2 rounded hover:bg-gray-50 ${
              isSelected ? 'bg-blue-50 border-l-2 border-blue-500' : ''
            }`}
            style={{ paddingLeft: `${indentLevel + 8}px` }}
          >
            {hasChildren && (
              <button
                onClick={() => toggleExpanded(section.id)}
                className="p-1 hover:bg-gray-200 rounded"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                )}
              </button>
            )}
            
            {!hasChildren && <div className="w-6" />}
            
            <div className="flex items-center space-x-2">
              {level === 0 ? (
                <Folder className="h-4 w-4 text-blue-600" />
              ) : level === 1 ? (
                <FolderOpen className="h-4 w-4 text-green-600" />
              ) : (
                <div className="h-4 w-4 rounded bg-purple-600" />
              )}
            </div>
            
            <Checkbox
              id={section.id}
              checked={isSelected}
              onCheckedChange={(checked) => handleSectionToggle(section, checked as boolean)}
            />
            
            <label
              htmlFor={section.id}
              className={`flex-1 text-sm cursor-pointer ${
                isSelected ? 'font-medium text-blue-700' : 'text-gray-700'
              }`}
            >
              {section.name}
            </label>
            
            <Badge variant="outline" className="text-xs">
              L{section.level}
            </Badge>
          </div>
          
          {hasChildren && isExpanded && (
            <div className="border-l border-gray-200 ml-4">
              {renderSectionTree(section.children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Loading Sections...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const selectedSectionNames = getSelectedSectionNames();

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Selected Sections Display */}
      {selectedSectionNames.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Selected Sections ({selectedSectionNames.length})
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllSelections}
                className="h-6 text-xs"
              >
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {selectedSectionNames.map(({ id, name, level }) => (
                <Badge
                  key={id}
                  variant={level === 0 ? 'default' : level === 1 ? 'secondary' : 'outline'}
                  className="flex items-center gap-1"
                >
                  {name}
                  <button
                    onClick={() => removeSection(id)}
                    className="ml-1 hover:bg-black/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section Tree */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Folder className="h-4 w-4" />
            Select Sections
          </CardTitle>
          <div className="flex items-start gap-2 text-xs text-gray-600 bg-blue-50 p-2 rounded">
            <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium mb-1">Auto-selection behavior:</p>
              <ul className="space-y-1">
                <li>• Selecting a section automatically includes all parent sections</li>
                <li>• Selecting a section automatically includes all child sections</li>
                <li>• Deselecting removes the section and all its children</li>
              </ul>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-1">
              {sections.length > 0 ? (
                renderSectionTree(sections)
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No sections available. Please create sections first.
                </p>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}