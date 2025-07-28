'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';

interface ContactSettings {
  _id?: string;
  phone: string;
  email: string;
  address: string;
  whatsappNumber: string;
  workingHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  mapEmbedUrl: string;
}

export function ContactSettingsManager() {
  const [settings, setSettings] = useState<ContactSettings>({
    phone: '',
    email: '',
    address: '',
    whatsappNumber: '',
    workingHours: {
      monday: '',
      tuesday: '',
      wednesday: '',
      thursday: '',
      friday: '',
      saturday: '',
      sunday: ''
    },
    mapEmbedUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/contact-settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load contact settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/contact-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        toast.success('Contact settings updated successfully');
      } else {
        throw new Error('Failed to update settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save contact settings');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleWorkingHoursChange = (day: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: value
      }
    }));
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
        <h2 className="text-2xl font-bold">Contact Settings</h2>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Basic Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={settings.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+91 98765 43210"
              />
            </div>
            <div>
              <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
              <Input
                id="whatsappNumber"
                value={settings.whatsappNumber}
                onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                placeholder="+919876543210"
              />
              <p className="text-sm text-gray-500 mt-1">
                Used for the floating WhatsApp button. Include country code without spaces.
              </p>
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="hello@sscreation.com"
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={settings.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="123 Design Street, Mumbai"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Working Hours */}
        <Card>
          <CardHeader>
            <CardTitle>Working Hours</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(settings.workingHours).map(([day, hours]) => (
              <div key={day}>
                <Label htmlFor={day} className="capitalize">{day}</Label>
                <Input
                  id={day}
                  value={hours}
                  onChange={(e) => handleWorkingHoursChange(day, e.target.value)}
                  placeholder="9:00 AM - 6:00 PM"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Map Embed */}
        <Card>
          <CardHeader>
            <CardTitle>Map Embed URL</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="mapEmbedUrl">Google Maps Embed URL</Label>
              <Textarea
                id="mapEmbedUrl"
                value={settings.mapEmbedUrl}
                onChange={(e) => handleInputChange('mapEmbedUrl', e.target.value)}
                placeholder="https://www.google.com/maps/embed?pb=..."
                rows={4}
              />
              <p className="text-sm text-gray-500 mt-2">
                Get this URL from Google Maps → Share → Embed a map
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}