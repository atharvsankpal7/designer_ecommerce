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
  GripVertical,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Globe
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

interface SocialMedia {
  _id: string;
  name: string;
  url: string;
  icon: string;
  isActive: boolean;
  showInFooter: boolean;
  showInContact: boolean;
  order: number;
  color: string;
}

const iconOptions = [
  { value: 'facebook', label: 'Facebook', icon: Facebook },
  { value: 'instagram', label: 'Instagram', icon: Instagram },
  { value: 'twitter', label: 'Twitter/X', icon: Twitter },
  { value: 'youtube', label: 'YouTube', icon: Youtube },
  { value: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { value: 'website', label: 'Website', icon: Globe },
];

export function SocialMediaManager() {
  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<SocialMedia | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchSocialMedia();
  }, []);

  const fetchSocialMedia = async () => {
    try {
      const response = await fetch('/api/admin/social-media');
      if (response.ok) {
        const data = await response.json();
        setSocialMedia(data);
      }
    } catch (error) {
      console.error('Error fetching social media:', error);
      toast.error('Failed to load social media');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (item: Omit<SocialMedia, '_id'> & { _id?: string }) => {
    try {
      const url = item._id ? `/api/admin/social-media/${item._id}` : '/api/admin/social-media';
      const method = item._id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });

      if (response.ok) {
        toast.success(`Social media ${item._id ? 'updated' : 'created'} successfully`);
        fetchSocialMedia();
        setIsDialogOpen(false);
        setEditingItem(null);
      } else {
        throw new Error('Failed to save social media');
      }
    } catch (error) {
      console.error('Error saving social media:', error);
      toast.error('Failed to save social media');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this social media link?')) return;

    try {
      const response = await fetch(`/api/admin/social-media/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Social media deleted successfully');
        fetchSocialMedia();
      } else {
        throw new Error('Failed to delete social media');
      }
    } catch (error) {
      console.error('Error deleting social media:', error);
      toast.error('Failed to delete social media');
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(socialMedia);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order values
    const updatedItems = items.map((item, index) => ({
      id: item._id,
      order: index
    }));

    setSocialMedia(items);

    try {
      const response = await fetch('/api/admin/social-media/reorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: updatedItems }),
      });

      if (!response.ok) {
        throw new Error('Failed to reorder items');
      }
    } catch (error) {
      console.error('Error reordering social media:', error);
      toast.error('Failed to reorder social media');
      fetchSocialMedia(); // Revert on error
    }
  };

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find(opt => opt.value === iconName);
    return iconOption ? iconOption.icon : Globe;
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
        <h2 className="text-2xl font-bold">Social Media Links</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingItem(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Social Media
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit Social Media' : 'Add Social Media'}
              </DialogTitle>
            </DialogHeader>
            <SocialMediaForm
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

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="social-media">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {socialMedia.map((item, index) => {
                const IconComponent = getIconComponent(item.icon);
                return (
                  <Draggable key={item._id} draggableId={item._id} index={index}>
                    {(provided) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="p-4"
                      >
                        <div className="flex items-center gap-4">
                          <div {...provided.dragHandleProps}>
                            <GripVertical className="h-5 w-5 text-gray-400" />
                          </div>
                          
                          <div className="flex items-center gap-3 flex-1">
                            <div 
                              className="p-2 rounded-lg"
                              style={{ backgroundColor: `${item.color}20`, color: item.color }}
                            >
                              <IconComponent className="h-5 w-5" />
                            </div>
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
                            <div className="flex items-center gap-2 text-sm">
                              <span>Footer:</span>
                              <Switch
                                checked={item.showInFooter}
                                onCheckedChange={(checked) => {
                                  handleSave({ ...item, showInFooter: checked });
                                }}
                              />
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <span>Contact:</span>
                              <Switch
                                checked={item.showInContact}
                                onCheckedChange={(checked) => {
                                  handleSave({ ...item, showInContact: checked });
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
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

function SocialMediaForm({ 
  item, 
  onSave, 
  onCancel 
}: { 
  item: SocialMedia | null;
  onSave: (item: Omit<SocialMedia, '_id'> & { _id?: string }) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    url: item?.url || '',
    icon: item?.icon || 'website',
    color: item?.color || '#000000',
    isActive: item?.isActive ?? true,
    showInFooter: item?.showInFooter ?? true,
    showInContact: item?.showInContact ?? true,
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
          placeholder="Facebook"
          required
        />
      </div>

      <div>
        <Label htmlFor="url">URL</Label>
        <Input
          id="url"
          type="url"
          value={formData.url}
          onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
          placeholder="https://facebook.com/sscreation"
          required
        />
      </div>

      <div>
        <Label htmlFor="icon">Icon</Label>
        <select
          id="icon"
          value={formData.icon}
          onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
          className="w-full p-2 border rounded-md"
        >
          {iconOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="color">Color</Label>
        <Input
          id="color"
          type="color"
          value={formData.color}
          onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="isActive">Active</Label>
          <Switch
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="showInFooter">Show in Footer</Label>
          <Switch
            id="showInFooter"
            checked={formData.showInFooter}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, showInFooter: checked }))}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="showInContact">Show in Contact Page</Label>
          <Switch
            id="showInContact"
            checked={formData.showInContact}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, showInContact: checked }))}
          />
        </div>
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