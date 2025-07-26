'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SSRHeader } from '@/components/layout/ssr-header';
import { Footer } from '@/components/layout/footer';

import { PurchaseModal } from '@/components/products/purchase-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton'; 
import Link from 'next/link';

import Image from 'next/image';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';

interface ProductSection {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  title: string;
  description: string;
  displayImage: string;
  originalPrice: number;
  discountPrice?: number;
  sections: ProductSection[];
}

interface SectionHierarchy {
  id: string;
  name: string;
  slug: string;
  level: number;
  displayOrder: number;
  showInNavbar: boolean;
  showInHomepage: boolean;
  isActive: boolean;
  children?: SectionHierarchy[];
}

// Loading Skeleton Components
const ProductSkeleton = () => (
  <div className="group relative bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col p-4">
    <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-gray-100">
      <Skeleton className="w-full h-full" />
      <Skeleton className="absolute top-2 left-2 h-5 w-16 rounded-full" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>
    </div>
  </div>
);

const FiltersSkeleton = () => (
  <div className="flex flex-col md:flex-row gap-4 mb-8">
    <div className="relative flex-1">
      <Skeleton className="h-10 w-full rounded-md" />
    </div>
    <Skeleton className="h-10 w-full md:w-48 rounded-md" />
  </div>
);

export default function Products() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [sections, setSections] = useState<SectionHierarchy[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  
  // Loading states
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoadingSections, setIsLoadingSections] = useState(true);

  // Get filters from URL
  const selectedSection = searchParams.get('section') || 'all';
  const searchTerm = searchParams.get('search') || '';

  useEffect(() => {
    fetchProducts();
  }, [selectedSection, searchTerm]);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoadingProducts(true);
      const params = new URLSearchParams();
      if (selectedSection !== 'all') {
        params.append('section', selectedSection);
      }
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();
      setProducts(data);
    } catch (error : any) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const fetchSections = async () => {
    try {
      setIsLoadingSections(true);
      const response = await fetch('/api/sections?type=hierarchy&activeOnly=true');
      const data = await response.json();
      setSections(data);
    } catch (error : any) {
      console.error('Error fetching sections:', error);
    } finally {
      setIsLoadingSections(false);
    }
  };

  const updateURL = (newSection: string, newSearchTerm: string) => {
    const params = new URLSearchParams();
    
    if (newSection !== 'all') {
      params.set('section', newSection);
    }
    
    if (newSearchTerm.trim()) {
      params.set('search', newSearchTerm.trim());
    }
    
    const queryString = params.toString();
    const newURL = queryString ? `/products?${queryString}` : '/products';
    
    router.push(newURL);
  };

  const handleSectionChange = (newSection: string) => {
    updateURL(newSection, searchTerm);
  };

  const handleSearchChange = (newSearchTerm: string) => {
    updateURL(selectedSection, newSearchTerm);
  };

  const handlePurchase = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setShowPurchaseModal(true);
    }
  };

  // Render hierarchical section options with proper indentation
  const renderSectionOptions = (sections: SectionHierarchy[], level = 0): JSX.Element[] => {
    const options: JSX.Element[] = [];
    
    sections.forEach((section) => {
      // Create indentation based on level
      const indent = '  '.repeat(level);
      const levelIndicator = level === 0 ? '' : level === 1 ? '└ ' : '  └ ';
      
      options.push(
        <SelectItem key={section.id} value={section.name}>
          {indent}{levelIndicator}{section.name}
        </SelectItem>
      );
      
      // Recursively render children
      if (section.children && section.children.length > 0) {
        options.push(...renderSectionOptions(section.children, level + 1));
      }
    });
    
    return options;
  };

  return (
    <div className="min-h-screen">
      <SSRHeader />
      <main>
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-center mb-8">Our Products</h1>
            
            {/* Filters Section */}
            {isLoadingSections ? (
              <FiltersSkeleton />
            ) : (
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={selectedSection} onValueChange={handleSectionChange}>
                  <SelectTrigger className="w-full md:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sections</SelectItem>
                    {renderSectionOptions(sections)}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {isLoadingProducts ? (
                // Show skeleton cards while loading
                Array.from({ length: 8 }).map((_, index) => (
                  <ProductSkeleton key={index} />
                ))
              ) : (
                // Show actual products when loaded
                products.length > 0 && products.map((product) => (
                  <div key={product.id} className="group relative bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col p-4 hover:border-primary/50 hover:scale-[1.01]">
                    <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-gray-100">
                      <Image
                        src={product.displayImage}
                        alt={product.title}
                        fill
                        className="object-contain p-2 cursor-pointer"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        onClick={() => setExpandedImage(product.displayImage)}
                      />
                      
                      <div className="absolute top-2 left-2 flex flex-wrap gap-1 max-w-[calc(100%-4rem)]">
                        {product.sections && product.sections.length > 0 ? (
                          product.sections.slice(0, 2).map((section) => (
                            <Badge key={section.id} className="bg-primary text-xs">
                              {section.name}
                            </Badge>
                          ))
                        ) : (
                          <Badge className="bg-gray-500 text-xs">
                            No Category
                          </Badge>
                        )}
                        {product.sections && product.sections.length > 2 && (
                          <Badge className="bg-primary/80 text-xs">
                            +{product.sections.length - 2}
                          </Badge>
                        )}
                      </div>

                      {product.discountPrice && (
                        <Badge className="absolute top-2 right-2 bg-red-500">
                            {Math.round(((product.originalPrice - product.discountPrice) / product.originalPrice) * 100)}% OFF
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold line-clamp-2">{product.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          {product.discountPrice && (
                            <span className="text-lg font-bold text-primary">
                              ₹{product.discountPrice}
                            </span>
                          )}
                          <span
                            className={`${
                              product.discountPrice
                                ? "line-through text-gray-500 ml-2"
                                : "text-lg font-bold"
                            }`}
                          >
                            ₹{product.originalPrice}
                          </span>
                        </div>
                        <div className="flex gap-2">
                        <Button
                          size="sm"
                            asChild
                          variant="secondary"
                        >
                          <Link href={`/products/${product.id}`}>
                          
                          View Details
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handlePurchase(product.id)}
                        >
                          Buy Now
                        </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* No products message */}
            {!isLoadingProducts && products.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No products found.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />

      <PurchaseModal
        product={selectedProduct}
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
      />

      {/* Image Expansion Modal */}
      <Dialog
        open={!!expandedImage}
        onOpenChange={(open) => !open && setExpandedImage(null)}
      >
        <DialogContent className="p-0 bg-transparent border-none max-w-[95vw] max-h-[90vh] w-auto h-auto flex items-center justify-center" >
          {expandedImage && (
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={expandedImage}
                alt="Expanded product view"
                width={1200}
                height={1200}
                className="object-contain max-w-full max-h-[85vh]"
                priority
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}