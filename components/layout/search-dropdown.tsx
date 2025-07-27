'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Package, Gift, Folder, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SearchResult {
  products: Array<{
    id: string;
    title: string;
    description: string;
    displayImage: string;
    originalPrice: number;
    discountPrice?: number;
    type: 'product';
    url: string;
    sections: Array<{ name: string; slug: string }>;
  }>;
  bundles: Array<{
    id: string;
    name: string;
    description: string;
    displayImage: string;
    originalPrice: number;
    discountPrice?: number;
    type: 'bundle';
    url: string;
    productCount: number;
  }>;
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    level: number;
    type: 'category';
    url: string;
  }>;
  totalResults: number;
}

interface SearchDropdownProps {
  className?: string;
  placeholder?: string;
  onResultClick?: () => void;
}

export function SearchDropdown({ 
  className = '', 
  placeholder = "Search products, bundles, categories...",
  onResultClick 
}: SearchDropdownProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        performSearch(searchQuery.trim());
      } else {
        setSearchResults(null);
        setIsDropdownOpen(false);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery]);

  const performSearch = async (query: string) => {
    setIsSearching(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setSearchResults(data);
      setIsDropdownOpen(true);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsDropdownOpen(false);
      onResultClick?.();
    }
  };

  const handleResultClick = (url: string) => {
    router.push(url);
    setSearchQuery('');
    setIsDropdownOpen(false);
    onResultClick?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!searchResults || !isDropdownOpen) return;

    const allResults = [
      ...searchResults.categories.map(c => ({ ...c, type: 'category' as const })),
      ...searchResults.products.map(p => ({ ...p, type: 'product' as const })),
      ...searchResults.bundles.map(b => ({ ...b, type: 'bundle' as const }))
    ];

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, allResults.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && allResults[selectedIndex]) {
          handleResultClick(allResults[selectedIndex].url);
        } else {
          handleSubmit(e);
        }
        break;
      case 'Escape':
        setIsDropdownOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const formatPrice = (price: number) => `₹${price.toLocaleString()}`;

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (searchResults && searchQuery.trim().length >= 2) {
                setIsDropdownOpen(true);
              }
            }}
            onKeyDown={handleKeyDown}
            className="pl-10 pr-4 py-2 w-full rounded-full border transition-all duration-300 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 bg-white/90"
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-purple-300 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {isDropdownOpen && searchResults && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-hidden shadow-xl border border-purple-100">
          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto">
              {searchResults.totalResults === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No results found for "{searchQuery}"</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {/* Categories */}
                  {searchResults.categories.length > 0 && (
                    <div>
                      <div className="px-4 py-2 bg-gray-50 border-b">
                        <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center">
                          <Folder className="h-3 w-3 mr-1" />
                          Categories ({searchResults.categories.length})
                        </h4>
                      </div>
                      {searchResults.categories.map((category, index) => (
                        <button
                          key={category.id}
                          onClick={() => handleResultClick(category.url)}
                          className={`w-full text-left px-4 py-3 hover:bg-purple-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                            selectedIndex === index ? 'bg-purple-50' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Folder className="h-4 w-4 text-purple-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{category.name}</p>
                                <p className="text-xs text-gray-500">Level {category.level} Category</p>
                              </div>
                            </div>
                            <ArrowRight className="h-4 w-4 text-gray-400" />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Products */}
                  {searchResults.products.length > 0 && (
                    <div>
                      <div className="px-4 py-2 bg-gray-50 border-b">
                        <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center">
                          <Package className="h-3 w-3 mr-1" />
                          Products ({searchResults.products.length})
                        </h4>
                      </div>
                      {searchResults.products.map((product, index) => {
                        const adjustedIndex = searchResults.categories.length + index;
                        return (
                          <button
                            key={product.id}
                            onClick={() => handleResultClick(product.url)}
                            className={`w-full text-left px-4 py-3 hover:bg-purple-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                              selectedIndex === adjustedIndex ? 'bg-purple-50' : ''
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                <Image
                                  src={product.displayImage}
                                  alt={product.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 truncate">{product.title}</p>
                                <p className="text-sm text-gray-500 truncate">{product.description}</p>
                                <div className="flex items-center space-x-2 mt-1">
                                  {product.discountPrice ? (
                                    <>
                                      <span className="text-sm font-bold text-green-600">
                                        {formatPrice(product.discountPrice)}
                                      </span>
                                      <span className="text-xs text-gray-400 line-through">
                                        {formatPrice(product.originalPrice)}
                                      </span>
                                    </>
                                  ) : (
                                    <span className="text-sm font-bold text-gray-900">
                                      {formatPrice(product.originalPrice)}
                                    </span>
                                  )}
                                  {product.sections.length > 0 && (
                                    <Badge variant="outline" className="text-xs">
                                      {product.sections[0].name}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Bundles */}
                  {searchResults.bundles.length > 0 && (
                    <div>
                      <div className="px-4 py-2 bg-gray-50 border-b">
                        <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center">
                          <Gift className="h-3 w-3 mr-1" />
                          Bundles ({searchResults.bundles.length})
                        </h4>
                      </div>
                      {searchResults.bundles.map((bundle, index) => {
                        const adjustedIndex = searchResults.categories.length + searchResults.products.length + index;
                        return (
                          <button
                            key={bundle.id}
                            onClick={() => handleResultClick(bundle.url)}
                            className={`w-full text-left px-4 py-3 hover:bg-purple-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                              selectedIndex === adjustedIndex ? 'bg-purple-50' : ''
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                <Image
                                  src={bundle.displayImage}
                                  alt={bundle.name}
                                  fill
                                  className="object-cover"
                                />
                                <div className="absolute top-1 left-1">
                                  <Gift className="h-3 w-3 text-white bg-emerald-500 rounded-full p-0.5" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 truncate">{bundle.name}</p>
                                <p className="text-sm text-gray-500 truncate">{bundle.description}</p>
                                <div className="flex items-center space-x-2 mt-1">
                                  {bundle.discountPrice ? (
                                    <>
                                      <span className="text-sm font-bold text-green-600">
                                        {formatPrice(bundle.discountPrice)}
                                      </span>
                                      <span className="text-xs text-gray-400 line-through">
                                        {formatPrice(bundle.originalPrice)}
                                      </span>
                                    </>
                                  ) : (
                                    <span className="text-sm font-bold text-gray-900">
                                      {formatPrice(bundle.originalPrice)}
                                    </span>
                                  )}
                                  <Badge variant="outline" className="text-xs">
                                    {bundle.productCount} items
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* View All Results */}
                  <div className="p-3 bg-gray-50 border-t">
                    <Button
                      onClick={() => handleSubmit(new Event('submit') as any)}
                      variant="ghost"
                      className="w-full text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                    >
                      View all results for "{searchQuery}"
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}