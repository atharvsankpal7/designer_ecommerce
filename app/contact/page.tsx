import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { connectDB } from '@/lib/mongodb';
import ContactSettings from '@/models/ContactSettings';
import SocialMedia from '@/models/SocialMedia';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Linkedin, 
  Globe 
} from 'lucide-react';

interface ContactPageProps {
  contactSettings: any;
  socialMedia: any[];
}

const getIconComponent = (iconName: string) => {
  const iconMap: { [key: string]: any } = {
    facebook: Facebook,
    instagram: Instagram,
    twitter: Twitter,
    youtube: Youtube,
    linkedin: Linkedin,
    website: Globe,
  };
  return iconMap[iconName] || Globe;
};

async function getContactData() {
  try {
    await connectDB();
    
    let contactSettings = await ContactSettings.findOne().lean();
    if (!contactSettings) {
      contactSettings = await ContactSettings.create({});
    }
    
    const socialMedia = await SocialMedia.find({ 
      isActive: true, 
      showInContact: true 
    }).sort({ order: 1 }).lean();
    
    return {
      contactSettings: JSON.parse(JSON.stringify(contactSettings)),
      socialMedia: JSON.parse(JSON.stringify(socialMedia))
    };
  } catch (error) {
    console.error('Error fetching contact data:', error);
    return {
      contactSettings: {
        phone: '+91 98765 43210',
        email: 'hello@sscreation.com',
        address: '123 Design Street, Mumbai',
        workingHours: {
          monday: '9:00 AM - 6:00 PM',
          tuesday: '9:00 AM - 6:00 PM',
          wednesday: '9:00 AM - 6:00 PM',
          thursday: '9:00 AM - 6:00 PM',
          friday: '9:00 AM - 6:00 PM',
          saturday: '10:00 AM - 4:00 PM',
          sunday: 'Closed'
        },
        mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.715872126558!2d72.8245093153778!3d19.04346925793646!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c96a34dc4401%3A0x3ffc07e83942b13f!2s123%20Design%20Street%2C%20Mumbai%2C%20Maharashtra%20400001!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin'
      },
      socialMedia: []
    };
  }
}

export default async function Contact() {
  const { contactSettings, socialMedia } = await getContactData();
  return (
    <div className="min-h-screen flex flex-col bg-rose-50/10">

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 bg-gradient-to-br from-rose-50 to-blue-50/30">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto">
              <h1 className="text-5xl font-bold mb-6 text-rose-800/90">Reach Out</h1>
              <p className="text-xl text-rose-700/80 mb-8">
                We're here to help and collaborate. Connect with us through your preferred channel.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Cards */}
        <section className="py-16 -mt-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {/* Phone Card */}
              <Card className="border-0 bg-white shadow-sm hover:shadow-md transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                    <Phone className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-rose-800 mb-2">Call Us</h3>
                  <p className="text-rose-700/80 mb-4">Available during business hours</p>
                  <a href={`tel:${contactSettings.phone.replace(/\s/g, '')}`} className="text-lg font-medium text-rose-600 hover:text-rose-800 transition-colors">
                    {contactSettings.phone}
                  </a>
                </CardContent>
              </Card>

              {/* Email Card */}
              <Card className="border-0 bg-white shadow-sm hover:shadow-md transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <Mail className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-blue-800 mb-2">Email Us</h3>
                  <p className="text-blue-700/80 mb-4">We'll respond within 24 hours</p>
                  <a href={`mailto:${contactSettings.email}`} className="text-lg font-medium text-blue-600 hover:text-blue-800 transition-colors">
                    {contactSettings.email}
                  </a>
                </CardContent>
              </Card>

              {/* Visit Card */}
              <Card className="border-0 bg-white shadow-sm hover:shadow-md transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-amber-800 mb-2">Visit Us</h3>
                  <p className="text-amber-700/80 mb-4">Schedule an appointment</p>
                  <address className="text-lg font-medium not-italic text-amber-600">
                    {contactSettings.address}
                  </address>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Details Section */}
        <section className="py-16 bg-gradient-to-br from-blue-50/30 to-rose-50/20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-rose-800/80 mb-3">Our Studio</h2>
                <p className="text-rose-700/80 max-w-2xl mx-auto">
                  A creative space where ideas come to life. Visit us during our working hours.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Hours */}
                <Card className="border-0 bg-white/70 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="p-3 rounded-full bg-teal-100 text-teal-600 mr-4">
                        <Clock className="h-5 w-5" />
                      </div>
                      <h3 className="text-xl font-semibold text-teal-800">Working Hours</h3>
                    </div>
                    <div className="space-y-3 pl-16">
                      {Object.entries(contactSettings.workingHours).map(([day, hours]:any) => (
                        <div key={day} className="flex justify-between">
                          <span className="text-rose-700/80 capitalize">{day}</span>
                          <span className="font-medium text-rose-800">{hours}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Social */}
                <Card className="border-0 bg-white/70 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                        <Instagram className="h-5 w-5" />
                      </div>
                      <h3 className="text-xl font-semibold text-purple-800">Connect Socially</h3>
                    </div>
                    <div className="space-y-4 pl-16">
                      {socialMedia.length > 0 ? (
                        socialMedia.map((social:any) => {
                          const IconComponent = getIconComponent(social.icon);
                          return (
                            <a 
                              key={social._id}
                              href={social.url} 
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center group"
                            >
                              <div className="w-8 mr-3" style={{ color: social.color }}>
                                <IconComponent className="h-5 w-5" />
                              </div>
                              <span 
                                className="group-hover:opacity-80 transition-opacity"
                                style={{ color: social.color }}
                              >
                                {social.name}
                              </span>
                            </a>
                          );
                        })
                      ) : (
                        <p className="text-gray-500">No social media links available</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto rounded-xl overflow-hidden shadow-lg border border-rose-100">
              <iframe 
                src={contactSettings.mapEmbedUrl} 
                width="100%" 
                height="450" 
                style={{ border: 0 }}
                allowFullScreen 
                loading="lazy" 
              ></iframe>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}