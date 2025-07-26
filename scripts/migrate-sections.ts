import connectDB from '../lib/mongodb';
import Section from '../models/Section';
import Product from '../models/Product';
import Bundle from '../models/Bundle';
import { generateSlug } from '../lib/section-utils';

async function migrateSections() {
  console.log('🚀 Starting section migration...');
  
  try {
    await connectDB();
    
    // Step 1: Update existing sections to new schema
    console.log('📝 Updating existing sections...');
    
    const existingSections = await Section.find({});
    
    for (const section of existingSections) {
      const updates: any = {};
      
      // Generate slug if missing
      if (!section.slug) {
        updates.slug = generateSlug(section.name);
      }
      
      // Set default values for new fields
      if (section.level === undefined) {
        updates.level = 0; // Assume existing sections are main categories
      }
      
      if (section.displayOrder === undefined) {
        updates.displayOrder = 0;
      }
      
      if (section.showInNavbar === undefined) {
        updates.showInNavbar = true; // Show existing sections in navbar by default
      }
      
      if (section.showInHomepage === undefined) {
        updates.showInHomepage = false; // Don't show on homepage by default
      }
      
      if (Object.keys(updates).length > 0) {
        await Section.findByIdAndUpdate(section._id, updates);
        console.log(`✅ Updated section: ${section.name}`);
      }
    }
    
    // Step 2: Update products to use sectionIds array instead of sectionId
    console.log('📦 Updating products...');
    
    const products = await Product.find({});
    
    for (const product of products) {
      if (product.sectionId && !product.sectionIds) {
        await Product.findByIdAndUpdate(product._id, {
          sectionIds: [product.sectionId],
          $unset: { sectionId: 1 }
        });
        console.log(`✅ Updated product: ${product.title}`);
      }
    }
    
    // Step 3: Update bundles to include sectionIds
    console.log('📦 Updating bundles...');
    
    const bundles = await Bundle.find({});
    
    for (const bundle of bundles) {
      if (!bundle.sectionIds || bundle.sectionIds.length === 0) {
        // Get sections from bundle's products
        const bundleProducts = await Product.find({
          _id: { $in: bundle.products }
        }).populate('sectionIds');
        
        const sectionIds = new Set();
        bundleProducts.forEach(product => {
          if (product.sectionIds) {
            product.sectionIds.forEach((sectionId: any) => {
              sectionIds.add(sectionId.toString());
            });
          }
        });
        
        if (sectionIds.size > 0) {
          await Bundle.findByIdAndUpdate(bundle._id, {
            sectionIds: Array.from(sectionIds)
          });
          console.log(`✅ Updated bundle: ${bundle.name}`);
        }
      }
    }
    
    // Step 4: Create some sample hierarchical sections
    console.log('🌳 Creating sample hierarchical sections...');
    
    const sampleSections = [
      {
        name: 'Festival Designs',
        description: 'Celebrate every occasion with our premium festival design templates',
        level: 0,
        displayOrder: 1,
        showInNavbar: true,
        showInHomepage: true,
        children: [
          {
            name: 'Diwali',
            description: 'Beautiful Diwali celebration designs',
            level: 1,
            displayOrder: 1,
            showInNavbar: true,
            showInHomepage: false,
          },
          {
            name: 'Holi',
            description: 'Colorful Holi festival templates',
            level: 1,
            displayOrder: 2,
            showInNavbar: true,
            showInHomepage: false,
          },
          {
            name: 'Christmas',
            description: 'Festive Christmas design templates',
            level: 1,
            displayOrder: 3,
            showInNavbar: true,
            showInHomepage: false,
          }
        ]
      },
      {
        name: 'Business Templates',
        description: 'Professional business design templates for all your needs',
        level: 0,
        displayOrder: 2,
        showInNavbar: true,
        showInHomepage: true,
        children: [
          {
            name: 'Business Cards',
            description: 'Professional business card designs',
            level: 1,
            displayOrder: 1,
            showInNavbar: true,
            showInHomepage: false,
          },
          {
            name: 'Letterheads',
            description: 'Corporate letterhead templates',
            level: 1,
            displayOrder: 2,
            showInNavbar: true,
            showInHomepage: false,
          },
          {
            name: 'Brochures',
            description: 'Marketing brochure designs',
            level: 1,
            displayOrder: 3,
            showInNavbar: true,
            showInHomepage: false,
          }
        ]
      },
      {
        name: 'Social Media',
        description: 'Eye-catching social media templates',
        level: 0,
        displayOrder: 3,
        showInNavbar: true,
        showInHomepage: true,
        children: [
          {
            name: 'Instagram Posts',
            description: 'Instagram post templates',
            level: 1,
            displayOrder: 1,
            showInNavbar: true,
            showInHomepage: false,
            children: [
              {
                name: 'Stories',
                description: 'Instagram story templates',
                level: 2,
                displayOrder: 1,
                showInNavbar: true,
                showInHomepage: false,
              },
              {
                name: 'Feed Posts',
                description: 'Instagram feed post templates',
                level: 2,
                displayOrder: 2,
                showInNavbar: true,
                showInHomepage: false,
              }
            ]
          },
          {
            name: 'Facebook Posts',
            description: 'Facebook post templates',
            level: 1,
            displayOrder: 2,
            showInNavbar: true,
            showInHomepage: false,
          }
        ]
      }
    ];
    
    // Create sample sections if they don't exist
    for (const sectionData of sampleSections) {
      const existingSection = await Section.findOne({ name: sectionData.name, level: 0 });
      
      if (!existingSection) {
        const parentSection = new Section({
          ...sectionData,
          slug: generateSlug(sectionData.name),
          isActive: true,
        });
        
        await parentSection.save();
        console.log(`✅ Created parent section: ${sectionData.name}`);
        
        // Create child sections
        if (sectionData.children) {
          for (const childData of sectionData.children) {
            const childSection = new Section({
              ...childData,
              slug: generateSlug(childData.name),
              parentId: parentSection._id,
              isActive: true,
            });
            
            await childSection.save();
            console.log(`  ✅ Created child section: ${childData.name}`);
            
            // Create grandchild sections
            if (childData.children) {
              for (const grandchildData of childData.children) {
                const grandchildSection = new Section({
                  ...grandchildData,
                  slug: generateSlug(grandchildData.name),
                  parentId: childSection._id,
                  isActive: true,
                });
                
                await grandchildSection.save();
                console.log(`    ✅ Created grandchild section: ${grandchildData.name}`);
              }
            }
          }
        }
      }
    }
    
    console.log('🎉 Migration completed successfully!');
    
    // Display summary
    const totalSections = await Section.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalBundles = await Bundle.countDocuments();
    
    console.log('\n📊 Migration Summary:');
    console.log(`   Sections: ${totalSections}`);
    console.log(`   Products: ${totalProducts}`);
    console.log(`   Bundles: ${totalBundles}`);
    
  } catch (error : any) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateSections()
    .then(() => {
      console.log('✅ Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration script failed:', error);
      process.exit(1);
    });
}

export default migrateSections;