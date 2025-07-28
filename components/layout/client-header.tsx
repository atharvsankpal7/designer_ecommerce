'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Phone, ChevronDown, Search } from 'lucide-react';
import { motion } from "framer-motion";
import { Button } from '@/components/ui/button';
import { SectionHierarchy } from '@/types/section';

import { SSRMobileNavigation } from './ssr-mobile-navigation';
import { SearchDropdown } from './search-dropdown';

interface ClientHeaderProps {
  navigationSections: SectionHierarchy[];
  headerData: {
    phone: string;
    whatsappNumber: string;
  };
}

export function ClientHeader({ navigationSections, headerData }: ClientHeaderProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const buildSectionUrl = (section: SectionHierarchy): string => {
    return `/products?section=${encodeURIComponent(section.name)}`;
  };

  const renderDesktopSubMenu = (children: SectionHierarchy[], level = 1) => {
    if (!children || children.length === 0) return null;

    return (
      <div className={`absolute ${level === 1 ? 'top-full left-0 mt-2' : 'top-0 left-full ml-2'} 
                      min-w-[220px] bg-white shadow-2xl border border-gray-200 rounded-xl py-3 z-50 
                      opacity-0 invisible group-hover:opacity-100 group-hover:visible
                      transition-all duration-300 ease-out transform
                      ${level === 1 ? 'translate-y-2 group-hover:translate-y-0' : 'translate-x-2 group-hover:translate-x-0'}`}>
        <div className="px-2">
          {children.map((child, index) => (
            <div key={child.id} className="relative group/child">
              <Link
                href={buildSectionUrl(child)}
                className="flex items-center justify-between px-3 py-2.5 text-gray-700 
                           hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 
                           hover:to-pink-50 transition-all duration-200 rounded-lg"
              >
                <span className="font-medium text-sm">{child.name}</span>
                {child.children && child.children.length > 0 && (
                  <ChevronDown className="h-3.5 w-3.5 -rotate-90 text-gray-400 
                                       hover:text-purple-600 transition-colors" />
                )}
              </Link>
              
                {/* Only show subsubsection when hovering over this specific subsection */}
              {child.children && child.children.length > 0 && (
                <div className="absolute top-0 left-full ml-2 min-w-[220px] bg-white 
                               shadow-2xl border border-gray-200 rounded-xl py-3 z-50 
                               opacity-0 invisible group-hover/child:opacity-100 group-hover/child:visible
                               transition-all duration-300 ease-out transform
                               translate-x-2 group-hover/child:translate-x-0">
                  <div className="px-2">
                    {child.children.map((grandChild: SectionHierarchy, grandIndex: number) => (
                      <div key={grandChild.id}>
                        <Link
                          href={buildSectionUrl(grandChild)}
                          className="flex items-center justify-between px-3 py-2.5 text-gray-700 
                                     hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 
                                     hover:to-pink-50 transition-all duration-200 rounded-lg"
                        >
                          <span className="font-medium text-sm">{grandChild.name}</span>
                        </Link>
                        
                        {child.children && grandIndex < child.children.length - 1 && (
                          <div className="mx-3 my-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {index < children.length - 1 && (
                <div className="mx-3 my-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <motion.div 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/96 backdrop-blur-md shadow-lg border-b border-purple-100/60' 
          : 'bg-white/92 backdrop-blur-sm shadow-sm'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="group flex items-center space-x-2">
            <div className="relative">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Image src={"/header-logo.png"} width={80} height={80} alt='LOGO'/>
              </div>
            </div>
            <span className="text-xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              SS Creation
            </span>
          </Link>
          
          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <SearchDropdown className="w-full" />
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            <a 
              href={`tel:${headerData.phone.replace(/\s/g, '')}`} 
              className="flex items-center text-gray-600 hover:text-purple-600 transition-colors duration-300 group text-sm"
            >
              <div className="w-7 h-7 bg-purple-100 rounded-full flex items-center justify-center mr-2 group-hover:bg-purple-200 transition-colors">
                <Phone className="h-4 w-4" />
              </div>
              <span className="font-medium text-sm">{headerData.phone}</span>
            </a>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden w-8 h-8 rounded-full hover:bg-purple-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
        
        {/* Desktop Navigation - Multi-row support */}
        <div className="hidden lg:block border-t border-gray-100/60">
          <nav className="py-3">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <Link 
                href="/" 
                className="relative text-gray-700 hover:text-purple-600 transition-colors duration-300 font-medium group py-1 text-sm"
              >
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              
              <Link 
                href="/about" 
                className="relative text-gray-700 hover:text-purple-600 transition-colors duration-300 font-medium group py-1 text-sm"
              >
                About
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              
              <Link 
                href="/products" 
                className="relative text-gray-700 hover:text-purple-600 transition-colors duration-300 font-medium group py-1 text-sm"
              >
                Products
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              
              {/* Dynamic Section Navigation */}
              {navigationSections.map((section) => (
                <div key={section.id} className="relative group">
                  <Link
                    href={buildSectionUrl(section)}
                    className="flex items-center space-x-1 text-gray-700 hover:text-purple-600 
                               transition-colors duration-300 font-medium group py-1 text-sm"
                  >
                    <span>{section.name}</span>
                    {section.children && section.children.length > 0 && (
                      <ChevronDown className="h-3 w-3 text-gray-400 group-hover:text-purple-600 
                                           transition-all duration-300 group-hover:rotate-180" />
                    )}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r 
                                     from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                  
                  {section.children && section.children.length > 0 && (
                    renderDesktopSubMenu(section.children)
                  )}
                </div>
              ))}
              
              <Link 
                href="/bundles" 
                className="relative text-gray-700 hover:text-purple-600 transition-colors duration-300 font-medium group py-1 text-sm"
              >
                Bundles
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              
              <Link 
                href="/contact" 
                className="relative text-gray-700 hover:text-purple-600 transition-colors duration-300 font-medium group py-1 text-sm"
              >
                Contact
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </div>
          </nav>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <motion.div 
            className="lg:hidden py-4 border-t border-purple-100"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Mobile Search */}
            <div className="mb-4">
              <SearchDropdown 
                className="w-full" 
                onResultClick={() => setIsMenuOpen(false)}
              />
            </div>
            
            <div className="flex flex-col space-y-2">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-purple-600 transition-colors duration-300 font-medium py-2 px-3 rounded-lg hover:bg-purple-50 text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/about" 
                className="text-gray-700 hover:text-purple-600 transition-colors duration-300 font-medium py-2 px-3 rounded-lg hover:bg-purple-50 text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/products" 
                className="text-gray-700 hover:text-purple-600 transition-colors duration-300 font-medium py-2 px-3 rounded-lg hover:bg-purple-50 text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              
              {/* Mobile Section Navigation */}
              <SSRMobileNavigation 
                sections={navigationSections} 
                onLinkClick={() => setIsMenuOpen(false)} 
              />
              
              <Link 
                href="/bundles" 
                className="text-gray-700 hover:text-purple-600 transition-colors duration-300 font-medium py-2 px-3 rounded-lg hover:bg-purple-50 text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Bundles
              </Link>
              <Link 
                href="/contact" 
                className="text-gray-700 hover:text-purple-600 transition-colors duration-300 font-medium py-2 px-3 rounded-lg hover:bg-purple-50 text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              
              <div className="pt-3 border-t border-gray-200">
                <a 
                  href={`tel:${headerData.phone.replace(/\s/g, '')}`} 
                  className="flex items-center text-gray-600 hover:text-purple-600 transition-colors duration-300 py-2 px-3 rounded-lg hover:bg-purple-50 text-sm"
                >
                  <Phone className="h-4 w-4 mr-3" />
                  {headerData.phone}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}