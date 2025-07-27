'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Plus, 
  Edit, 
  Trash2, 
  ChevronRight, 
  ChevronDown, 
  GripVertical,
  Eye,
  EyeOff,
  Home,
  Navigation,
  Folder,
  FolderOpen
} from 'lucide-react';
import { toast } from 'sonner';

interface Section {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  parentName?: string;
  level: number;
  displayOrder: number;
  showInNavbar: boolean;
  showInHomepage: boolean;
  isActive: boolean;
  children?: Section[];
}

const TreeViewSkeleton = () => {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, index) => (
        <Card key={index} className="mb-2">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                <Skeleton className="h-6 w-6" />
                <Skeleton className="h-4 w-4" />
                <div>
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-12" />
                  </div>
                  <Skeleton className="h-4 w-48 mt-1" />
                </div>
                  </div>
              <div className="flex space-x-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
                  </div>
                  </CardContent>
                </Card>
              ))}
            </div>
  );
};

const ListViewSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-8" />
              </div>
              <Skeleton className="h-5 w-16" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-4 w-full mb-4" />
            
            <div className="flex flex-wrap gap-2 mb-4">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-16" />
            </div>
            
            <div className="flex space-x-2 mb-3">
              <Skeleton className="h-8 flex-1" />
              <Skeleton className="h-8 flex-1" />
            </div>
            
            <div className="flex space-x-2">
              <Skeleton className="h-8 flex-1" />
              <Skeleton className="h-8 w-8" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default function AdminSections() {
  const [sections, setSections] = useState<Section[]>([]);
  const [flatSections, setFlatSections] = useState<Section[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState('tree');
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parentId: '',
    displayOrder: 0,
    showInNavbar: false,
    showInHomepage: false,
    isActive: true,
  });

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      setIsLoading(true);
      const [hierarchyResponse, flatResponse] = await Promise.all([
        fetch('/api/sections?type=hierarchy'),
        fetch('/api/sections?type=flat')
      ]);
      
      const hierarchyData = await hierarchyResponse.json();
      const flatData = await flatResponse.json();
      
      setSections(hierarchyData);
      setFlatSections(flatData);
    } catch (error : any) {
      console.error('Error fetching sections:', error);
      toast.error('Failed to fetch sections');
    } finally {
      setIsLoading(false);
}  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingSection ? `/api/sections/${editingSection.id}` : '/api/sections';
      const method = editingSection ? 'PUT' : 'POST';

      const submitData = {
        ...formData,
        parentId: formData.parentId || null,
        displayOrder: Number(formData.displayOrder),
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(editingSection ? 'Section updated' : 'Section created');
        setIsModalOpen(false);
        resetForm();
        fetchSections();
      } else {
        toast.error(result.error || 'Failed to save section');
      }
    } catch (error : any) {
      toast.error('Something went wrong');
    }
  };

  const handleNavbarToggle = async (sectionId: string, currentValue: boolean) => {
    try {
      const response = await fetch('/api/sections/navbar-toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionId,
          showInNavbar: !currentValue
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(
          !currentValue 
            ? `Enabled navbar for section and ${result.updatedSections - 1} children`
            : `Disabled navbar for section and ${result.updatedSections - 1} children`
        );
        fetchSections();
      } else {
        toast.error(result.error || 'Failed to update navbar settings');
      }
    } catch (error : any) {
      toast.error('Something went wrong');
    }
  };

  const handleHomepageToggle = async (sectionId: string, currentValue: boolean) => {
    try {
      const response = await fetch(`/api/sections/${sectionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          showInHomepage: !currentValue
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(
          !currentValue 
            ? 'Section enabled for homepage'
            : 'Section disabled for homepage'
        );
        fetchSections();
      } else {
        toast.error(result.error || 'Failed to update homepage settings');
      }
    } catch (error : any) {
      toast.error('Something went wrong');
    }
  };

  const handleEdit = (section: Section) => {
    setEditingSection(section);
    setFormData({
      name: section.name,
      description: section.description || '',
      parentId: section.parentId || '',
      displayOrder: section.displayOrder,
      showInNavbar: section.showInNavbar,
      showInHomepage: section.showInHomepage,
      isActive: section.isActive,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this section?')) return;

    try {
      const response = await fetch(`/api/sections/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Section deleted');
        fetchSections();
      } else {
        toast.error(result.error || 'Failed to delete section');
      }
    } catch (error : any) {
      toast.error('Something went wrong');
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

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      parentId: '',
      displayOrder: 0,
      showInNavbar: false,
      showInHomepage: false,
      isActive: true,
    });
    setEditingSection(null);
  };

  const renderSectionTree = (sections: Section[], level = 0) => {
    return sections.map((section) => (
      <div key={section.id} className={`ml-${level * 4}`}>
        <Card className="mb-2">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {section.children && section.children.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpanded(section.id)}
                    className="p-1 h-6 w-6"
                  >
                    {expandedSections.has(section.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                )}
                
                {level === 0 ? (
                  <Folder className="h-4 w-4 text-blue-600" />
                ) : level === 1 ? (
                  <FolderOpen className="h-4 w-4 text-green-600" />
                ) : (
                  <div className="h-4 w-4 rounded bg-purple-600" />
                )}
                
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{section.name}</span>
                    <Badge variant="outline" className="text-xs">
                      Level {section.level}
                    </Badge>
                    {section.showInNavbar && (
                      <Badge variant="secondary" className="text-xs">
                        <Navigation className="h-3 w-3 mr-1" />
                        Nav
                      </Badge>
                    )}
                    {section.showInHomepage && (
                      <Badge variant="secondary" className="text-xs">
                        <Home className="h-3 w-3 mr-1" />
                        Home
                      </Badge>
                    )}
                    {!section.isActive && (
                      <Badge variant="destructive" className="text-xs">
                        Inactive
                      </Badge>
                    )}
                  </div>
                  {section.description && (
                    <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant={section.showInNavbar ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleNavbarToggle(section.id, section.showInNavbar)}
                  title={section.showInNavbar ? "Remove from navbar (includes children)" : "Add to navbar (includes children)"}
                >
                  <Navigation className="h-4 w-4" />
                </Button>
                <Button
                  variant={section.showInHomepage ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleHomepageToggle(section.id, section.showInHomepage)}
                  title={section.showInHomepage ? "Remove from homepage" : "Add to homepage"}
                >
                  <Home className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(section)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(section.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {section.children && 
         section.children.length > 0 && 
         expandedSections.has(section.id) && (
          <div className="ml-6 border-l-2 border-gray-200 pl-4">
            {renderSectionTree(section.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  const getParentOptions = () => {
    return flatSections.filter(section => 
      section.level < 2 && 
      section.id !== editingSection?.id &&
      section.isActive
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Section Management</h1>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Section
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingSection ? 'Edit Section' : 'Add New Section'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="parent">Parent Section</Label>
                  <Select
                    value={formData.parentId}
                    onValueChange={(value) => setFormData({ ...formData, parentId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Parent (Main Category)</SelectItem>
                      {getParentOptions().map((section) => (
                        <SelectItem key={section.id} value={section.id}>
                          {'  '.repeat(section.level)}
                          {section.name} (Level {section.level})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="displayOrder">Display Order</Label>
                  <Input
                    id="displayOrder"
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="navbar"
                      checked={formData.showInNavbar}
                      onCheckedChange={(checked) => setFormData({ ...formData, showInNavbar: checked })}
                    />
                    <Label htmlFor="navbar">Show in Navigation</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="homepage"
                      checked={formData.showInHomepage}
                      onCheckedChange={(checked) => setFormData({ ...formData, showInHomepage: checked })}
                    />
                    <Label htmlFor="homepage">Show on Homepage</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="active"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                    />
                    <Label htmlFor="active">Active</Label>
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  {editingSection ? 'Update Section' : 'Create Section'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tree">Tree View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tree" className="mt-6">
            {isLoading ? (
              <TreeViewSkeleton />
            ) : sections.length > 0 ? (
              <div className="space-y-4">
                {renderSectionTree(sections)}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No sections found. Create your first section!</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="list" className="mt-6">
            {isLoading ? (
              <ListViewSkeleton />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {flatSections.map((section) => (
                  <Card key={section.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span>{section.name}</span>
                          <Badge variant="outline" className="text-xs">
                            L{section.level}
                          </Badge>
                        </div>
                        {!section.isActive && (
                          <Badge variant="destructive" className="text-xs">
                            Inactive
                          </Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {section.parentName && (
                        <p className="text-sm text-gray-500 mb-2">
                          Parent: {section.parentName}
                        </p>
                      )}
                      <p className="text-gray-600 mb-4">{section.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {section.showInNavbar && (
                          <Badge variant="secondary" className="text-xs">
                            <Navigation className="h-3 w-3 mr-1" />
                            Navigation
                          </Badge>
                        )}
                        {section.showInHomepage && (
                          <Badge variant="secondary" className="text-xs">
                            <Home className="h-3 w-3 mr-1" />
                            Homepage
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex space-x-2 mb-3">
                        <Button
                          variant={section.showInNavbar ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleNavbarToggle(section.id, section.showInNavbar)}
                          title={section.showInNavbar ? "Remove from navbar (includes children)" : "Add to navbar (includes children)"}
                          className="flex-1"
                        >
                          <Navigation className="h-4 w-4 mr-1" />
                          Nav
                        </Button>
                        <Button
                          variant={section.showInHomepage ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleHomepageToggle(section.id, section.showInHomepage)}
                          title={section.showInHomepage ? "Remove from homepage" : "Add to homepage"}
                          className="flex-1"
                        >
                          <Home className="h-4 w-4 mr-1" />
                          Home
                        </Button>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(section)}
                          className="flex-1"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(section.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
