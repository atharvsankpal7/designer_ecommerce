'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { 
  Loader2, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  GripVertical
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';

interface FooterLink {
  _id: string;
  name: string;
  url: string;
  category: 'quick-links' | 'categories' | 'legal';
  isActive: boolean;
  order: number;
}

const categoryOptions = [
  { value: 'quick-links', label: 'Quick Links' },
  { value: 'categories', label: 'Categories' },
  { value: 'legal', label: 'Legal' },
];

export function FooterLinksManager() {
  const [footerLinks, setFooterLinks] = useState<FooterLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<FooterLink | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('quick-links');

  useEffect(() => {
    fetchFooterLinks();
  }, []);

  const fetchFooterLinks = async () => {
    try {
      const response = await fetch('/api/admin/footer-links');
      if (response.ok) {
        const data = await response.json();
        setFooterLinks(data);
      }
    } catch (error) {
      console.error('Error fetching footer links:', error);
      toast.error('Failed to load footer links');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (item: Omit<FooterLink, '_id'> & { _id?: string }) => {
    try {
      const url = item._id ? `/api/admin/footer-links/${item._id}` : '/api/admin/footer-links';
      const method = item._id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });

      if (response.ok) {
        toast.success(`Footer link ${item._id ? 'updated' : 'created'} successfully`);
        fetchFooterLinks();
        setIsDialogOpen(false);
        setEditingItem(null);
      } else {
        throw new Error('Failed to save footer link');
      }
    } catch (error) {
      console.error('Error saving footer link:', error);
      toast.error('Failed to save footer link');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this footer link?')) return;

    try {
      const response = await fetch(`/api/admin/footer-links/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Footer link deleted successfully');
        fetchFooterLinks();
      } else {
        throw new Error('Failed to delete footer link');
      }
    } catch (error) {
      console.error('Error deleting footer link:', error);
      toast.error('Failed to delete footer link');
    }
  };

  const getFilteredLinks = (category: string) => {
    return footerLinks.filter(link => link.category === category);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Footer Links</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingItem(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Footer Link
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit Footer Link' : 'Add Footer Link'}
              </DialogTitle>
            </DialogHeader>
            <FooterLinkForm
              item={editingItem}
              onSave={handleSave}
              onCancel={() => {
                setIsDialogOpen(false);
                setEditingItem(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 border-b">
        {categoryOptions.map(category => (
          <button
            key={category.value}
            onClick={() => setSelectedCategory(category.value)}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              selectedCategory === category.value
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Links for Selected Category */}
      <div className="space-y-4">
        {getFilteredLinks(selectedCategory).map((item) => (
          <Card key={item._id} className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.url}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <span>Active:</span>
                  <Switch
                    checked={item.isActive}
                    onCheckedChange={(checked) => {
                      handleSave({ ...item, isActive: checked });
                    }}
                  />
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingItem(item);
                    setIsDialogOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(item._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {getFilteredLinks(selectedCategory).length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No links found for this category
          </div>
        )}
      </div>
    </div>
  );
}

function FooterLinkForm({ 
  item, 
  onSave, 
  onCancel 
}: { 
  item: FooterLink | null;
  onSave: (item: Omit<FooterLink, '_id'> & { _id?: string }) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    url: item?.url || '',
    category: item?.category || 'quick-links' as 'quick-links' | 'categories' | 'legal',
    isActive: item?.isActive ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      ...(item?._id && { _id: item._id }),
      order: item?.order || 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Home"
          required
        />
      </div>

      <div>
        <Label htmlFor="url">URL</Label>
        <Input
          id="url"
          value={formData.url}
          onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
          placeholder="/"
          required
        />
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          value={formData.category}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            category: e.target.value as 'quick-links' | 'categories' | 'legal'
          }))}
          className="w-full p-2 border rounded-md"
        >
          {categoryOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="isActive">Active</Label>
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit">
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>
    </form>
  );
}