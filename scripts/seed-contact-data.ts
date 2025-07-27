import { connectDB } from '../lib/mongodb';
import ContactSettings from '../models/ContactSettings';
import SocialMedia from '../models/SocialMedia';
import FooterLinks from '../models/FooterLinks';

async function seedContactData() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Seed Contact Settings
    const existingSettings = await ContactSettings.findOne();
    if (!existingSettings) {
      await ContactSettings.create({
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
      });
      console.log('✅ Contact settings seeded');
    } else {
      console.log('⚠️ Contact settings already exist');
    }

    // Seed Social Media
    const existingSocialMedia = await SocialMedia.find();
    if (existingSocialMedia.length === 0) {
      const socialMediaData = [
        {
          name: 'Facebook',
          url: 'https://facebook.com/sscreation',
          icon: 'facebook',
          color: '#1877F2',
          order: 0,
          isActive: true,
          showInFooter: true,
          showInContact: true
        },
        {
          name: 'Instagram',
          url: 'https://instagram.com/sscreation',
          icon: 'instagram',
          color: '#E4405F',
          order: 1,
          isActive: true,
          showInFooter: true,
          showInContact: true
        },
        {
          name: 'Twitter',
          url: 'https://twitter.com/sscreation',
          icon: 'twitter',
          color: '#1DA1F2',
          order: 2,
          isActive: true,
          showInFooter: true,
          showInContact: true
        },
        {
          name: 'YouTube',
          url: 'https://youtube.com/@sscreation',
          icon: 'youtube',
          color: '#FF0000',
          order: 3,
          isActive: true,
          showInFooter: true,
          showInContact: false
        },
        {
          name: 'LinkedIn',
          url: 'https://linkedin.com/company/sscreation',
          icon: 'linkedin',
          color: '#0A66C2',
          order: 4,
          isActive: true,
          showInFooter: true,
          showInContact: false
        }
      ];

      await SocialMedia.insertMany(socialMediaData);
      console.log('✅ Social media links seeded');
    } else {
      console.log('⚠️ Social media links already exist');
    }

    // Seed Footer Links
    const existingFooterLinks = await FooterLinks.find();
    if (existingFooterLinks.length === 0) {
      const footerLinksData = [
        // Quick Links
        { name: 'Home', url: '/', category: 'quick-links', order: 0, isActive: true },
        { name: 'About Us', url: '/about', category: 'quick-links', order: 1, isActive: true },
        { name: 'Products', url: '/products', category: 'quick-links', order: 2, isActive: true },
        { name: 'Bundles', url: '/bundles', category: 'quick-links', order: 3, isActive: true },
        { name: 'Contact', url: '/contact', category: 'quick-links', order: 4, isActive: true },
        
        // Categories
        { name: 'Festival Designs', url: '/products?section=Festival Designs', category: 'categories', order: 0, isActive: true },
        { name: 'Design Bundles', url: '/bundles', category: 'categories', order: 1, isActive: true },
        { name: 'Business Cards', url: '/products?section=Business Templates', category: 'categories', order: 2, isActive: true },
        { name: 'Social Media', url: '/products?section=Social Media', category: 'categories', order: 3, isActive: true },
        
        // Legal
        { name: 'Privacy Policy', url: '/privacy', category: 'legal', order: 0, isActive: true },
        { name: 'Terms of Service', url: '/terms', category: 'legal', order: 1, isActive: true },
        { name: 'Refund Policy', url: '/refund', category: 'legal', order: 2, isActive: true }
      ];

      await FooterLinks.insertMany(footerLinksData);
      console.log('✅ Footer links seeded');
    } else {
      console.log('⚠️ Footer links already exist');
    }

    console.log('🎉 Contact data seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding contact data:', error);
    process.exit(1);
  }
}

seedContactData();