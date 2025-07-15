import bcrypt from 'bcryptjs';
import connectDB from '../lib/mongodb';
import User from '../models/User';
import Section from '../models/Section';
import Product from '../models/Product';

async function seed() {
  try {
    await connectDB();

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await User.findOneAndUpdate(
      { email: 'admin@designcraft.com' },
      {
        email: 'admin@designcraft.com',
        password: hashedPassword,
        isAdmin: true,
      },
      { upsert: true }
    );

    // Create sections
    const sections = [
      { name: 'Shiv Jayanti', description: 'Religious festival designs' },
      { name: 'Shivratri', description: 'Maha Shivratri celebration templates' },
      { name: 'Birthday', description: 'Birthday celebration designs' },
      { name: 'Wedding', description: 'Wedding ceremony templates' },
      { name: 'Business', description: 'Corporate and business designs' },
      { name: 'Custom', description: 'Custom design requests' },
    ];

    const createdSections = [];
    for (const section of sections) {
      const createdSection = await Section.findOneAndUpdate(
        { name: section.name },
        section,
        { upsert: true, new: true }
      );
      createdSections.push(createdSection);
    }

    // Create sample products
    const birthdaySection = createdSections.find(s => s.name === 'Birthday');
    const shivJayantiSection = createdSections.find(s => s.name === 'Shiv Jayanti');

    if (birthdaySection && shivJayantiSection) {
      const products = [
        {
          title: 'Happy Birthday Celebration Template',
          description: 'Colorful birthday invitation template with balloon decorations',
          originalPrice: 299,
          discountPrice: 199,
          sectionId: birthdaySection._id,
          displayImage: 'https://images.pexels.com/photos/1543761/pexels-photo-1543761.jpeg?auto=compress&cs=tinysrgb&w=800',
          productFiles: [
            'https://example.com/birthday-template-1.psd',
            'https://example.com/birthday-template-1.ai',
            'https://example.com/birthday-template-1.png',
          ],
          isFeatured: true,
        },
        {
          title: 'Shiv Jayanti Celebration Poster',
          description: 'Traditional Shiv Jayanti poster with modern typography',
          originalPrice: 399,
          discountPrice: 299,
          sectionId: shivJayantiSection._id,
          displayImage: 'https://images.pexels.com/photos/3894157/pexels-photo-3894157.jpeg?auto=compress&cs=tinysrgb&w=800',
          productFiles: [
            'https://example.com/shiv-jayanti-poster.psd',
            'https://example.com/shiv-jayanti-poster.ai',
            'https://example.com/shiv-jayanti-poster.jpg',
          ],
          isFeatured: true,
        },
        {
          title: 'Birthday Party Invitation Card',
          description: 'Elegant birthday party invitation with customizable text',
          originalPrice: 199,
          sectionId: birthdaySection._id,
          displayImage: 'https://images.pexels.com/photos/1729854/pexels-photo-1729854.jpeg?auto=compress&cs=tinysrgb&w=800',
          productFiles: [
            'https://example.com/birthday-invitation.psd',
            'https://example.com/birthday-invitation.jpg',
          ],
          isFeatured: false,
        },
      ];

      for (const product of products) {
        await Product.findOneAndUpdate(
          { title: product.title },
          product,
          { upsert: true }
        );
      }
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seed();