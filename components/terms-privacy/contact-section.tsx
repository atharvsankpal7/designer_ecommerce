'use client';

import { MessageCircle, Globe, Mail } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ContactSectionProps {
  contactSettings: {
    whatsappNumber?: string;
    email?: string;
  };
}

export function ContactSection({ contactSettings }: ContactSectionProps) {
  const handleWhatsAppClick = () => {
    const cleanPhoneNumber = contactSettings.whatsappNumber?.replace(/[^\d+]/g, '') || '+919876543210';
    const message = encodeURIComponent("Hello! I have a question about your terms and policies.");
    const whatsappUrl = `https://wa.me/${cleanPhoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="text-center space-y-6">
      <p className="text-lg text-gray-700 mb-6">
        Have a question or need help with downloads?
      </p>
      
      <div className="grid md:grid-cols-2 gap-4">
        {/* WhatsApp */}
        <div className="bg-green-50 p-6 rounded-lg border border-green-200 hover:border-green-300 transition-colors">
          <div className="flex items-center justify-center mb-3">
            <MessageCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="font-semibold text-green-800 mb-2">WhatsApp</h3>
          <p className="text-green-700 font-medium">{contactSettings.whatsappNumber || '+91 85303 28357'}</p>
          <Button 
            onClick={handleWhatsAppClick}
            className="mt-3 bg-green-500 hover:bg-green-600 text-white w-full"
            size="sm"
          >
            Chat Now
          </Button>
        </div>

        {/* Website */}
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-center mb-3">
            <Globe className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="font-semibold text-blue-800 mb-2">Website</h3>
          <p className="text-blue-700 font-medium">www.sscreation.online</p>
          <Button 
            onClick={() => window.open('https://www.sscreation.online', '_blank')}
            className="mt-3 bg-blue-500 hover:bg-blue-600 text-white w-full"
            size="sm"
          >
            Visit Site
          </Button>
        </div>

      </div>
    </div>
  );
}