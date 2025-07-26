import { Metadata } from 'next';
import { SSRHeader } from '@/components/layout/ssr-header';
import { Footer } from '@/components/layout/footer';
import { ProductGrid } from '@/components/products/product-grid';
import { AllProductsSidebar } from '@/components/products/all-products-sidebar';
import connectDB from '@/lib/mongodb';
import { Product, Section } from '@/lib/models';


interface ProductsPageProps {
  searchParams: {
    page?: string;
    sort?: string;
    priceRange?: string;
    section?: string;
  };
}

async function getAllProducts(page = 1, sort = 'newest', priceRange?: string, sectionName?: string) {
  await connectDB();
  
  const limit = 12;
  const skip = (page - 1) * limit;
  
  let query: any = {
    isActive: true,
  };
  
  // Apply section filter
  if (sectionName) {
    const section = await Section.findOne({ 
      name: { $regex: new RegExp(sectionName, 'i') },
      isActive: true 
    });
    if (section) {
      query.sectionIds = section._id;
    }
  }
  
  // Apply price range filter
  if (priceRange) {
    const [min, max] = priceRange.split('-').map(Number);
    if (max) {
      query.originalPrice = { $gte: min, $lte: max };
    } else {
      query.originalPrice = { $gte: min };
    }
  }
  
  // Apply sorting
  let sortQuery: any = {};
  switch (sort) {
    case 'price-low':
      sortQuery = { originalPrice: 1 };
      break;
    case 'price-high':
      sortQuery = { originalPrice: -1 };
      break;
    case 'name':
      sortQuery = { title: 1 };
      break;
    case 'featured':
      sortQuery = { isFeatured: -1, createdAt: -1 };
      break;
    default:
      sortQuery = { createdAt: -1 };
  }
  
  const [products, totalCount] = await Promise.all([
    Product.find(query)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit)
      .populate('sectionIds', 'name slug'),
    Product.countDocuments(query)
  ]);
  
  const transformedProducts = products.map((product) => ({
    id: product._id.toString(),
    title: product.title,
    description: product.description,
    displayImage: product.displayImage,
    originalPrice: product.originalPrice,
    discountPrice: product.discountPrice,
    isFeatured: product.isFeatured,
    sections: product.sectionIds.map((section: any) => ({
      id: section._id.toString(),
      name: section.name,
      slug: section.slug,
    })),
  }));
  
  return {
    products: transformedProducts,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
  };
}

export const metadata: Metadata = {
  title: 'All Products - SSCreation | Premium Graphic Design Templates Collection',
  description: 'Browse SSCreation\'s complete collection of premium graphic design templates. Find festival designs, business templates, social media graphics, and celebration designs. Instant download with commercial license.',
  keywords: 'SSCreation products, graphic design templates, premium templates collection, festival designs, business templates, social media templates, poster templates, banner designs, celebration graphics, design marketplace',
  openGraph: {
    title: 'All Products - SSCreation | Premium Graphic Design Templates',
    description: 'Browse SSCreation\'s complete collection of premium graphic design templates. Instant download with commercial license.',
    url: 'https://sscreation.com/products',
  },
  alternates: {
    canonical: 'https://sscreation.com/products',
  },
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const page = parseInt(searchParams.page || '1');
  const sort = searchParams.sort || 'newest';
  const priceRange = searchParams.priceRange;
  const sectionName = searchParams.section;
  
  const productData = await getAllProducts(page, sort, priceRange, sectionName);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <SSRHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            All Products
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Discover our complete collection of premium graphic design templates. 
            From festival celebrations to business essentials, find the perfect design for every occasion.
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <AllProductsSidebar />
          </aside>
          
          <div className="flex-1">
            <ProductGrid 
              {...productData}
              sort={sort}
              priceRange={priceRange}
              sectionPath=""
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
