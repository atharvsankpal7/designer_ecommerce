import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { SSRHeader } from '@/components/layout/ssr-header';
import { Footer } from '@/components/layout/footer';
import { ProductGrid } from '@/components/products/product-grid';
import { SectionBreadcrumb } from '@/components/products/section-breadcrumb';
import { SectionSidebar } from '@/components/products/section-sidebar';
import { getSectionBySlugPath, getSectionBreadcrumb, buildSectionPath } from '@/lib/section-utils';
import connectDB from '@/lib/mongodb';
import { Product } from '@/lib/models';
import { getSectionProducts, getSectionProducts2 } from '@/lib/actions';

interface ProductPageProps {
  params: {
    sections: string[];
  };
  searchParams: {
    page?: string;
    sort?: string;
    priceRange?: string;
  };
}



export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const slugPath = params.sections.join('/');
  const section = await getSectionBySlugPath(slugPath);
  
  if (!section) {
    return {
      title: 'Products - SSCreation',
      description: 'Browse our premium graphic design templates and digital products.',
    };
  }
  
  const breadcrumb = await getSectionBreadcrumb(section.id);
  const breadcrumbText = breadcrumb.map(s => s.name).join(' > ');
  
  return {
    title: `${section.name} - Premium Design Templates | SSCreation`,
    description: `Explore our ${section.name.toLowerCase()} collection. Premium graphic design templates with instant download and commercial license.`,
    keywords: `${section.name}, graphic design templates, premium templates, SSCreation, ${section.name.toLowerCase()} designs`,
    openGraph: {
      title: `${section.name} - Premium Design Templates`,
      description: `Explore our ${section.name.toLowerCase()} collection. Premium graphic design templates with instant download.`,
      url: `https://sscreation.com/products/${slugPath}`,
    },
    alternates: {
      canonical: `https://sscreation.com/products/${slugPath}`,
    },
  };
}

export default async function SectionProductsPage({ params, searchParams }: ProductPageProps) {
  const slugPath = params.sections.join('/');
  const section = await getSectionBySlugPath(slugPath);
  
  if (!section) {
    notFound();
  }
  
  const page = parseInt(searchParams.page || '1');
  const sort = searchParams.sort || 'newest';
  const priceRange = searchParams.priceRange;
  
  const [productData, breadcrumb] = await Promise.all([
    getSectionProducts2(section.id, page, sort, priceRange),
    getSectionBreadcrumb(section.id)
  ]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <SSRHeader />
      
      <main className="container mx-auto px-4 py-8">
        <SectionBreadcrumb breadcrumb={breadcrumb} />
        
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {section.name}
          </h1>
          
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <SectionSidebar currentSection={section} />
          </aside>
          
          <div className="flex-1">
            <ProductGrid 
              {...productData}
              sort={sort}
              priceRange={priceRange}
              sectionPath={slugPath}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}