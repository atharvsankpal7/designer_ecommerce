'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Grid, List, Star, ShoppingCart, Eye } from 'lucide-react';

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
  isFeatured: boolean;
  sections: ProductSection[];
}

interface ProductGridProps {
  products: Product[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  sort: string;
  priceRange?: string;
  sectionPath: string;
}

export function ProductGrid({ 
  products, 
  totalCount, 
  totalPages, 
  currentPage, 
  sort, 
  priceRange,
  sectionPath 
}: ProductGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', newSort);
    params.delete('page'); // Reset to first page
    router.push(`?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`?${params.toString()}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const calculateDiscount = (original: number, discount?: number) => {
    if (!discount) return 0;
    return Math.round(((original - discount) / original) * 100);
  };

  // Build proper section URL based on current section path context
  const buildSectionUrl = (sectionSlug: string) => {
    // If we're already in a section context, navigate to the specific section
    // Otherwise, navigate to the section directly
    return `/products/${sectionSlug}`;
  };

  // Get section badge variant based on section hierarchy level (if available)
  const getSectionBadgeVariant = (section: ProductSection) => {
    // You could extend this to show different variants for different levels
    // For now, we'll use a consistent style with hover effects
    return "outline";
  };

  const renderGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={product.displayImage}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            
            {product.isFeatured && (
              <Badge className="absolute top-2 left-2 bg-yellow-500 text-yellow-900">
                <Star className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
            
            {product.discountPrice && (
              <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                {calculateDiscount(product.originalPrice, product.discountPrice)}% OFF
              </Badge>
            )}
            
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="flex space-x-2">
                <Button size="sm" variant="secondary" asChild>
                  <Link href={`/products/${product.id}`}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
              <Link href={`/products/${product.id}`}>
                {product.title}
              </Link>
            </h3>
            
            <div className="flex flex-wrap gap-1 mb-3">
              {product.sections.slice(0, 2).map((section) => (
                <Badge 
                  key={section.id} 
                  variant="outline" 
                  className="text-xs hover:bg-purple-50 hover:border-purple-300 transition-colors cursor-pointer"
                  // asChild
                >
                  <Link href={`/products/${section.slug}`}>
                    {section.name}
                  </Link>
                </Badge>
              ))}
              {product.sections.length > 2 && (
                <Badge 
                  variant="outline" 
                  className="text-xs bg-gray-100 hover:bg-gray-200 transition-colors cursor-help"
                  title={`Also in: ${product.sections.slice(2).map(s => s.name).join(', ')}`}
                >
                  +{product.sections.length - 2}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {product.discountPrice ? (
                  <>
                    <span className="text-lg font-bold text-green-600">
                      {formatPrice(product.discountPrice)}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-bold text-gray-900">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-4">
      {products.map((product) => (
        <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex space-x-4">
              <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={product.displayImage}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {product.isFeatured && (
                  <Badge className="absolute top-1 left-1 bg-yellow-500 text-yellow-900 text-xs">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                      <Link href={`/products/${product.id}`}>
                        {product.title}
                      </Link>
                    </h3>
                    
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {product.sections.slice(0, 3).map((section) => (
                        <Badge 
                          key={section.id} 
                          variant="outline" 
                          className="text-xs hover:bg-purple-50 hover:border-purple-300 transition-colors cursor-pointer"
                          // asChild
                        >
                          <Link href={`/products/${section.slug}`}>
                            {section.name}
                          </Link>
                        </Badge>
                      ))}
                      {product.sections.length > 3 && (
                        <Badge 
                          variant="outline" 
                          className="text-xs bg-gray-100 hover:bg-gray-200 transition-colors cursor-help"
                          title={`Also in: ${product.sections.slice(3).map(s => s.name).join(', ')}`}
                        >
                          +{product.sections.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right ml-4">
                    <div className="flex items-center space-x-2 mb-3">
                      {product.discountPrice ? (
                        <>
                          <span className="text-xl font-bold text-green-600">
                            {formatPrice(product.discountPrice)}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                          <Badge className="bg-red-500 text-white text-xs">
                            {calculateDiscount(product.originalPrice, product.discountPrice)}% OFF
                          </Badge>
                        </>
                      ) : (
                        <span className="text-xl font-bold text-gray-900">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    
                    <Button asChild>
                      <Link href={`/products/${product.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Showing {((currentPage - 1) * 12) + 1}-{Math.min(currentPage * 12, totalCount)} of {totalCount} products
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          
          <Select value={sort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="name">Name: A to Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products */}
      {products?.length > 0 ? (
        <>
          {viewMode === 'grid' ? renderGridView() : renderListView()}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination>
                <PaginationContent>
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="cursor-pointer"
                      />
                    </PaginationItem>
                  )}
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={page === currentPage}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  {currentPage < totalPages && (
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="cursor-pointer"
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <ShoppingCart className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p>Try adjusting your filters or browse other categories.</p>
          </div>
          
          <Button asChild variant="outline">
            <Link href="/products">
              Browse All Products
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}